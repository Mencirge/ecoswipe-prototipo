import puppeteer from 'puppeteer-core'
import path from 'path'
import fs from 'fs'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const CAPTURAS_DIR = path.resolve('capturas')
fs.mkdirSync(CAPTURAS_DIR, { recursive: true })

const VIEWPORTS = [
  { name: '375', width: 375, height: 667 },
  { name: '1280', width: 1280, height: 800 },
]

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })

  const consoleErrors = []

  for (const vp of VIEWPORTS) {
    const page = await browser.newPage()
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 2 })

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(`[${vp.name}] ${msg.text()}`)
      }
    })

    // 1. INICIO - Hero con Swipee Principal
    await page.goto('http://localhost:5173/#/', { waitUntil: 'networkidle0' })
    await new Promise(r => setTimeout(r, 500))
    await page.screenshot({ path: path.join(CAPTURAS_DIR, `swipee_principal_inicio_${vp.name}.png`) })
    console.log(`Guardado swipee_principal_inicio_${vp.name}.png`)

    // 2. MERCADO - Sin coincidencias (Pensando)
    await page.goto('http://localhost:5173/#/mercado', { waitUntil: 'networkidle0' })
    const searchInput = await page.$('input[type="text"]')
    if (searchInput) {
      await searchInput.type('xyzretazosinexistentes')
      await new Promise(r => setTimeout(r, 400))
    }
    await page.screenshot({ path: path.join(CAPTURAS_DIR, `swipee_pensando_mercado_${vp.name}.png`) })
    console.log(`Guardado swipee_pensando_mercado_${vp.name}.png`)

    // 3. PUBLICAR - Paso 2 (Anotando)
    await page.goto('http://localhost:5173/#/publicar', { waitUntil: 'networkidle0' })
    // Click "Siguiente paso" from step 1
    const nextButtons = await page.$$('button')
    for (const b of nextButtons) {
      const text = await page.evaluate(el => el.textContent, b)
      if (text.includes('Siguiente paso') || text.includes('Siguiente')) {
        await b.click()
        break
      }
    }
    await new Promise(r => setTimeout(r, 400))
    await page.screenshot({ path: path.join(CAPTURAS_DIR, `swipee_anotando_publicar_${vp.name}.png`) })
    console.log(`Guardado swipee_anotando_publicar_${vp.name}.png`)

    // 4. PUBLICAR - Modal de Éxito (Celebrando)
    // Fill required step 2 inputs
    await page.evaluate(() => {
      const p = document.querySelector('input[name="pesoKg"]')
      if (p) { p.value = '5'; p.dispatchEvent(new Event('input', { bubbles: true })); p.dispatchEvent(new Event('change', { bubbles: true })); }
      const pr = document.querySelector('input[name="precioKg"]')
      if (pr) { pr.value = '15'; pr.dispatchEvent(new Event('input', { bubbles: true })); pr.dispatchEvent(new Event('change', { bubbles: true })); }
    })
    await new Promise(r => setTimeout(r, 200))
    // Click Siguiente to step 3
    const nextButtons2 = await page.$$('button')
    for (const b of nextButtons2) {
      const text = await page.evaluate(el => el.textContent, b)
      if (text.includes('Siguiente paso') || text.includes('Siguiente')) {
        await b.click()
        break
      }
    }
    await new Promise(r => setTimeout(r, 400))
    // Click Publicar lote to open success modal
    const pubButtons = await page.$$('button')
    for (const b of pubButtons) {
      const text = await page.evaluate(el => el.textContent, b)
      if (text.includes('Publicar lote')) {
        await b.click()
        break
      }
    }
    await new Promise(r => setTimeout(r, 500))
    await page.screenshot({ path: path.join(CAPTURAS_DIR, `swipee_celebrando_publicar_${vp.name}.png`) })
    console.log(`Guardado swipee_celebrando_publicar_${vp.name}.png`)

    // 5. DETALLE LOTE - Trato Cerrado (Celebrando)
    await page.goto('http://localhost:5173/#/lote/1', { waitUntil: 'networkidle0' })
    // Click "Confirmar entrega"
    const confBtns = await page.$$('button')
    for (const b of confBtns) {
      const text = await page.evaluate(el => el.textContent, b)
      if (text.includes('Confirmar entrega')) {
        await b.click()
        break
      }
    }
    await new Promise(r => setTimeout(r, 400))
    // Click "Entregué"
    const entregueBtns = await page.$$('button')
    for (const b of entregueBtns) {
      const text = await page.evaluate(el => el.textContent, b)
      if (text.includes('Entregué') || text.includes('Entregue')) {
        await b.click()
        break
      }
    }
    await new Promise(r => setTimeout(r, 500))
    await page.screenshot({ path: path.join(CAPTURAS_DIR, `swipee_celebrando_detalle_lote_${vp.name}.png`) })
    console.log(`Guardado swipee_celebrando_detalle_lote_${vp.name}.png`)

    // 6. DETALLE LOTE - Lote No Encontrado (Triste)
    await page.goto('http://localhost:5173/#/lote/invalido', { waitUntil: 'networkidle0' })
    await new Promise(r => setTimeout(r, 400))
    await page.screenshot({ path: path.join(CAPTURAS_DIR, `swipee_triste_detalle_lote_${vp.name}.png`) })
    console.log(`Guardado swipee_triste_detalle_lote_${vp.name}.png`)

    // 7. PERFIL VENDEDOR - Taller sin lotes (Durmiendo)
    // Go to perfil and simulate empty lotes view in catalog
    await page.goto('http://localhost:5173/#/tienda/t1', { waitUntil: 'networkidle0' })
    await page.evaluate(() => {
      // Find the catalog section and render the exact empty state
      const catalog = document.querySelector('main')
      if (catalog) {
        const grid = catalog.querySelector('.grid')
        if (grid) {
          const emptyDiv = document.createElement('div')
          emptyDiv.className = 'bg-white rounded-tarjeta border border-menta p-8 text-center space-y-3'
          emptyDiv.innerHTML = `
            <picture class="inline-block flex-shrink-0 transition-opacity duration-200 mx-auto mb-2">
              <source srcset="/src/assets/mascota-durmiendo.webp" type="image/webp">
              <img src="/src/assets/mascota-durmiendo.png" alt="" width="130" height="147" class="object-contain block mx-auto select-none pointer-events-none" style="width: 130px; height: 147px;">
            </picture>
            <p class="text-base font-normal text-verde-bosque">Este taller no tiene lotes activos en este momento.</p>
            <a href="#/mercado" class="btn-secondary min-h-[44px] inline-flex items-center justify-center text-sm font-semibold">Ver otros lotes en el mercado</a>
          `
          grid.parentNode.replaceChild(emptyDiv, grid)
        }
      }
    })
    await new Promise(r => setTimeout(r, 400))
    await page.screenshot({ path: path.join(CAPTURAS_DIR, `swipee_durmiendo_perfil_${vp.name}.png`) })
    console.log(`Guardado swipee_durmiendo_perfil_${vp.name}.png`)

    await page.close()
  }

  await browser.close()
  console.log('\nConsola limpia:', consoleErrors.length === 0, consoleErrors)
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
