import puppeteer from 'puppeteer-core'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

async function testScroll() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 375, height: 812 })

  const results = []

  // 1. Inicio -> Mercado
  await page.goto('http://localhost:5173/#/', { waitUntil: 'networkidle0' })
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await new Promise(r => setTimeout(r, 200))
  const scrolledInicio = await page.evaluate(() => window.scrollY)
  console.log('Inicio scrolled to:', scrolledInicio)

  // Navigate to Mercado
  await page.evaluate(() => document.querySelector('a[href*="/mercado"]').click())
  await new Promise(r => setTimeout(r, 200))
  const scrollMercado = await page.evaluate(() => window.scrollY)
  const p1 = scrollMercado === 0
  results.push({ test: 'Inicio -> Mercado (window.scrollY === 0)', initialScroll: scrolledInicio, finalScroll: scrollMercado, pass: p1 })

  // 2. Mercado -> DetalleLote
  await page.evaluate(() => window.scrollTo(0, 450))
  await new Promise(r => setTimeout(r, 200))
  const scrolledMercado = await page.evaluate(() => window.scrollY)
  await page.evaluate(() => document.querySelector('a[href*="/lote/l1"]').click())
  await new Promise(r => setTimeout(r, 200))
  const scrollDetalle = await page.evaluate(() => window.scrollY)
  const p2 = scrollDetalle === 0
  results.push({ test: 'Mercado -> DetalleLote (window.scrollY === 0)', initialScroll: scrolledMercado, finalScroll: scrollDetalle, pass: p2 })

  // 3. DetalleLote -> Publicar
  await page.evaluate(() => window.scrollTo(0, 300))
  await new Promise(r => setTimeout(r, 200))
  const scrolledDetalle = await page.evaluate(() => window.scrollY)
  await page.evaluate(() => document.querySelector('a[href*="/publicar"]').click())
  await new Promise(r => setTimeout(r, 200))
  const scrollPublicar = await page.evaluate(() => window.scrollY)
  const p3 = scrollPublicar === 0
  results.push({ test: 'DetalleLote -> Publicar (window.scrollY === 0)', initialScroll: scrolledDetalle, finalScroll: scrollPublicar, pass: p3 })

  // 4. Publicar -> Impacto
  await page.evaluate(() => window.scrollTo(0, 250))
  await new Promise(r => setTimeout(r, 200))
  const scrolledPublicar = await page.evaluate(() => window.scrollY)
  await page.evaluate(() => document.querySelector('a[href*="/impacto"]').click())
  await new Promise(r => setTimeout(r, 200))
  const scrollImpacto = await page.evaluate(() => window.scrollY)
  const p4 = scrollImpacto === 0
  results.push({ test: 'Publicar -> Impacto (window.scrollY === 0)', initialScroll: scrolledPublicar, finalScroll: scrollImpacto, pass: p4 })

  // 5. En Mercado: buscar / filtrar (cambia location.search) NO debe subir el scroll
  await page.goto('http://localhost:5173/#/mercado', { waitUntil: 'networkidle0' })
  await page.evaluate(() => window.scrollTo(0, 350))
  await new Promise(r => setTimeout(r, 200))
  const preFilterScroll = await page.evaluate(() => window.scrollY)

  // Type in search bar
  const searchInput = await page.$('input[placeholder*="Buscar"]')
  if (searchInput) {
    await searchInput.type('algodon')
  }
  await new Promise(r => setTimeout(r, 300))
  const postFilterScroll = await page.evaluate(() => window.scrollY)
  // Scroll should not reset to 0
  const p5 = postFilterScroll > 0
  results.push({ test: 'Búsqueda/Filtro en Mercado (NO resetea scroll a 0)', initialScroll: preFilterScroll, finalScroll: postFilterScroll, pass: p5 })

  await browser.close()

  console.log('\n=== VERIFICACIÓN (a) ScrollToTop ===\n')
  console.log('| Caso de Prueba | Scroll Inicial | Scroll Final | Estado |')
  console.log('|---|:---:|:---:|:---:|')
  for (const r of results) {
    console.log(`| ${r.test} | ${r.initialScroll}px | ${r.finalScroll}px | ${r.pass ? 'PASA' : 'FALLA'} |`)
  }
}

testScroll().catch(console.error)
