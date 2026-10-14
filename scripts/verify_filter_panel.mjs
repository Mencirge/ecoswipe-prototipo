import puppeteer from 'puppeteer-core'
import path from 'path'
import fs from 'fs'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const CAPTURAS_DIR = path.resolve('capturas')
fs.mkdirSync(CAPTURAS_DIR, { recursive: true })

const VIEWPORTS = [
  { name: '360x640', width: 360, height: 640 },
  { name: '360x740', width: 360, height: 740 },
  { name: '390x844', width: 390, height: 844 },
  { name: '360x650 (Safari -90px)', width: 360, height: 650 }
]

async function verify() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  })

  console.log('=== VERIFICACIÓN (b) PANEL DE FILTROS MÓVIL ===\n')
  const results = []

  for (const vp of VIEWPORTS) {
    const page = await browser.newPage()
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 })
    await page.goto('http://localhost:5173/#/mercado', { waitUntil: 'networkidle0' })
    await new Promise(r => setTimeout(r, 200))

    // Click Filtros button
    await page.evaluate(() => {
      const btn = [...document.querySelectorAll('button')].find(b => b.textContent.includes('Filtros'))
      btn?.click()
    })
    await new Promise(r => setTimeout(r, 400))

    const filename = `panel_filtros_${vp.width}x${vp.height}.png`
    await page.screenshot({ path: path.join(CAPTURAS_DIR, filename), fullPage: false })

    const metrics = await page.evaluate((vpHeight) => {
      const overlay = document.querySelector('.fixed.inset-0.z-\\[60\\]') || document.querySelector('.fixed.inset-0')
      const bottomNav = document.querySelector('.bottom-nav')
      const bNavRect = bottomNav ? bottomNav.getBoundingClientRect() : null
      const bNavZ = bottomNav ? window.getComputedStyle(bottomNav).zIndex : null

      const panel = document.querySelector('.rounded-t-tarjeta')
      const pRect = panel ? panel.getBoundingClientRect() : null
      const panelZ = overlay ? window.getComputedStyle(overlay).zIndex : null

      // Find the apply button
      const applyBtn = [...document.querySelectorAll('button')].find(b => b.textContent.includes('resultado'))
      const btnRect = applyBtn ? applyBtn.getBoundingClientRect() : null

      // Header of panel
      const header = panel ? panel.querySelector('.border-b') : null
      const hRect = header ? header.getBoundingClientRect() : null

      return {
        panel: pRect ? { top: Math.round(pRect.top), bottom: Math.round(pRect.bottom), height: Math.round(pRect.height) } : null,
        header: hRect ? { top: Math.round(hRect.top), bottom: Math.round(hRect.bottom), height: Math.round(hRect.height) } : null,
        button: btnRect ? {
          top: Math.round(btnRect.top),
          bottom: Math.round(btnRect.bottom),
          left: Math.round(btnRect.left),
          right: Math.round(btnRect.right),
          width: Math.round(btnRect.width),
          height: Math.round(btnRect.height),
          text: applyBtn.textContent.trim()
        } : null,
        bottomNav: bNavRect ? { top: Math.round(bNavRect.top), bottom: Math.round(bNavRect.bottom), height: Math.round(bNavRect.height) } : null,
        panelZ,
        bNavZ,
        insideViewport: btnRect ? (btnRect.bottom <= vpHeight && btnRect.top >= 0) : false,
        aboveBottomNav: panelZ > bNavZ
      }
    }, vp.height)

    results.push({
      vp: vp.name,
      filename,
      ...metrics
    })

    await page.close()
  }

  await browser.close()

  console.log('| Viewport | Botón Aplicar (Top / Bottom) | Alto Botón | Alto Viewport | Dentro del Viewport | Z-Index (Panel vs Nav) | Captura | Estado |')
  console.log('|---|:---:|:---:|:---:|:---:|:---:|---|:---:|')
  for (const r of results) {
    const coords = `${r.button?.top}px / ${r.button?.bottom}px`
    const btnH = `${r.button?.height}px`
    const inVp = r.insideViewport ? 'SÍ (Visible)' : 'NO'
    const zStr = `z-${r.panelZ} > z-${r.bNavZ}`
    const status = r.insideViewport && r.aboveBottomNav ? 'PASA' : 'FALLA'
    console.log(`| ${r.vp} | ${coords} | ${btnH} | ${r.panel?.bottom}px | ${inVp} | ${zStr} | \`capturas/${r.filename}\` | **${status}** |`)
  }
}

verify().catch(console.error)
