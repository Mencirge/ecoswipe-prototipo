// scripts/dom_measurements.mjs
import puppeteer from 'puppeteer-core'
import path from 'path'
import fs from 'fs'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const CAPTURAS_DIR = path.resolve('capturas')
fs.mkdirSync(CAPTURAS_DIR, { recursive: true })

async function measure() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  })

  console.log('=== MEDICIONES DOM CON getBoundingClientRect ===\n')

  // --- (a) & (c) Mobile Header, Bottom Nav, Logo measurements at 360x740 ---
  const page360 = await browser.newPage()
  await page360.setViewport({ width: 360, height: 740, deviceScaleFactor: 1 })
  await page360.goto('http://localhost:5173/#/', { waitUntil: 'networkidle0' })
  await new Promise(r => setTimeout(r, 400))

  const headerNavData = await page360.evaluate(() => {
    const header = document.querySelector('header')
    const logoSvg = header?.querySelector('svg')
    const logoLink = header?.querySelector('a')
    const bottomNav = document.querySelector('.bottom-nav')

    const hRect = header?.getBoundingClientRect()
    const lRect = logoSvg?.getBoundingClientRect()
    const linkRect = logoLink?.getBoundingClientRect()
    const bRect = bottomNav?.getBoundingClientRect()

    return {
      header: hRect ? { width: hRect.width, height: hRect.height, top: hRect.top, bottom: hRect.bottom } : null,
      logoSvg: lRect ? { width: lRect.width, height: lRect.height, top: lRect.top, bottom: lRect.bottom } : null,
      logoLink: linkRect ? { width: linkRect.width, height: linkRect.height } : null,
      bottomNav: bRect ? { width: bRect.width, height: bRect.height, top: bRect.top, bottom: bRect.bottom } : null
    }
  })

  console.log('(a) LOGO EN HEADER MÓVIL (360x740):')
  console.log(`  - Ancho visible del SVG (getBoundingClientRect): ${headerNavData.logoSvg.width.toFixed(2)} px`)
  console.log(`  - Alto visible del SVG (getBoundingClientRect): ${headerNavData.logoSvg.height.toFixed(2)} px`)
  console.log(`  - Contenedor de enlace: ${headerNavData.logoLink.width.toFixed(2)} x ${headerNavData.logoLink.height.toFixed(2)} px\n`)

  console.log('(c) ALTURA DE CABECERA Y BARRA INFERIOR (360x740):')
  console.log(`  - Alto cabecera (header): ${headerNavData.header.height.toFixed(2)} px (CSS h-14 = 56px)`)
  console.log(`  - Alto barra inferior (.bottom-nav): ${headerNavData.bottomNav.height.toFixed(2)} px (CSS h-[56px] = 56px)\n`)

  // Guardar captura m360_logo_zoom.png a 300% zoom
  const logoZoomPage = await browser.newPage()
  await logoZoomPage.setViewport({ width: 360, height: 740, deviceScaleFactor: 3 })
  await logoZoomPage.goto('http://localhost:5173/#/', { waitUntil: 'networkidle0' })
  await new Promise(r => setTimeout(r, 400))

  const logoClip = await logoZoomPage.evaluate(() => {
    const header = document.querySelector('header')
    const logo = header?.querySelector('svg')
    if (!logo) return null
    const r = logo.getBoundingClientRect()
    // Add 16px padding around logo
    return {
      x: Math.max(0, r.left - 12),
      y: Math.max(0, r.top - 8),
      width: r.width + 24,
      height: r.height + 16
    }
  })

  if (logoClip) {
    const zoomPath = path.join(CAPTURAS_DIR, 'm360_logo_zoom.png')
    await logoZoomPage.screenshot({
      path: zoomPath,
      clip: logoClip
    })
    console.log(`Captura guardada a 300% (deviceScaleFactor: 3): capturas/m360_logo_zoom.png\n`)
  }
  await logoZoomPage.close()
  await page360.close()

  // --- (b) Filas completas de lotes visibles en Mercado a 360x740 y a 412x915 ---
  for (const vp of [{ name: '360x740', width: 360, height: 740 }, { name: '412x915', width: 412, height: 915 }]) {
    const page = await browser.newPage()
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 })
    await page.goto('http://localhost:5173/#/mercado', { waitUntil: 'networkidle0' })
    await new Promise(r => setTimeout(r, 400))

    const rowsData = await page.evaluate((vpHeight) => {
      const bottomNav = document.querySelector('.bottom-nav')
      const bNavTop = bottomNav ? bottomNav.getBoundingClientRect().top : vpHeight
      const effectiveBottom = Math.min(vpHeight, bNavTop) // Cards must be above bottom nav to be fully visible

      const cards = Array.from(document.querySelectorAll('article, a[href*="/lote/"]'))
      const cardRects = cards.map((c, idx) => {
        const r = c.getBoundingClientRect()
        return {
          idx,
          top: Math.round(r.top),
          bottom: Math.round(r.bottom),
          height: Math.round(r.height),
          left: Math.round(r.left),
          right: Math.round(r.right),
          width: Math.round(r.width)
        }
      })

      // Group cards into rows by top coordinate (+/- 5px)
      const rows = []
      for (const cr of cardRects) {
        let existingRow = rows.find(row => Math.abs(row.top - cr.top) < 6)
        if (!existingRow) {
          existingRow = { top: cr.top, bottom: cr.bottom, cards: [] }
          rows.push(existingRow)
        }
        existingRow.cards.push(cr)
        existingRow.bottom = Math.max(existingRow.bottom, cr.bottom)
      }

      // Check how many complete rows are visible
      // A complete row is visible if:
      // 1. row.top >= 0 (or below header)
      // 2. row.bottom <= effectiveBottom (above bottom nav)
      // 3. has 2 cards (or all cards in the row)
      const completeVisibleRows = rows.filter(r => r.top >= 0 && r.bottom <= effectiveBottom)
      const partiallyVisibleRows = rows.filter(r => (r.top < effectiveBottom && r.bottom > effectiveBottom) || (r.top < 0 && r.bottom > 0))

      return {
        effectiveBottom,
        totalCards: cards.length,
        rows: rows.map((r, i) => ({
          rowNumber: i + 1,
          cardCount: r.cards.length,
          top: r.top,
          bottom: r.bottom,
          height: r.bottom - r.top,
          fullyVisible: r.top >= 0 && r.bottom <= effectiveBottom
        })),
        completeCount: completeVisibleRows.length,
        partialCount: partiallyVisibleRows.length
      }
    }, vp.height)

    console.log(`(b) FILAS COMPLETAS DE LOTES VISIBLES EN MERCADO A ${vp.name}:`)
    console.log(`  - Altura disponible útil (sobre bottom-nav): ${rowsData.effectiveBottom} px`)
    console.log(`  - Total de filas renderizadas: ${rowsData.rows.length}`)
    rowsData.rows.forEach(r => {
      console.log(`      * Fila ${r.rowNumber} (${r.cardCount} tarjetas): top=${r.top}px, bottom=${r.bottom}px, alto=${r.height}px -> ${r.fullyVisible ? 'COMPLETAMENTE VISIBLE' : 'PARCIAL O FUERA DE PANTALLA'}`)
    })
    console.log(`  => TOTAL FILAS COMPLETAS VISIBLES: ${rowsData.completeCount}`)
    console.log(`  => FILAS PARCIALES: ${rowsData.partialCount}\n`)

    await page.close()
  }

  await browser.close()
}

measure().catch(console.error)
