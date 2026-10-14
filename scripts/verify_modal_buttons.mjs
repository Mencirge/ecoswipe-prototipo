import puppeteer from 'puppeteer-core'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

const MODALS = [
  {
    name: 'Modal Contacto (DetalleLote)',
    url: 'http://localhost:5173/#/lote/l1',
    open: async (page) => {
      await page.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.includes('Contactar'))?.click())
      await new Promise(r => setTimeout(r, 400))
    }
  },
  {
    name: 'Modal Oferta (DetalleLote)',
    url: 'http://localhost:5173/#/lote/l1',
    open: async (page) => {
      await page.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.includes('Hacer oferta'))?.click())
      await new Promise(r => setTimeout(r, 400))
    }
  },
  {
    name: 'Modal Confirmar Entrega (DetalleLote)',
    url: 'http://localhost:5173/#/lote/l1',
    open: async (page) => {
      await page.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.includes('Confirmar entrega'))?.click())
      await new Promise(r => setTimeout(r, 400))
    }
  },
  {
    name: 'Modal Trato Cerrado (DetalleLote)',
    url: 'http://localhost:5173/#/lote/l1',
    open: async (page) => {
      await page.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.includes('Confirmar entrega'))?.click())
      await new Promise(r => setTimeout(r, 300))
      await page.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.includes('Entregué'))?.click())
      await new Promise(r => setTimeout(r, 400))
    }
  },
  {
    name: 'Modal Vista Previa (PublicarLote)',
    url: 'http://localhost:5173/#/publicar',
    open: async (page) => {
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
    }
  },
  {
    name: 'Modal Éxito (PublicarLote)',
    url: 'http://localhost:5173/#/publicar',
    open: async (page) => {
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
    }
  },
  {
    name: 'Panel de Filtros (Mercado)',
    url: 'http://localhost:5173/#/mercado',
    open: async (page) => {
      await page.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.includes('Filtros'))?.click())
      await new Promise(r => setTimeout(r, 400))
    }
  }
]

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  })

  console.log('=== VERIFICACIÓN (c) BOTÓN PRINCIPAL DE CADA MODAL EN 360x740 ===\n')
  const rows = []

  for (const m of MODALS) {
    const page = await browser.newPage()
    await page.setViewport({ width: 360, height: 740, deviceScaleFactor: 1 })
    await page.goto(m.url, { waitUntil: 'networkidle0' })
    await new Promise(r => setTimeout(r, 200))

    await m.open(page)

    const btnData = await page.evaluate(() => {
      const modal = document.querySelector('.rounded-t-tarjeta')
      if (!modal) return null

      // All action buttons in the modal
      const btns = Array.from(modal.querySelectorAll('button, a.btn-primary, a.btn-secondary'))
      const visibleBtns = btns.filter(b => b.offsetParent !== null && !b.getAttribute('aria-label')?.includes('Cerrar'))
      if (visibleBtns.length === 0) return null

      const mainBtn = visibleBtns[visibleBtns.length - 1]
      const r = mainBtn.getBoundingClientRect()
      return {
        text: mainBtn.textContent.trim().slice(0, 30),
        top: Math.round(r.top),
        bottom: Math.round(r.bottom),
        height: Math.round(r.height),
        fits: r.bottom <= 740 && r.top >= 0
      }
    })

    rows.push({
      modal: m.name,
      btnText: btnData?.text || 'N/A',
      bottom: btnData?.bottom ?? 'N/A',
      vpHeight: 740,
      pass: btnData?.fits || false
    })

    await page.close()
  }

  await browser.close()

  console.log('| Modal / Panel | Botón Principal | Bottom del Botón | Alto del Viewport | Pasa/Falla |')
  console.log('|---|---|:---:|:---:|:---:|')
  for (const r of rows) {
    console.log(`| ${r.modal} | "${r.btnText}" | ${r.bottom}px | ${r.vpHeight}px | **${r.pass ? 'PASA' : 'FALLA'}** |`)
  }
}

run().catch(console.error)
