import puppeteer from 'puppeteer-core'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 375, height: 812 })
  await page.goto('http://localhost:5173/#/mercado', { waitUntil: 'networkidle0' })

  // 1. Initial scroll to 350
  await page.evaluate(() => window.scrollTo(0, 350))
  await new Promise(r => setTimeout(r, 100))
  console.log('1. Scroll tras window.scrollTo(0, 350):', await page.evaluate(() => window.scrollY))

  // 2. Get input location
  const inputInfo = await page.evaluate(() => {
    const el = document.querySelector('input[placeholder*="Buscar"]')
    const rect = el.getBoundingClientRect()
    return {
      topInViewport: rect.top,
      absoluteTop: rect.top + window.scrollY,
      height: rect.height
    }
  })
  console.log('2. Ubicación del input de búsqueda:', inputInfo)

  // 3. Focus and type into input via Puppeteer
  const searchInput = await page.$('input[placeholder*="Buscar"]')
  console.log('3. Antes de filtrar:')
  console.log('   - scrollHeight:', await page.evaluate(() => document.documentElement.scrollHeight))
  console.log('   - innerHeight:', await page.evaluate(() => window.innerHeight))
  console.log('   - scrollY:', await page.evaluate(() => window.scrollY))

  await searchInput.type('algodon')
  await new Promise(r => setTimeout(r, 200))

  const scrollH = await page.evaluate(() => document.documentElement.scrollHeight)
  const innerH = await page.evaluate(() => window.innerHeight)
  const currentY = await page.evaluate(() => window.scrollY)

  console.log('4. Tras filtrar "algodon":')
  console.log('   - scrollHeight:', scrollH)
  console.log('   - innerHeight:', innerH)
  console.log('   - scroll máximo físico posible (scrollHeight - innerHeight):', scrollH - innerH)
  console.log('   - scrollY real:', currentY)


  // 4. Test changing search param without browser auto-focus
  await page.evaluate(() => {
    window.scrollTo(0, 350)
  })
  console.log('6. Re-scrolleado manualmente a 350px:', await page.evaluate(() => window.scrollY))

  await page.evaluate(() => {
    // Navigate with search param
    window.location.hash = '#/mercado?q=algodon'
  })
  await new Promise(r => setTimeout(r, 200))
  console.log('7. Tras cambiar window.location.hash a "#/mercado?q=algodon" (sin foco en input):', await page.evaluate(() => window.scrollY))

  // 5. Test changing state/filtering via input event without focus
  await page.evaluate(() => {
    window.scrollTo(0, 350)
    const el = document.querySelector('input[placeholder*="Buscar"]')
    el.value = 'denim'
    el.dispatchEvent(new Event('input', { bubbles: true }))
  })
  await new Promise(r => setTimeout(r, 200))
  console.log('8. Tras cambiar input.value="denim" + dispatchEvent (sin foco):', await page.evaluate(() => window.scrollY))

  await browser.close()
}

run()
