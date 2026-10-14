// scripts/expanded_desktop_pixel_diff.mjs
import puppeteer from 'puppeteer-core'
import path from 'path'
import fs from 'fs'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const CAPTURAS_DIR = path.resolve('capturas')
fs.mkdirSync(CAPTURAS_DIR, { recursive: true })

const VIEWPORTS = [
  { name: '768', width: 768, height: 1024 },
  { name: '1024', width: 1024, height: 800 },
  { name: '1280', width: 1280, height: 800 }
]

const SCENARIOS = [
  { id: 'inicio', type: 'url', path: '/#/' },
  { id: 'mercado', type: 'url', path: '/#/mercado' },
  { id: 'detalle_lote', type: 'url', path: '/#/lote/l1' },
  { id: 'perfil_vendedor', type: 'url', path: '/#/tienda/t1' },
  { id: 'publicar_paso1', type: 'url', path: '/#/publicar' },
  { id: 'impacto', type: 'url', path: '/#/impacto' },
  { id: 'detalle_modal_contacto', type: 'action', path: '/#/lote/l1', action: async (page) => {
    await page.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.includes('Contactar'))?.click())
    await new Promise(r => setTimeout(r, 400))
  }},
  { id: 'detalle_modal_oferta', type: 'action', path: '/#/lote/l1', action: async (page) => {
    await page.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.includes('Hacer oferta'))?.click())
    await new Promise(r => setTimeout(r, 400))
  }},
  { id: 'detalle_modal_confirmar', type: 'action', path: '/#/lote/l1', action: async (page) => {
    await page.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.includes('Confirmar entrega'))?.click())
    await new Promise(r => setTimeout(r, 400))
  }},
  { id: 'detalle_modal_trato_cerrado', type: 'action', path: '/#/lote/l1', action: async (page) => {
    await page.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.includes('Confirmar entrega'))?.click())
    await new Promise(r => setTimeout(r, 300))
    await page.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.includes('Entregué'))?.click())
    await new Promise(r => setTimeout(r, 400))
  }},
  { id: 'publicar_modal_preview', type: 'action', path: '/#/publicar', action: async (page) => {
    await page.type('input[name="composicion"]', '100% Algodón')
    await page.type('input[name="color"]', 'Azul')
    await page.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Siguiente')?.click())
    await new Promise(r => setTimeout(r, 200))
    await page.type('input[name="pesoKg"]', '10')
    await page.type('input[name="precioKg"]', '15')
    await page.type('input[name="tamanoMinPieza"]', '50x50 cm')
    await page.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Siguiente')?.click())
    await new Promise(r => setTimeout(r, 200))
    await page.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.includes('Vista previa'))?.click())
    await new Promise(r => setTimeout(r, 400))
  }},
  { id: 'publicar_modal_exito', type: 'action', path: '/#/publicar', action: async (page) => {
    await page.type('input[name="composicion"]', '100% Algodón')
    await page.type('input[name="color"]', 'Azul')
    await page.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Siguiente')?.click())
    await new Promise(r => setTimeout(r, 200))
    await page.type('input[name="pesoKg"]', '10')
    await page.type('input[name="precioKg"]', '15')
    await page.type('input[name="tamanoMinPieza"]', '50x50 cm')
    await page.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Siguiente')?.click())
    await new Promise(r => setTimeout(r, 200))
    await page.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.includes('Vista previa'))?.click())
    await new Promise(r => setTimeout(r, 300))
    await page.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.includes('Confirmar y Publicar'))?.click())
    await new Promise(r => setTimeout(r, 400))
  }},
  { id: 'mercado_vacio', type: 'url', path: '/#/mercado?q=xyzinexistente' },
  { id: 'lote_no_encontrado', type: 'url', path: '/#/lote/9999' },
  { id: 'tienda_no_encontrada', type: 'url', path: '/#/tienda/inexistente' }
]

async function capturePort(port, suffix) {
  console.log(`\n--- Capturando puerto ${port} (${suffix}) ---`)
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  for (const vp of VIEWPORTS) {
    for (const sc of SCENARIOS) {
      const page = await browser.newPage()
      await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 })
      await page.goto(`http://localhost:${port}${sc.path}`, { waitUntil: 'networkidle0' })
      // Freeze CSS animations for determinism
      await page.addStyleTag({
        content: '*, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; }'
      })
      await new Promise(r => setTimeout(r, 200))

      if (sc.type === 'action' && sc.action) {
        await sc.action(page)
      }

      await new Promise(r => setTimeout(r, 300))
      const filename = `d${vp.name}_${sc.id}_${suffix}.png`
      await page.screenshot({ path: path.join(CAPTURAS_DIR, filename), fullPage: false })
      await page.close()
      process.stdout.write(`.` )
    }
  }
  await browser.close()
  console.log(`\nCapturas ${suffix} finalizadas.`)
}

async function compareImages(fileA, fileB) {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  })
  const page = await browser.newPage()

  const b64A = fs.readFileSync(fileA).toString('base64')
  const b64B = fs.readFileSync(fileB).toString('base64')

  await page.setContent(`
    <html>
      <body style="margin:0;">
        <img id="imgA" src="data:image/png;base64,${b64A}" />
        <img id="imgB" src="data:image/png;base64,${b64B}" />
      </body>
    </html>
  `)

  await new Promise(r => setTimeout(r, 200))

  const result = await page.evaluate(() => {
    const a = document.getElementById('imgA')
    const b = document.getElementById('imgB')
    const w = Math.max(a.naturalWidth, b.naturalWidth)
    const h = Math.max(a.naturalHeight, b.naturalHeight)

    const cA = document.createElement('canvas')
    cA.width = w; cA.height = h
    const ctxA = cA.getContext('2d')
    ctxA.drawImage(a, 0, 0)
    const dataA = ctxA.getImageData(0, 0, w, h).data

    const cB = document.createElement('canvas')
    cB.width = w; cB.height = h
    const ctxB = cB.getContext('2d')
    ctxB.drawImage(b, 0, 0)
    const dataB = ctxB.getImageData(0, 0, w, h).data

    let diffPixels = 0
    const totalPixels = w * h

    for (let i = 0; i < dataA.length; i += 4) {
      const dr = Math.abs(dataA[i] - dataB[i])
      const dg = Math.abs(dataA[i+1] - dataB[i+1])
      const db = Math.abs(dataA[i+2] - dataB[i+2])
      const da = Math.abs(dataA[i+3] - dataB[i+3])
      if (dr > 0 || dg > 0 || db > 0 || da > 0) {
        diffPixels++
      }
    }

    return { w, h, totalPixels, diffPixels, diffPercent: (diffPixels / totalPixels) * 100 }
  })

  await browser.close()
  return result
}

async function run() {
  const allBaselinesExist = VIEWPORTS.every(vp =>
    SCENARIOS.every(sc => fs.existsSync(path.join(CAPTURAS_DIR, `d${vp.name}_${sc.id}_baseline.png`)))
  )
  if (!allBaselinesExist) {
    await capturePort(5174, 'baseline')
  } else {
    console.log('--- Usando capturas baseline pre-existentes verificadas (rediseno-v1.3-deploy) ---')
  }
  await capturePort(5173, 'head')

  console.log('\n=== DIFF DE PÍXELES DESKTOP AMPLIADO (BASELINE v1.3 vs HEAD) ===\n')
  console.log('| Viewport | Pantalla / Modal | Dimensiones | Total Píxeles | Píxeles Distintos | % Diferencia | Veredicto |')
  console.log('|---|---|:---:|:---:|:---:|:---:|---|')

  let totalDiff = 0
  let totalEvaluated = 0

  for (const vp of VIEWPORTS) {
    for (const sc of SCENARIOS) {
      totalEvaluated++
      const fileA = path.join(CAPTURAS_DIR, `d${vp.name}_${sc.id}_baseline.png`)
      const fileB = path.join(CAPTURAS_DIR, `d${vp.name}_${sc.id}_head.png`)
      
      const res = await compareImages(fileA, fileB)
      totalDiff += res.diffPixels
      const verdict = res.diffPixels === 0 ? '0 PÍXELES (INTACTO)' : `DIFERENCIA (${res.diffPixels} px)`
      console.log(`| ${vp.name}px | \`${sc.id}\` | ${res.w}x${res.h} | ${res.totalPixels.toLocaleString()} | ${res.diffPixels} | ${res.diffPercent.toFixed(4)}% | ${verdict} |`)
    }
  }

  console.log(`\n==================================================`)
  console.log(`TOTAL COMPARACIONES: ${totalEvaluated} (15 vistas x 3 resoluciones)`)
  console.log(`TOTAL PÍXELES DISTINTOS EN ESCRITORIO: ${totalDiff}`)
  console.log(`ESTADO GENERAL ESCRITORIO: ${totalDiff === 0 ? '100% IDÉNTICO (0 PÍXELES DISTINTOS)' : 'FALLO'}`)
  console.log(`==================================================`)
}

run().catch(console.error)
