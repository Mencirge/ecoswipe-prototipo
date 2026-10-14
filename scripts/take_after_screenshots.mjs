import puppeteer from 'puppeteer-core'
import path from 'path'
import fs from 'fs'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const CAPTURAS_DIR = path.resolve('capturas')
fs.mkdirSync(CAPTURAS_DIR, { recursive: true })

const DESKTOP_VIEWPORTS = [
  { name: '768', width: 768, height: 1024 },
  { name: '1024', width: 1024, height: 800 },
  { name: '1280', width: 1280, height: 800 },
]

const MOBILE_VIEWPORTS = [
  { name: '360', width: 360, height: 740 },
  { name: '390', width: 390, height: 844 },
  { name: '412', width: 412, height: 915 },
]

const ALL_SCREENS = [
  { id: 'inicio', url: 'http://localhost:5173/#/' },
  { id: 'mercado', url: 'http://localhost:5173/#/mercado' },
  { id: 'detalle_lote', url: 'http://localhost:5173/#/lote/1' },
  { id: 'perfil_vendedor', url: 'http://localhost:5173/#/tienda/t1' },
  { id: 'publicar_paso1', url: 'http://localhost:5173/#/publicar' },
  { id: 'impacto', url: 'http://localhost:5173/#/impacto' },
]

const MOBILE_SCREENS = [
  { id: 'inicio', url: 'http://localhost:5173/#/' },
  { id: 'mercado', url: 'http://localhost:5173/#/mercado' },
  { id: 'detalle_lote', url: 'http://localhost:5173/#/lote/1' },
  { id: 'publicar_paso1', url: 'http://localhost:5173/#/publicar' },
]

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  console.log('--- Tomando capturas Desktop DESPUÉS ---')
  for (const vp of DESKTOP_VIEWPORTS) {
    const page = await browser.newPage()
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 })
    for (const sc of ALL_SCREENS) {
      await page.goto(sc.url, { waitUntil: 'networkidle0' })
      await new Promise(r => setTimeout(r, 400))
      const filename = `d${vp.name}_${sc.id}_despues.png`
      await page.screenshot({ path: path.join(CAPTURAS_DIR, filename), fullPage: false })
      console.log(`Guardado ${filename}`)
    }
    await page.close()
  }

  console.log('\n--- Tomando capturas Mobile DESPUÉS ---')
  for (const vp of MOBILE_VIEWPORTS) {
    const page = await browser.newPage()
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 })
    for (const sc of MOBILE_SCREENS) {
      await page.goto(sc.url, { waitUntil: 'networkidle0' })
      await new Promise(r => setTimeout(r, 400))
      const filename = `m${vp.name}_${sc.id}_despues.png`
      await page.screenshot({ path: path.join(CAPTURAS_DIR, filename), fullPage: false })
      console.log(`Guardado ${filename}`)
    }
    await page.close()
  }

  await browser.close()
  console.log('Capturas DESPUÉS completadas con éxito.')
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
