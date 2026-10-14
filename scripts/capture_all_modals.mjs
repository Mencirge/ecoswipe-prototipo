import puppeteer from 'puppeteer-core'
import path from 'path'
import fs from 'fs'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const CAPTURAS_DIR = path.resolve('capturas')
if (!fs.existsSync(CAPTURAS_DIR)) fs.mkdirSync(CAPTURAS_DIR, { recursive: true })

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  })

  const results = []

  // Helper for 360x740 modal capture
  async function testModal({ name, route, openAction, buttonSelector, filename }) {
    const page = await browser.newPage()
    await page.setViewport({ width: 360, height: 740, deviceScaleFactor: 2 })
    await page.goto('http://localhost:5173/#' + route, { waitUntil: 'networkidle0' })
    await new Promise(r => setTimeout(r, 200))

    if (openAction) {
      await openAction(page)
      await new Promise(r => setTimeout(r, 400))
    }

    const btnInfo = await page.evaluate((sel) => {
      const btn = document.querySelector(sel)
      if (!btn) return null
      const r = btn.getBoundingClientRect()
      return {
        text: btn.innerText.trim(),
        top: Math.round(r.top * 100) / 100,
        bottom: Math.round(r.bottom * 100) / 100,
        height: Math.round(r.height * 100) / 100,
        visible: r.bottom <= 740 && r.top >= 0
      }
    }, buttonSelector)

    const filepath = path.join(CAPTURAS_DIR, filename)
    await page.screenshot({ path: filepath })
    await page.close()

    results.push({ name, filename, btnInfo })
  }

  // 1. Modal Contacto
  await testModal({
    name: 'Modal Contacto (DetalleLote)',
    route: '/lote/l1',
    openAction: async (page) => {
      await page.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.includes('Contactar'))?.click())
    },
    buttonSelector: 'div[class*="fixed"] button:nth-of-type(2)',
    filename: 'modal_contacto_360x740.png'
  })

  // 2. Modal Oferta
  await testModal({
    name: 'Modal Oferta (DetalleLote)',
    route: '/lote/l1',
    openAction: async (page) => {
      await page.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.includes('Hacer oferta'))?.click())
    },
    buttonSelector: 'div[class*="fixed"] button.btn-primary',
    filename: 'modal_oferta_360x740.png'
  })

  // 3. Modal Confirmar Entrega
  await testModal({
    name: 'Modal Confirmar Entrega (DetalleLote)',
    route: '/lote/l1',
    openAction: async (page) => {
      await page.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.includes('Confirmar entrega'))?.click())
    },
    buttonSelector: 'div[class*="fixed"] button.btn-primary',
    filename: 'modal_confirmar_entrega_360x740.png'
  })

  // 4. Modal Trato Cerrado
  await testModal({
    name: 'Modal Trato Cerrado (DetalleLote)',
    route: '/lote/l1',
    openAction: async (page) => {
      await page.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.includes('Confirmar entrega'))?.click())
      await new Promise(r => setTimeout(r, 300))
      await page.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.includes('Entregué'))?.click())
    },
    buttonSelector: 'div[class*="fixed"] button.btn-primary',
    filename: 'modal_trato_cerrado_360x740.png'
  })

  // 5. Modal Vista Previa
  await testModal({
    name: 'Modal Vista Previa (PublicarLote)',
    route: '/publicar',
    openAction: async (page) => {
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
    },
    buttonSelector: 'div[class*="fixed"] button.btn-primary',
    filename: 'modal_vista_previa_360x740.png'
  })

  // 6. Modal Éxito
  await testModal({
    name: 'Modal Éxito (PublicarLote)',
    route: '/publicar',
    openAction: async (page) => {
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
    },
    buttonSelector: 'div[class*="fixed"] button.btn-primary',
    filename: 'modal_exito_360x740.png'
  })

  // 7. Panel de Filtros Móvil (360x740)
  await testModal({
    name: 'Panel Filtros Móvil (Mercado 360x740)',
    route: '/mercado',
    openAction: async (page) => {
      await page.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.includes('Filtros'))?.click())
    },
    buttonSelector: 'div[class*="fixed"] button.btn-primary',
    filename: 'panel_filtros_360x740.png'
  })

  // 8. Panel de Filtros en 360x420 (Teclado simulado) con campo enfocado
  const pageKb = await browser.newPage()
  await pageKb.setViewport({ width: 360, height: 420, deviceScaleFactor: 2 })
  await pageKb.goto('http://localhost:5173/#/mercado', { waitUntil: 'networkidle0' })
  await new Promise(r => setTimeout(r, 200))

  // Open filter panel
  await pageKb.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Filtros'))
    if (btn) btn.click()
  })
  await new Promise(r => setTimeout(r, 300))

  // Focus search input or an input in filter panel if any, or general focus
  await pageKb.evaluate(() => {
    // Focus search input inside or outside
    const inp = document.querySelector('input')
    if (inp) inp.focus()
  })
  await new Promise(r => setTimeout(r, 200))

  const btnKbInfo = await pageKb.evaluate(() => {
    const btn = document.querySelector('div[class*="fixed"] button.btn-primary')
    if (!btn) return null
    const r = btn.getBoundingClientRect()
    return {
      text: btn.innerText.trim(),
      top: Math.round(r.top * 100) / 100,
      bottom: Math.round(r.bottom * 100) / 100,
      height: Math.round(r.height * 100) / 100,
      visible: r.bottom <= 420 && r.top >= 0
    }
  })

  const kbFile = path.join(CAPTURAS_DIR, 'panel_filtros_teclado_360x420.png')
  await pageKb.screenshot({ path: kbFile })
  await pageKb.close()

  await browser.close()

  console.log('\n=== RESULTADOS DE CAPTURAS DE MODALES ===\n')
  for (const res of results) {
    console.log(`- ${res.name}: Archivo: capturas/${res.filename} | Botón: "${res.btnInfo?.text}" (top: ${res.btnInfo?.top}px, bottom: ${res.btnInfo?.bottom}px) | Visible en 360x740: ${res.btnInfo?.visible ? 'SÍ' : 'NO'}`)
  }

  console.log(`\n- Panel Filtros Teclado Simulado (360x420): Archivo: capturas/panel_filtros_teclado_360x420.png | Botón: "${btnKbInfo?.text}" (top: ${btnKbInfo?.top}px, bottom: ${btnKbInfo?.bottom}px) | Visible y accesible en 360x420: ${btnKbInfo?.visible ? 'SÍ' : 'NO'}`)
}

run().catch(console.error)
