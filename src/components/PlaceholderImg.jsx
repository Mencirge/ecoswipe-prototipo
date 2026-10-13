/**
 * PlaceholderImg: Generador visual de texturas y muestras textiles.
 * NOTA DE DISEÑO (Accesibilidad & Brandbook):
 * Los tonos aquí definidos son "colores de producto" (excepción semántica a la paleta de marca),
 * utilizados exclusivamente para representar la variedad cromática natural de retazos y telas.
 * Para cumplir WCAG AA (≥4.5:1), el texto pequeño de identificación siempre se renderiza
 * en Verde Bosque (#12372A) sobre la pastilla blanca sólida (contraste 12.2:1).
 */
export default function PlaceholderImg({ tela, color: _color, className = '', size = 'md' }) {
  // Colores de producto (simulación de tela)
  const telaColors = {
    algodon:   { bg: '#F2FAF5', fg: '#1E8449', pattern: 'dots' },
    poliester: { bg: '#EDF3F0', fg: '#3D5A4C', pattern: 'lines' },
    denim:     { bg: '#EBF0F5', fg: '#2A3F54', pattern: 'cross' },
    jersey:    { bg: '#DDF3E6', fg: '#1E8449', pattern: 'waves' },
    mezcla:    { bg: '#FAF5EA', fg: '#7D6335', pattern: 'grid' },
    licra:     { bg: '#FDF2EB', fg: '#C76329', pattern: 'diagonal' },
    franela:   { bg: '#FAECE4', fg: '#A64817', pattern: 'squares' },
  }
  const t = telaColors[tela] || telaColors.mezcla
  const sizes = { sm: 80, md: 200, lg: 320 }
  const s = sizes[size] || sizes.md

  const patterns = {
    dots: `<circle cx="8" cy="8" r="2" fill="${t.fg}" opacity="0.16"/><circle cx="24" cy="24" r="2" fill="${t.fg}" opacity="0.16"/>`,
    lines: `<line x1="0" y1="16" x2="32" y2="16" stroke="${t.fg}" stroke-width="1" opacity="0.15"/><line x1="0" y1="8" x2="32" y2="8" stroke="${t.fg}" stroke-width="0.5" opacity="0.1"/>`,
    cross: `<line x1="0" y1="0" x2="32" y2="32" stroke="${t.fg}" stroke-width="1" opacity="0.12"/><line x1="32" y1="0" x2="0" y2="32" stroke="${t.fg}" stroke-width="1" opacity="0.12"/>`,
    waves: `<path d="M0 16 Q8 8 16 16 T32 16" stroke="${t.fg}" fill="none" stroke-width="1" opacity="0.15"/>`,
    grid: `<rect x="0" y="0" width="16" height="16" stroke="${t.fg}" fill="none" stroke-width="0.5" opacity="0.12"/>`,
    diagonal: `<line x1="0" y1="0" x2="32" y2="32" stroke="${t.fg}" stroke-width="1.2" opacity="0.12"/>`,
    squares: `<rect x="4" y="4" width="8" height="8" rx="1" fill="${t.fg}" opacity="0.12"/><rect x="20" y="20" width="8" height="8" rx="1" fill="${t.fg}" opacity="0.12"/>`,
  }

  const labelText = (tela || 'tela').toUpperCase()
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
    <rect width="${s}" height="${s}" fill="${t.bg}"/>
    <defs><pattern id="p_${tela}" width="32" height="32" patternUnits="userSpaceOnUse">${patterns[t.pattern]}</pattern></defs>
    <rect width="${s}" height="${s}" fill="url(#p_${tela})"/>
    <g transform="translate(${s/2}, ${s/2-10})">
      <rect x="-40" y="-12" width="80" height="24" rx="12" fill="#FFFFFF" stroke="${t.fg}" stroke-width="1" opacity="0.95"/>
      <text text-anchor="middle" y="4" font-family="Inter,sans-serif" font-size="10" font-weight="600" fill="#12372A" letter-spacing="0.5">${labelText}</text>
    </g>
  </svg>`

  return (
    <div
      className={`flex items-center justify-center overflow-hidden ${className}`}
      style={{ background: t.bg, minHeight: s }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
