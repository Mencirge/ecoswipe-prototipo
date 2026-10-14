import puppeteer from 'puppeteer-core'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

const PAGES = [
  { name: 'Inicio', url: 'http://localhost:5173/#/' },
  { name: 'Mercado', url: 'http://localhost:5173/#/mercado' },
  { name: 'DetalleLote', url: 'http://localhost:5173/#/lote/1' },
  { name: 'PerfilVendedor', url: 'http://localhost:5173/#/tienda/t1' },
  { name: 'PublicarLote', url: 'http://localhost:5173/#/publicar' },
  { name: 'Impacto', url: 'http://localhost:5173/#/impacto' },
]

async function audit() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  })

  console.log('=== AUDITORÍA MÓVIL 360x740: TEXTO DESBORDADO Y ELEMENTOS INTERACTIVOS < 36px ===\n')

  for (const p of PAGES) {
    const page = await browser.newPage()
    await page.setViewport({ width: 360, height: 740, deviceScaleFactor: 1 })
    await page.goto(p.url, { waitUntil: 'networkidle0' })
    await new Promise(r => setTimeout(r, 400))

    const issues = await page.evaluate(() => {
      const overflowIssues = []
      const smallTouchTargets = []

      // 1. Text overflow
      const allTextEls = Array.from(document.querySelectorAll('h1, h2, h3, h4, p, span, a, button, label, li'))
      for (const el of allTextEls) {
        if (el.offsetParent === null) continue // hidden
        if (el.classList.contains('sr-only')) continue // intentional screen-reader text
        // Check if element has intentional truncate or ellipsis or line-clamp
        const style = window.getComputedStyle(el)
        const isTruncated = el.classList.contains('truncate') || 
                            style.textOverflow === 'ellipsis' ||
                            el.classList.contains('line-clamp-1') ||
                            el.classList.contains('line-clamp-2') ||
                            el.classList.contains('line-clamp-3') ||
                            style.webkitLineClamp !== 'none'
        
        // If element is a scroll container intentionally
        const isScrollContainer = style.overflowX === 'auto' || style.overflowX === 'scroll'

        if (!isTruncated && !isScrollContainer) {
          // Check scrollWidth > clientWidth by at least 2px
          if (el.scrollWidth > el.clientWidth + 2 && el.clientWidth > 0) {
            overflowIssues.push({
              tag: el.tagName.toLowerCase(),
              className: el.className,
              text: (el.textContent || '').trim().slice(0, 50),
              scrollWidth: el.scrollWidth,
              clientWidth: el.clientWidth,
            })
          }
        }
      }

      // 2. Interactive elements < 36px
      const interactives = Array.from(document.querySelectorAll('button, a, input, select, [role="button"]'))
      for (const el of interactives) {
        if (el.offsetParent === null) continue
        const rect = el.getBoundingClientRect()
        // Ignore zero-size / invisible
        if (rect.width === 0 || rect.height === 0) continue
        // We evaluate visual touch target size
        if (rect.width < 36 || rect.height < 36) {
          smallTouchTargets.push({
            tag: el.tagName.toLowerCase(),
            text: (el.textContent || el.getAttribute('aria-label') || el.name || '').trim().slice(0, 30),
            className: el.className,
            width: Math.round(rect.width),
            height: Math.round(rect.height)
          })
        }
      }

      return { overflowIssues, smallTouchTargets }
    })

    console.log(`Página [${p.name}]:`)
    console.log(`  - Textos desbordados no truncados: ${issues.overflowIssues.length}`)
    issues.overflowIssues.forEach(i => console.log(`      * <${i.tag}> "${i.text}" (scroll: ${i.scrollWidth}px > client: ${i.clientWidth}px)`))
    console.log(`  - Elementos interactivos < 36px: ${issues.smallTouchTargets.length}`)
    issues.smallTouchTargets.forEach(t => console.log(`      * <${t.tag}> "${t.text}" (${t.width}x${t.height}px) [${t.className}]`))
    console.log('')

    await page.close()
  }

  await browser.close()
}

audit().catch(console.error)
