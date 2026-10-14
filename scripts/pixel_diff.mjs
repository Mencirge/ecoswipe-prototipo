import puppeteer from 'puppeteer-core'
import path from 'path'
import fs from 'fs'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const CAPTURAS_DIR = path.resolve('capturas')

export async function compareImages(fileA, fileB, _diffOut = null) {
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
        <canvas id="c"></canvas>
      </body>
    </html>
  `)

  await new Promise(r => setTimeout(r, 400))

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
      // Tolerance threshold
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
  const DESKTOP_VIEWPORTS = ['768', '1024', '1280']
  const SCREENS = ['inicio', 'mercado', 'detalle_lote', 'perfil_vendedor', 'publicar_paso1', 'impacto']

  console.log('=== DIFF DE PÍXELES DESKTOP (ANTES vs DESPUÉS) ===\n')
  console.log('| Viewport | Pantalla | Dimensiones | Total Píxeles | Píxeles Distintos | % Diferencia | Veredicto |')
  console.log('|---|---|:---:|:---:|:---:|:---:|---|')

  let totalDiff = 0
  for (const vp of DESKTOP_VIEWPORTS) {
    for (const sc of SCREENS) {
      const fileA = path.join(CAPTURAS_DIR, `d${vp}_${sc}_antes.png`)
      const fileB = path.join(CAPTURAS_DIR, `d${vp}_${sc}_despues.png`)
      if (!fs.existsSync(fileA) || !fs.existsSync(fileB)) {
        console.log(`| ${vp}px | ${sc} | - | - | Archivos faltantes | - | ERROR |`)
        continue
      }
      const res = await compareImages(fileA, fileB)
      totalDiff += res.diffPixels
      const verdict = res.diffPixels === 0 ? '0 PÍXELES (INTACTO)' : 'DIFERENCIA DETECTADA'
      console.log(`| ${vp}px | ${sc} | ${res.w}x${res.h} | ${res.totalPixels} | ${res.diffPixels} | ${res.diffPercent.toFixed(4)}% | ${verdict} |`)
    }
  }
  console.log(`\nTOTAL PÍXELES DISTINTOS EN ESCRITORIO: ${totalDiff}`)
}

if (process.argv[1].endsWith('pixel_diff.mjs')) {
  run().catch(console.error)
}
