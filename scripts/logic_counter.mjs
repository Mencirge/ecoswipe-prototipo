import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const SRC_DIR = path.resolve('src')

function getAllFiles(dir, exts = ['.jsx', '.js']) {
  let files = []
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item)
    if (fs.statSync(full).isDirectory()) {
      files = files.concat(getAllFiles(full, exts))
    } else if (exts.some(ext => item.endsWith(ext))) {
      files.push(full)
    }
  }
  return files
}

function countLogic(code) {
  // Count key logic constructs:
  // 1. Hooks
  const hooks = (code.match(/\buse(State|Effect|Memo|Callback|Ref|Params|SearchParams|Location|Navigate)\b/g) || []).length
  // 2. State setters
  const setters = (code.match(/\bset[A-Z][a-zA-Z0-9_]*\(/g) || []).length
  // 3. Conditionals / loops outside JSX
  const ifs = (code.match(/\b(if|else if|switch|case|while|for)\b/g) || []).length
  // 4. Function definitions (handlers / helpers)
  const funcs = (code.match(/\bfunction\s+[a-zA-Z0-9_]+|\bconst\s+[a-zA-Z0-9_]+\s*=\s*(\([^)]*\)|[a-zA-Z0-9_]+)\s*=>/g) || []).length
  // 5. Event handler props (onClick, onChange, onSubmit, onKeyDown, etc.)
  const handlers = (code.match(/\bon[A-Z][a-zA-Z0-9_]*=\{/g) || []).length
  // 6. Routes
  const routes = (code.match(/<Route\b/g) || []).length

  const totalLogic = hooks + setters + ifs + funcs + handlers + routes
  return { hooks, setters, ifs, funcs, handlers, routes, totalLogic }
}

export function compareLogic(ref = 'rediseno-v1.3-deploy') {
  const files = getAllFiles(SRC_DIR)
  const results = []

  for (const file of files) {
    const rel = path.relative(path.resolve('.'), file).replace(/\\/g, '/')
    let baseCode = ''
    try {
      baseCode = execSync(`git show ${ref}:${rel}`, { encoding: 'utf8' })
    } catch {
      baseCode = ''
    }
    const curCode = fs.readFileSync(file, 'utf8')

    const baseCount = countLogic(baseCode)
    const curCount = countLogic(curCode)

    results.push({
      file: rel,
      base: baseCount,
      current: curCount,
      diff: curCount.totalLogic - baseCount.totalLogic
    })
  }

  return results
}

if (process.argv[1].endsWith('logic_counter.mjs')) {
  const ref = process.argv[2] || 'rediseno-v1.3-deploy'
  console.log(`=== COMPARACIÓN DE CONTEO DE LÓGICA (${ref} vs ACTUAL) ===\n`)
  const res = compareLogic(ref)
  console.log('| Archivo | Hooks (B/C) | Setters (B/C) | If/Control (B/C) | Funcs (B/C) | Handlers (B/C) | Total Lógica (B/C) | Dif |')
  console.log('|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|')
  let totalBase = 0
  let totalCur = 0
  for (const r of res) {
    totalBase += r.base.totalLogic
    totalCur += r.current.totalLogic
    console.log(`| \`${r.file}\` | ${r.base.hooks}/${r.current.hooks} | ${r.base.setters}/${r.current.setters} | ${r.base.ifs}/${r.current.ifs} | ${r.base.funcs}/${r.current.funcs} | ${r.base.handlers}/${r.current.handlers} | ${r.base.totalLogic}/${r.current.totalLogic} | ${r.diff === 0 ? '0' : (r.diff > 0 ? '+' + r.diff : r.diff)} |`)
  }
  console.log(`\nTOTALES: Baseline = ${totalBase}, Actual = ${totalCur}, Diferencia neta = ${totalCur - totalBase}`)
}
