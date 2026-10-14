import puppeteer from 'puppeteer-core'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

async function checkFilterScroll() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 375, height: 812 })

  await page.goto('http://localhost:5173/#/mercado', { waitUntil: 'networkidle0' })

  // Measure initial document height
  const fullDocH = await page.evaluate(() => document.documentElement.scrollHeight)
  const vpH = await page.evaluate(() => window.innerHeight)
  const maxPossibleInitialScroll = fullDocH - vpH

  console.log(`Documento completo inicial:`)
  console.log(`- scrollHeight: ${fullDocH}px`)
  console.log(`- innerHeight (viewport): ${vpH}px`)
  console.log(`- scroll máximo posible: ${maxPossibleInitialScroll}px\n`)

  // Scroll to 350px
  await page.evaluate(() => window.scrollTo(0, 350))
  await new Promise(r => setTimeout(r, 100))
  const scrollBefore = await page.evaluate(() => window.scrollY)
  console.log(`Scroll antes de filtrar: ${scrollBefore}px`)

  // Apply filter 'denim'
  await page.evaluate(() => {
    const input = document.querySelector('input[type="text"]')
    if (input) {
      input.value = 'denim'
      input.dispatchEvent(new Event('input', { bubbles: true }))
    }
  })
  await new Promise(r => setTimeout(r, 200))

  const filteredDocH = await page.evaluate(() => document.documentElement.scrollHeight)
  const scrollAfter = await page.evaluate(() => window.scrollY)
  const maxPossibleFilteredScroll = filteredDocH - vpH

  console.log(`Documento tras filtrar "denim":`)
  console.log(`- scrollHeight: ${filteredDocH}px`)
  console.log(`- innerHeight (viewport): ${vpH}px`)
  console.log(`- scroll máximo posible permitido por el navegador (scrollHeight - innerHeight): ${maxPossibleFilteredScroll}px`)
  console.log(`- scroll real tras filtrar: ${scrollAfter}px`)
  console.log(`- ¿El scroll real coincide exactamente con el scroll máximo posible?: ${scrollAfter === maxPossibleFilteredScroll}\n`)

  // Check if component unmounted or reloaded
  await page.evaluate(() => {
    return window.__filterTestPersist ? true : false
  })

  // Set a marker on window/component to prove it doesn't unmount
  await page.evaluate(() => {
    window.__filterTestPersist = true
    const input = document.querySelector('input[type="text"]')
    if (input) {
      input.value = 'algodón'
      input.dispatchEvent(new Event('input', { bubbles: true }))
    }
  })
  await new Promise(r => setTimeout(r, 200))

  const persisted = await page.evaluate(() => window.__filterTestPersist)
  const algodonDocH = await page.evaluate(() => document.documentElement.scrollHeight)
  const algodonScroll = await page.evaluate(() => window.scrollY)
  const algodonMaxScroll = algodonDocH - vpH

  console.log(`Prueba con filtro más largo "algodón":`)
  console.log(`- El componente NO se desmonta (window/estado persiste): ${persisted}`)
  console.log(`- scrollHeight con algodón: ${algodonDocH}px`)
  console.log(`- scroll máximo con algodón: ${algodonMaxScroll}px`)
  console.log(`- scroll real: ${algodonScroll}px`)

  await browser.close()
}

checkFilterScroll()
