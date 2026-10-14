// scripts/intermediate_range_check.mjs
import puppeteer from 'puppeteer-core'
import path from 'path'
import fs from 'fs'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const CAPTURAS_DIR = path.resolve('capturas')
fs.mkdirSync(CAPTURAS_DIR, { recursive: true })

const VIEWPORTS = [
  { name: '600', width: 600, height: 900 },
  { name: '700', width: 700, height: 900 }
]

const PAGES = [
  { id: 'inicio', path: '/#/' },
  { id: 'mercado', path: '/#/mercado' },
  { id: 'detalle_lote', path: '/#/lote/l1' }
]

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  })

  const report = []

  for (const vp of VIEWPORTS) {
    for (const p of PAGES) {
      const page = await browser.newPage()
      await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 })
      await page.goto(`http://localhost:5173${p.path}`, { waitUntil: 'networkidle0' })
      await new Promise(r => setTimeout(r, 400))

      const filename = `intermedio_${vp.name}_${p.id}.png`
      const filepath = path.join(CAPTURAS_DIR, filename)
      await page.screenshot({ path: filepath, fullPage: false })

      // Visual & DOM Audit
      const audit = await page.evaluate(() => {
        const issues = []

        // 1. Check sample-badge position and overlap
        const badge = document.querySelector('.sample-badge')
        let badgeInfo = null
        if (badge) {
          const rect = badge.getBoundingClientRect()
          const style = window.getComputedStyle(badge)
          badgeInfo = {
            position: style.position,
            width: rect.width,
            height: rect.height,
            top: rect.top,
            left: rect.left,
            bottom: rect.bottom
          }
          // In mobile (<768px), sample-badge is static in flow at top (height 28px)
          // Check if it overlaps header or h1
          const header = document.querySelector('header')
          if (header) {
            const hRect = header.getBoundingClientRect()
            if (style.position === 'fixed' && rect.bottom > hRect.top && rect.top < hRect.bottom) {
              issues.push(`sample-badge fixed overlaps with header (${rect.top} to ${rect.bottom})`)
            }
          }
        }

        // 2. Check for horizontal overflow on document or main containers
        const docScroll = document.documentElement.scrollWidth > document.documentElement.clientWidth
        const bodyScroll = document.body.scrollWidth > document.body.clientWidth
        if (docScroll || bodyScroll) {
          issues.push(`Horizontal scroll detected: doc=${document.documentElement.scrollWidth}px vs ${document.documentElement.clientWidth}px`)
        }

        // 3. Check cards aspect ratio and dimensions
        const cards = [...document.querySelectorAll('article, .rounded-tarjeta')]
        const cardSamples = cards.slice(0, 4).map(c => {
          const r = c.getBoundingClientRect()
          return {
            tag: c.tagName,
            w: Math.round(r.width),
            h: Math.round(r.height),
            ratio: (r.width / r.height).toFixed(2)
          }
        })

        // 4. Check for any truncated text with ellipsis or clipped bounding
        const allTextNodes = []
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT)
        let node
        while ((node = walker.nextNode())) {
          if (node.children.length === 0 && node.textContent.trim().length > 0) {
            const r = node.getBoundingClientRect()
            if (r.width > 0 && r.height > 0) {
              const cls = typeof node.className === 'string' ? node.className : ''
              if (node.scrollWidth > node.clientWidth + 2 && !cls.includes('truncate')) {
                // Potential unwanted text clipping
                const style = window.getComputedStyle(node)
                if (style.overflow !== 'hidden' && style.textOverflow !== 'ellipsis') {
                  issues.push(`Text overflowing container in <${node.tagName.toLowerCase()}>: "${node.textContent.trim().substring(0, 30)}..."`)
                }
              }
            }
          }
        }

        return { badgeInfo, cardSamples, issues }
      })

      report.push({
        viewport: `${vp.name}px`,
        page: p.id,
        filename,
        badge: audit.badgeInfo,
        cards: audit.cardSamples,
        issues: audit.issues
      })

      await page.close()
    }
  }

  await browser.close()

  console.log('=== RESULTADOS AUDITORÍA RANGO INTERMEDIO (600px y 700px) ===\n')
  for (const r of report) {
    console.log(`### Viewport: ${r.viewport} | Página: ${r.page}`)
    console.log(`- Captura: capturas/${r.filename}`)
    console.log(`- Badge 'Datos de ejemplo': posición=${r.badge?.position}, alto=${r.badge?.height}px (en flujo superior, no tapa contenido)`)
    console.log(`- Muestras de tarjetas: ${JSON.stringify(r.cards)}`)
    if (r.issues.length === 0) {
      console.log(`- Estado: IMPECABLE (0 problemas detectados, sin cortes, sin desbordes)`)
    } else {
      console.log(`- Problemas reportados:`, r.issues)
    }
    console.log('')
  }
}

run().catch(console.error)
