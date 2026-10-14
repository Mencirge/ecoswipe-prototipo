// scripts/logic_counter_12.mjs
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const PATTERNS = [
  'useState',
  'useEffect',
  'useMemo',
  'useRef',
  'onClick=',
  'onChange=',
  'onSubmit=',
  'navigate\\(',
  'value=',
  'checked=',
  'disabled=',
  'required'
]

const REGEX_12 = new RegExp(PATTERNS.join('|'), 'g')

function getAllSrcFiles() {
  const output = execSync('git ls-tree -r --name-only HEAD src/', { encoding: 'utf8' })
  return output.trim().split(/\r?\n/).filter(Boolean)
}

function countMatches(content, regex) {
  if (!content) return 0
  const matches = content.match(regex)
  return matches ? matches.length : 0
}

function countPerPattern(content) {
  const res = {}
  for (const p of PATTERNS) {
    const r = new RegExp(p, 'g')
    res[p] = countMatches(content, r)
  }
  return res
}

export function runAudit(baselineRef = 'rediseno-v1.3-deploy') {
  const files = getAllSrcFiles()
  const rows = []

  let totalBaseline = 0
  let totalHead = 0

  for (const relPath of files) {
    let baseContent = ''
    try {
      baseContent = execSync(`git show ${baselineRef}:${relPath}`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] })
    } catch {
      baseContent = ''
    }

    let headContent = ''
    try {
      if (fs.existsSync(relPath)) {
        headContent = fs.readFileSync(relPath, 'utf8')
      } else {
        headContent = execSync(`git show HEAD:${relPath}`, { encoding: 'utf8' })
      }
    } catch {
      headContent = ''
    }

    // Only count if it's text/code (exclude binary images/svg if non-text)
    const isCode = relPath.endsWith('.jsx') || relPath.endsWith('.js') || relPath.endsWith('.css') || relPath.endsWith('.json') || relPath.endsWith('.html')
    if (!isCode) continue

    const baseCount = countMatches(baseContent, REGEX_12)
    const headCount = countMatches(headContent, REGEX_12)
    const diff = headCount - baseCount

    totalBaseline += baseCount
    totalHead += headCount

    rows.push({
      file: relPath,
      baseCount,
      headCount,
      diff,
      baseBreakdown: countPerPattern(baseContent),
      headBreakdown: countPerPattern(headContent)
    })
  }

  console.log(`=== AUDITORÍA DE CONTEO DE LÓGICA (12 PATRONES OFICIALES) ===`)
  console.log(`Baseline: ${baselineRef} | HEAD: rediseno-v1.4-mobile\n`)
  console.log('| Archivo | Baseline | HEAD | Diferencia | Estado |')
  console.log('|---|:---:|:---:|:---:|:---:|')

  for (const r of rows) {
    const diffStr = r.diff === 0 ? '0' : (r.diff > 0 ? `+${r.diff}` : `${r.diff}`)
    const status = r.diff === 0 ? 'INTACTO' : (r.diff > 0 ? 'ALERTA (+)' : 'ALERTA (-)')
    console.log(`| \`${r.file}\` | ${r.baseCount} | ${r.headCount} | ${diffStr} | ${status} |`)
  }

  console.log(`| **TOTAL GENERAL** | **${totalBaseline}** | **${totalHead}** | **${totalHead - totalBaseline}** | **${totalHead === totalBaseline ? '100% IDÉNTICO' : 'DIVERGENCIA'}** |`)

  console.log('\n=== DESGLOSE POR PATRÓN (TOTAL EN TODO SRC/) ===')
  console.log('| Patrón | Baseline | HEAD | Diferencia |')
  console.log('|---|:---:|:---:|:---:|')
  for (const p of PATTERNS) {
    let pBase = 0
    let pHead = 0
    for (const r of rows) {
      pBase += r.baseBreakdown[p]
      pHead += r.headBreakdown[p]
    }
    const d = pHead - pBase
    console.log(`| \`${p}\` | ${pBase} | ${pHead} | ${d === 0 ? '0' : (d > 0 ? `+${d}` : `${d}`)} |`)
  }
}

runAudit()
