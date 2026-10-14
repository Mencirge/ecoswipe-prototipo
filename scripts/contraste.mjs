// scripts/contraste.mjs
// Auditoría de contraste WCAG 2.1 para EcoSwipe
// Lee los tokens dinámicamente desde tailwind.config.js sin hex manuales.

import tailwindConfig from '../tailwind.config.js'

function hexToRgb(hex) {
  let clean = hex.replace('#', '').trim()
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('')
  }
  const num = parseInt(clean, 16)
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255]
}

function sRGBtoLinear(c) {
  const v = c / 255
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
}

function relLuminance([r, g, b]) {
  return 0.2126 * sRGBtoLinear(r) + 0.7152 * sRGBtoLinear(g) + 0.0722 * sRGBtoLinear(b)
}

export function blend(fgRgb, fgAlpha, bgRgb) {
  return [
    Math.round(fgRgb[0] * fgAlpha + bgRgb[0] * (1 - fgAlpha)),
    Math.round(fgRgb[1] * fgAlpha + bgRgb[1] * (1 - fgAlpha)),
    Math.round(fgRgb[2] * fgAlpha + bgRgb[2] * (1 - fgAlpha))
  ]
}

export function contrastRatio(rgb1, rgb2) {
  const l1 = relLuminance(rgb1)
  const l2 = relLuminance(rgb2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

// Extracción dinámica de tokens desde tailwind.config.js
const colors = tailwindConfig.theme.extend.colors

export const TOKENS = {
  'verde-bosque': hexToRgb(colors['verde-bosque']),
  'verde-hoja': hexToRgb(colors['verde-hoja']),
  'verde-brote': hexToRgb(colors['verde-brote']),
  'menta': hexToRgb(colors['menta']),
  'crema': hexToRgb(colors['crema']),
  'terracota': hexToRgb(colors['terracota']),
  'gris-calido': hexToRgb(colors['gris-calido']),
  'blanco': [255, 255, 255],
  'brand-600': hexToRgb(colors.brand['600']),
  'brand-700': hexToRgb(colors.brand['700']),
  'brand-800': hexToRgb(colors.brand['800']),
  'accent-50': hexToRgb(colors.accent['50']),
  'error': hexToRgb(colors['error'])
}

export const HEX_MAP = {
  'verde-bosque': colors['verde-bosque'],
  'verde-hoja': colors['verde-hoja'],
  'verde-brote': colors['verde-brote'],
  'menta': colors['menta'],
  'crema': colors['crema'],
  'terracota': colors['terracota'],
  'gris-calido': colors['gris-calido'],
  'blanco': '#FFFFFF',
  'brand-600': colors.brand['600'],
  'brand-700': colors.brand['700'],
  'brand-800': colors.brand['800'],
  'accent-50': colors.accent['50'],
  'error': colors['error']
}

// Combinaciones generales y de escala móvil (12-13px)
export const COMBINACIONES = [
  // --- PALETA BASE Y CONTROLES GENERALES ---
  {
    contexto: 'Cuerpo y títulos generales (p, h1..h3)',
    textName: `verde-bosque (${HEX_MAP['verde-bosque']})`, textRgb: TOKENS['verde-bosque'],
    bgName: `crema (${HEX_MAP['crema']})`, bgRgb: TOKENS['crema'],
    tipoTexto: 'Normal (16px)'
  },
  {
    contexto: 'Tarjetas de contenido y modales (bg-white)',
    textName: `verde-bosque (${HEX_MAP['verde-bosque']})`, textRgb: TOKENS['verde-bosque'],
    bgName: `blanco (${HEX_MAP['blanco']})`, bgRgb: TOKENS['blanco'],
    tipoTexto: 'Normal (14px / 16px)'
  },
  {
    contexto: 'Texto de lectura secundario (text-verde-bosque/90)',
    textName: 'verde-bosque/90', textRgb: blend(TOKENS['verde-bosque'], 0.90, TOKENS['crema']),
    bgName: `crema (${HEX_MAP['crema']})`, bgRgb: TOKENS['crema'],
    tipoTexto: 'Normal (16px)'
  },
  {
    contexto: 'Texto de lectura secundario (text-verde-bosque/85)',
    textName: 'verde-bosque/85', textRgb: blend(TOKENS['verde-bosque'], 0.85, TOKENS['crema']),
    bgName: `crema (${HEX_MAP['crema']})`, bgRgb: TOKENS['crema'],
    tipoTexto: 'Normal (16px)'
  },
  {
    contexto: 'Texto de lectura secundario (text-verde-bosque/80)',
    textName: 'verde-bosque/80', textRgb: blend(TOKENS['verde-bosque'], 0.80, TOKENS['crema']),
    bgName: `crema (${HEX_MAP['crema']})`, bgRgb: TOKENS['crema'],
    tipoTexto: 'Normal (14px)'
  },
  {
    contexto: 'Metadatos en perfil (text-verde-bosque/70)',
    textName: 'verde-bosque/70', textRgb: blend(TOKENS['verde-bosque'], 0.70, TOKENS['crema']),
    bgName: `crema (${HEX_MAP['crema']})`, bgRgb: TOKENS['crema'],
    tipoTexto: 'Normal (14px)'
  },
  {
    contexto: 'Metadatos y etiquetas secundarias en Crema',
    textName: `gris-calido (${HEX_MAP['gris-calido']})`, textRgb: TOKENS['gris-calido'],
    bgName: `crema (${HEX_MAP['crema']})`, bgRgb: TOKENS['crema'],
    tipoTexto: 'Normal (14px)'
  },
  {
    contexto: 'Metadatos en tarjetas y modales (bg-white)',
    textName: `gris-calido (${HEX_MAP['gris-calido']})`, textRgb: TOKENS['gris-calido'],
    bgName: `blanco (${HEX_MAP['blanco']})`, bgRgb: TOKENS['blanco'],
    tipoTexto: 'Normal (14px)'
  },
  {
    contexto: 'Gris Cálido sobre Menta sólida (REGLA: PROHIBIDO)',
    textName: `gris-calido (${HEX_MAP['gris-calido']})`, textRgb: TOKENS['gris-calido'],
    bgName: `menta (${HEX_MAP['menta']})`, bgRgb: TOKENS['menta'],
    tipoTexto: 'Normal (14px)'
  },
  {
    contexto: 'Verde Hoja sobre Crema en texto normal (evaluación)',
    textName: `verde-hoja (${HEX_MAP['verde-hoja']})`, textRgb: TOKENS['verde-hoja'],
    bgName: `crema (${HEX_MAP['crema']})`, bgRgb: TOKENS['crema'],
    tipoTexto: 'Normal (14px)'
  },
  {
    contexto: 'Verde Hoja sobre Crema en Texto Grande (≥18.66px negrita)',
    textName: 'verde-hoja (Large)', textRgb: TOKENS['verde-hoja'],
    bgName: `crema (${HEX_MAP['crema']})`, bgRgb: TOKENS['crema'],
    tipoTexto: 'Large (≥18.66px negrita)'
  },
  {
    contexto: 'Verde Hoja sobre Blanco (precios y destaques)',
    textName: `verde-hoja (${HEX_MAP['verde-hoja']})`, textRgb: TOKENS['verde-hoja'],
    bgName: `blanco (${HEX_MAP['blanco']})`, bgRgb: TOKENS['blanco'],
    tipoTexto: 'Normal (14px / 16px)'
  },
  {
    contexto: 'btn-primary: Reposo (Blanco sobre Verde Hoja)',
    textName: `blanco (${HEX_MAP['blanco']})`, textRgb: TOKENS['blanco'],
    bgName: `verde-hoja (${HEX_MAP['verde-hoja']})`, bgRgb: TOKENS['verde-hoja'],
    tipoTexto: 'Normal (14px)'
  },
  {
    contexto: 'btn-primary: Hover (Blanco sobre #196F3D)',
    textName: `blanco (${HEX_MAP['blanco']})`, textRgb: TOKENS['blanco'],
    bgName: `verde-hoja-hover (${HEX_MAP['brand-600']})`, bgRgb: TOKENS['brand-600'],
    tipoTexto: 'Normal (14px)'
  },
  {
    contexto: 'btn-primary: Active (Blanco sobre #145A32)',
    textName: `blanco (${HEX_MAP['blanco']})`, textRgb: TOKENS['blanco'],
    bgName: `verde-hoja-active (${HEX_MAP['brand-700']})`, bgRgb: TOKENS['brand-700'],
    tipoTexto: 'Normal (14px)'
  },
  {
    contexto: 'btn-secondary: Reposo (Verde Bosque sobre Blanco)',
    textName: `verde-bosque (${HEX_MAP['verde-bosque']})`, textRgb: TOKENS['verde-bosque'],
    bgName: `blanco (${HEX_MAP['blanco']})`, bgRgb: TOKENS['blanco'],
    tipoTexto: 'Normal (14px)'
  },
  {
    contexto: 'Terracota sobre Crema (PROHIBIDO para texto)',
    textName: `terracota (${HEX_MAP['terracota']})`, textRgb: TOKENS['terracota'],
    bgName: `crema (${HEX_MAP['crema']})`, bgRgb: TOKENS['crema'],
    tipoTexto: 'Normal (14px)'
  },
  {
    contexto: 'Alerta de formulario (Error sobre Crema)',
    textName: `alerta-rojo (${HEX_MAP['error']})`, textRgb: TOKENS['error'],
    bgName: `crema (${HEX_MAP['crema']})`, bgRgb: TOKENS['crema'],
    tipoTexto: 'Normal (14px)'
  },

  // --- ESCALA MÓVIL (<768px): TODOS LOS TEXTOS 11px, 12px y 13px ---
  {
    contexto: 'Móvil: Barra inferior activo (12px Verde Bosque sobre Crema)',
    textName: `verde-bosque (${HEX_MAP['verde-bosque']})`, textRgb: TOKENS['verde-bosque'],
    bgName: `crema (${HEX_MAP['crema']})`, bgRgb: TOKENS['crema'],
    tipoTexto: 'Móvil 12px'
  },
  {
    contexto: 'Móvil: Barra inferior inactivo (12px Gris Cálido sobre Crema)',
    textName: `gris-calido (${HEX_MAP['gris-calido']})`, textRgb: TOKENS['gris-calido'],
    bgName: `crema (${HEX_MAP['crema']})`, bgRgb: TOKENS['crema'],
    tipoTexto: 'Móvil 12px'
  },
  {
    contexto: 'Móvil: Franja Datos de Ejemplo (12px Crema sobre Verde Bosque)',
    textName: `crema (${HEX_MAP['crema']})`, textRgb: TOKENS['crema'],
    bgName: `verde-bosque (${HEX_MAP['verde-bosque']})`, bgRgb: TOKENS['verde-bosque'],
    tipoTexto: 'Móvil 12px'
  },
  {
    contexto: 'Móvil: LoteCard precio "/kg" (13px Gris Cálido sobre Blanco)',
    textName: `gris-calido (${HEX_MAP['gris-calido']})`, textRgb: TOKENS['gris-calido'],
    bgName: `blanco (${HEX_MAP['blanco']})`, bgRgb: TOKENS['blanco'],
    tipoTexto: 'Móvil 13px'
  },
  {
    contexto: 'Móvil: LoteCard "Delivery · Recojo" (13px Gris Cálido sobre Blanco)',
    textName: `gris-calido (${HEX_MAP['gris-calido']})`, textRgb: TOKENS['gris-calido'],
    bgName: `blanco (${HEX_MAP['blanco']})`, bgRgb: TOKENS['blanco'],
    tipoTexto: 'Móvil 13px'
  },
  {
    contexto: 'Móvil: LoteCard metadatos (13px Gris Cálido sobre Blanco)',
    textName: `gris-calido (${HEX_MAP['gris-calido']})`, textRgb: TOKENS['gris-calido'],
    bgName: `blanco (${HEX_MAP['blanco']})`, bgRgb: TOKENS['blanco'],
    tipoTexto: 'Móvil 13px'
  },
  {
    contexto: 'Móvil: LoteCard vendedor nombre (13px Verde Bosque sobre Blanco)',
    textName: `verde-bosque (${HEX_MAP['verde-bosque']})`, textRgb: TOKENS['verde-bosque'],
    bgName: `blanco (${HEX_MAP['blanco']})`, bgRgb: TOKENS['blanco'],
    tipoTexto: 'Móvil 13px'
  },
  {
    contexto: 'Móvil: LoteCard avatar vendedor (12px Verde Bosque sobre Menta)',
    textName: `verde-bosque (${HEX_MAP['verde-bosque']})`, textRgb: TOKENS['verde-bosque'],
    bgName: `menta (${HEX_MAP['menta']})`, bgRgb: TOKENS['menta'],
    tipoTexto: 'Móvil 12px'
  },
  {
    contexto: 'Móvil: LoteCard StarRating calificación (13px Verde Bosque sobre Blanco)',
    textName: `verde-bosque (${HEX_MAP['verde-bosque']})`, textRgb: TOKENS['verde-bosque'],
    bgName: `blanco (${HEX_MAP['blanco']})`, bgRgb: TOKENS['blanco'],
    tipoTexto: 'Móvil 13px'
  },
  {
    contexto: 'Móvil: Mercado contador y orden (13px Gris Cálido sobre Crema)',
    textName: `gris-calido (${HEX_MAP['gris-calido']})`, textRgb: TOKENS['gris-calido'],
    bgName: `crema (${HEX_MAP['crema']})`, bgRgb: TOKENS['crema'],
    tipoTexto: 'Móvil 13px'
  },
  {
    contexto: 'Móvil: Mercado selector de orden (13px Verde Bosque sobre Blanco)',
    textName: `verde-bosque (${HEX_MAP['verde-bosque']})`, textRgb: TOKENS['verde-bosque'],
    bgName: `blanco (${HEX_MAP['blanco']})`, bgRgb: TOKENS['blanco'],
    tipoTexto: 'Móvil 13px'
  },
  {
    contexto: 'Móvil: Badges 12-13px delivery/verificado (Verde Bosque sobre Menta)',
    textName: `verde-bosque (${HEX_MAP['verde-bosque']})`, textRgb: TOKENS['verde-bosque'],
    bgName: `menta (${HEX_MAP['menta']})`, bgRgb: TOKENS['menta'],
    tipoTexto: 'Móvil 12-13px'
  },
  {
    contexto: 'Móvil: Badges 12-13px recojo (Verde Bosque sobre accent-50)',
    textName: `verde-bosque (${HEX_MAP['verde-bosque']})`, textRgb: TOKENS['verde-bosque'],
    bgName: `accent-50 (${HEX_MAP['accent-50']})`, bgRgb: TOKENS['accent-50'],
    tipoTexto: 'Móvil 12-13px'
  },
  {
    contexto: 'Móvil: Inicio hero badge (12px Verde Bosque sobre Menta)',
    textName: `verde-bosque (${HEX_MAP['verde-bosque']})`, textRgb: TOKENS['verde-bosque'],
    bgName: `menta (${HEX_MAP['menta']})`, bgRgb: TOKENS['menta'],
    tipoTexto: 'Móvil 12px'
  },
  {
    contexto: 'Móvil: Inicio Swipee frase trato directo (13px text-verde-bosque/85 sobre Crema)',
    textName: 'verde-bosque/85', textRgb: blend(TOKENS['verde-bosque'], 0.85, TOKENS['crema']),
    bgName: `crema (${HEX_MAP['crema']})`, bgRgb: TOKENS['crema'],
    tipoTexto: 'Móvil 13px'
  },
  {
    contexto: 'Móvil: Inicio carrusel subtítulo (13px text-verde-bosque/85 sobre Crema)',
    textName: 'verde-bosque/85', textRgb: blend(TOKENS['verde-bosque'], 0.85, TOKENS['crema']),
    bgName: `crema (${HEX_MAP['crema']})`, bgRgb: TOKENS['crema'],
    tipoTexto: 'Móvil 13px'
  },
  {
    contexto: 'Móvil: Inicio chips de tela (13px Verde Bosque sobre Blanco)',
    textName: `verde-bosque (${HEX_MAP['verde-bosque']})`, textRgb: TOKENS['verde-bosque'],
    bgName: `blanco (${HEX_MAP['blanco']})`, bgRgb: TOKENS['blanco'],
    tipoTexto: 'Móvil 13px'
  },
  {
    contexto: 'Móvil: Inicio últimos lotes subtítulo (13px text-verde-bosque/85 sobre Crema)',
    textName: 'verde-bosque/85', textRgb: blend(TOKENS['verde-bosque'], 0.85, TOKENS['crema']),
    bgName: `crema (${HEX_MAP['crema']})`, bgRgb: TOKENS['crema'],
    tipoTexto: 'Móvil 13px'
  },
  {
    contexto: 'Móvil: Inicio badge último lote (12px Crema sobre Verde Bosque)',
    textName: `crema (${HEX_MAP['crema']})`, textRgb: TOKENS['crema'],
    bgName: `verde-bosque (${HEX_MAP['verde-bosque']})`, bgRgb: TOKENS['verde-bosque'],
    tipoTexto: 'Móvil 12px'
  },
  {
    contexto: 'Móvil: ImpactBanner etiqueta (11px text-verde-bosque/85 sobre menta/60 en Crema)',
    textName: 'verde-bosque/85', textRgb: blend(TOKENS['verde-bosque'], 0.85, blend(TOKENS['menta'], 0.60, TOKENS['crema'])),
    bgName: 'menta/60 sobre Crema', bgRgb: blend(TOKENS['menta'], 0.60, TOKENS['crema']),
    tipoTexto: 'Móvil 11px'
  },
  {
    contexto: 'Móvil: ImpactBanner unidad (12px text-verde-bosque/80 sobre menta/60 en Crema)',
    textName: 'verde-bosque/80', textRgb: blend(TOKENS['verde-bosque'], 0.80, blend(TOKENS['menta'], 0.60, TOKENS['crema'])),
    bgName: 'menta/60 sobre Crema', bgRgb: blend(TOKENS['menta'], 0.60, TOKENS['crema']),
    tipoTexto: 'Móvil 12px'
  },
  {
    contexto: 'Móvil: DetalleLote reseñas vendedor (12px Gris Cálido sobre Blanco)',
    textName: `gris-calido (${HEX_MAP['gris-calido']})`, textRgb: TOKENS['gris-calido'],
    bgName: `blanco (${HEX_MAP['blanco']})`, bgRgb: TOKENS['blanco'],
    tipoTexto: 'Móvil 12px'
  },
  {
    contexto: 'Móvil: PublicarLote stepper labels (12px Verde Bosque sobre Crema)',
    textName: `verde-bosque (${HEX_MAP['verde-bosque']})`, textRgb: TOKENS['verde-bosque'],
    bgName: `crema (${HEX_MAP['crema']})`, bgRgb: TOKENS['crema'],
    tipoTexto: 'Móvil 12px'
  }
]

export function runAudit() {
  console.log('=== AUDITORÍA OFICIAL DE CONTRASTE WCAG 2.1 (TOKENS TAILWIND DINÁMICOS) ===\n')
  console.log('| Contexto | Texto | Fondo | Ratio | AA Normal (≥4.5:1) | AA Large (≥3.0:1) | Veredicto |')
  console.log('|---|---|---|:---:|:---:|:---:|---|')

  let passCount = 0
  let failCount = 0

  for (const c of COMBINACIONES) {
    const ratio = contrastRatio(c.textRgb, c.bgRgb)
    const passNormal = ratio >= 4.5
    const passLarge = ratio >= 3.0

    let verdict = ''
    if (c.contexto.includes('PROHIBIDO')) {
      verdict = passNormal ? 'CUMPLE (REVISAR REGLA)' : 'NO CUMPLE AA (Prohibido)'
    } else if (c.tipoTexto.includes('Large')) {
      verdict = passLarge ? 'CUMPLE AA (Solo Texto Grande)' : 'FALLA AA Large'
    } else {
      verdict = passNormal ? 'CUMPLE AA Normal' : (passLarge ? 'FALLA AA Normal (<4.5)' : 'FALLA WCAG')
    }

    if (passNormal || (c.tipoTexto.includes('Large') && passLarge)) {
      passCount++
    } else {
      failCount++
    }

    console.log(`| ${c.contexto} | ${c.textName} | ${c.bgName} | ${ratio.toFixed(2)}:1 | ${passNormal ? 'PASS' : 'FAIL'} | ${passLarge ? 'PASS' : 'FAIL'} | ${verdict} |`)
  }

  console.log(`\nTOTALES: Evaluadas = ${COMBINACIONES.length}, Cumplen objetivo = ${passCount}, Casos regulados/prohibidos = ${failCount}`)
}

if (process.argv[1].endsWith('contraste.mjs')) {
  runAudit()
}
