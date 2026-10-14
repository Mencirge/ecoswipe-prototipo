// scripts/audit_mobile.mjs
import puppeteer from 'puppeteer-core'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

const VIEWPORTS = [
  { name: '360x740', width: 360, height: 740 },
  { name: '390x844', width: 390, height: 844 },
  { name: '412x915', width: 412, height: 915 }
]

const SCENARIOS = [
  // Standard Pages
  { id: 'Inicio', type: 'page', url: 'http://localhost:5173/#/' },
  { id: 'Mercado', type: 'page', url: 'http://localhost:5173/#/mercado' },
  { id: 'DetalleLote', type: 'page', url: 'http://localhost:5173/#/lote/l1' },
  { id: 'PerfilVendedor', type: 'page', url: 'http://localhost:5173/#/tienda/t1' },
  { id: 'PublicarLote', type: 'page', url: 'http://localhost:5173/#/publicar' },
  { id: 'Impacto', type: 'page', url: 'http://localhost:5173/#/impacto' },

  // Modals & Drawers
  {
    id: 'Modal Contacto',
    type: 'modal',
    url: 'http://localhost:5173/#/lote/l1',
    open: async (page) => {
      await page.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.includes('Contactar'))?.click())
      await new Promise(r => setTimeout(r, 400))
    },
    primaryBtnSelector: 'button, a'
  },
  {
    id: 'Modal Oferta',
    type: 'modal',
    url: 'http://localhost:5173/#/lote/l1',
    open: async (page) => {
      await page.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.includes('Hacer oferta'))?.click())
      await new Promise(r => setTimeout(r, 400))
    },
    primaryBtnSelector: '.btn-primary'
  },
  {
    id: 'Modal Confirmar Entrega',
    type: 'modal',
    url: 'http://localhost:5173/#/lote/l1',
    open: async (page) => {
      await page.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.includes('Confirmar entrega'))?.click())
      await new Promise(r => setTimeout(r, 400))
    },
    primaryBtnSelector: '.btn-primary'
  },
  {
    id: 'Modal Trato Cerrado',
    type: 'modal',
    url: 'http://localhost:5173/#/lote/l1',
    open: async (page) => {
      await page.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.includes('Confirmar entrega'))?.click())
      await new Promise(r => setTimeout(r, 300))
      await page.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.includes('Entregué'))?.click())
      await new Promise(r => setTimeout(r, 400))
    },
    primaryBtnSelector: '.btn-primary'
  },
  {
    id: 'Modal Vista Previa (Publicar)',
    type: 'modal',
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
    },
    primaryBtnSelector: '.btn-primary'
  },
  {
    id: 'Modal Éxito (Publicar)',
    type: 'modal',
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
    },
    primaryBtnSelector: '.btn-secondary, a'
  },
  {
    id: 'Panel de Filtros Móvil (Mercado)',
    type: 'modal',
    url: 'http://localhost:5173/#/mercado',
    open: async (page) => {
      await page.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.includes('Filtros'))?.click())
      await new Promise(r => setTimeout(r, 400))
    },
    primaryBtnSelector: '.btn-primary'
  }
]

async function runAudit() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  })

  console.log('=== AUDITORÍA MÓVIL COMPLETA (360x740, 390x844, 412x915) ===\n')

  const summary = []

  for (const vp of VIEWPORTS) {
    console.log(`\n===============================================================`)
    console.log(`RESOLUCIÓN: ${vp.name} (${vp.width}x${vp.height} px)`)
    console.log(`===============================================================`)

    for (const sc of SCENARIOS) {
      const page = await browser.newPage()
      await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 })
      await page.goto(sc.url, { waitUntil: 'networkidle0' })
      await new Promise(r => setTimeout(r, 300))

      if (sc.open) {
        await sc.open(page)
      }

      const evalResult = await page.evaluate((scType) => {
        const overflowIssues = []
        const smallTouchTargets = []
        let modalHorizontalScroll = false
        let primaryBtnVisible = null

        // 1. Text overflow (excluding SVGs and intentional horizontal containers)
        const allTextEls = Array.from(document.querySelectorAll('h1, h2, h3, h4, p, span, a, button, label, li'))
        for (const el of allTextEls) {
          if (el.offsetParent === null) continue
          if (el.classList.contains('sr-only')) continue
          if (el.closest('svg')) continue

          const style = window.getComputedStyle(el)
          const cls = typeof el.className === 'string' ? el.className : ''
          const isTruncated = cls.includes('truncate') ||
                              style.textOverflow === 'ellipsis' ||
                              cls.includes('line-clamp-') ||
                              style.webkitLineClamp !== 'none'
          const isScrollContainer = style.overflowX === 'auto' || style.overflowX === 'scroll'

          if (!isTruncated && !isScrollContainer) {
            if (el.scrollWidth > el.clientWidth + 2 && el.clientWidth > 0) {
              overflowIssues.push({
                tag: el.tagName.toLowerCase(),
                text: (el.textContent || '').trim().slice(0, 40),
                scrollWidth: el.scrollWidth,
                clientWidth: el.clientWidth
              })
            }
          }
        }

        // 2. Interactive elements < 36px touch target
        const interactives = Array.from(document.querySelectorAll('button, a, input, select, [role="button"]'))
        for (const el of interactives) {
          if (el.offsetParent === null) continue
          const rect = el.getBoundingClientRect()
          if (rect.width === 0 || rect.height === 0) continue

          // Touch target rule: at least 36px in either dimension unless inline text link
          if (rect.width < 36 || rect.height < 36) {
            smallTouchTargets.push({
              tag: el.tagName.toLowerCase(),
              text: (el.textContent || el.getAttribute('aria-label') || el.name || '').trim().slice(0, 30),
              w: Math.round(rect.width),
              h: Math.round(rect.height)
            })
          }
        }

        // 3. Modal specific checks
        if (scType === 'modal') {
          // Check horizontal overflow of modal container / dialog
          const modalCards = Array.from(document.querySelectorAll('.rounded-tarjeta, [role="dialog"], .bg-white'))
          for (const m of modalCards) {
            if (m.offsetParent !== null && m.scrollWidth > m.clientWidth + 1) {
              modalHorizontalScroll = true
            }
          }

          // Check primary button visibility in viewport
          const btns = Array.from(document.querySelectorAll('button, .btn-primary, .btn-secondary, a.btn-primary, a.btn-secondary'))
          const visibleBtns = btns.filter(b => b.offsetParent !== null)
          if (visibleBtns.length > 0) {
            // Find main action button (usually last or primary)
            const mainBtn = visibleBtns[visibleBtns.length - 1]
            const r = mainBtn.getBoundingClientRect()
            primaryBtnVisible = {
              text: mainBtn.textContent.trim().slice(0, 25),
              top: Math.round(r.top),
              bottom: Math.round(r.bottom),
              fitsInViewport: r.bottom <= window.innerHeight && r.top >= 0,
              height: Math.round(r.height)
            }
          }
        }

        const docHorizontalScroll = document.documentElement.scrollWidth > document.documentElement.clientWidth

        return {
          overflowIssues,
          smallTouchTargets,
          modalHorizontalScroll,
          docHorizontalScroll,
          primaryBtnVisible
        }
      }, sc.type)

      console.log(`[${vp.name}] ${sc.id}:`)
      console.log(`  - Textos desbordados no truncados: ${evalResult.overflowIssues.length}`)
      if (evalResult.overflowIssues.length > 0) {
        evalResult.overflowIssues.forEach(i => console.log(`      * <${i.tag}> "${i.text}" (${i.scrollWidth} > ${i.clientWidth}px)`))
      }
      console.log(`  - Elementos interactivos < 36px: ${evalResult.smallTouchTargets.length}`)
      if (evalResult.smallTouchTargets.length > 0) {
        evalResult.smallTouchTargets.forEach(t => console.log(`      * <${t.tag}> "${t.text}" (${t.w}x${t.h}px)`))
      }
      console.log(`  - Scroll horizontal documento: ${evalResult.docHorizontalScroll ? 'FALLO' : 'NO (0px)'}`)

      if (sc.type === 'modal') {
        console.log(`  - Modal scroll horizontal: ${evalResult.modalHorizontalScroll ? 'FALLO' : 'NO (Limpio)'}`)
        if (evalResult.primaryBtnVisible) {
          console.log(`  - Botón principal ("${evalResult.primaryBtnVisible.text}"): alto=${evalResult.primaryBtnVisible.height}px, visible en pantalla=${evalResult.primaryBtnVisible.fitsInViewport ? 'SÍ (bottom: ' + evalResult.primaryBtnVisible.bottom + 'px <= ' + vp.height + 'px)' : 'NO'}`)
        }
      }

      summary.push({
        viewport: vp.name,
        scenario: sc.id,
        type: sc.type,
        overflowCount: evalResult.overflowIssues.length,
        smallCount: evalResult.smallTouchTargets.length,
        noHScroll: !evalResult.docHorizontalScroll && !evalResult.modalHorizontalScroll,
        btnVisible: evalResult.primaryBtnVisible ? evalResult.primaryBtnVisible.fitsInViewport : true
      })

      await page.close()
    }
  }

  await browser.close()

  console.log(`\n===============================================================`)
  console.log(`RESUMEN CONSOLIDADO DE AUDITORÍA MÓVIL`)
  console.log(`===============================================================`)
  console.log('| Viewport | Vista / Modal | Tipo | Textos Desbordados | Interactivos <36px | Sin Scroll Horiz. | Botón Visible |')
  console.log('|---|---|:---:|:---:|:---:|:---:|:---:|')
  for (const s of summary) {
    console.log(`| ${s.viewport} | ${s.scenario} | ${s.type} | ${s.overflowCount} | ${s.smallCount} | ${s.noHScroll ? 'PASS' : 'FAIL'} | ${s.btnVisible ? 'PASS' : 'FAIL'} |`)
  }
}

runAudit().catch(console.error)
