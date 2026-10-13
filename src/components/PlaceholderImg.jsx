export default function PlaceholderImg({ tela, color, className = '', size = 'md' }) {
  const telaColors = {
    algodon: { bg: '#F3E8FF', fg: '#7C3AED', pattern: 'dots' },
    poliester: { bg: '#E0F2FE', fg: '#0284C7', pattern: 'lines' },
    denim: { bg: '#DBEAFE', fg: '#1D4ED8', pattern: 'cross' },
    jersey: { bg: '#D1FAE5', fg: '#059669', pattern: 'waves' },
    mezcla: { bg: '#FEF3C7', fg: '#D97706', pattern: 'grid' },
    licra: { bg: '#FCE7F3', fg: '#DB2777', pattern: 'diagonal' },
    franela: { bg: '#FFE4E6', fg: '#E11D48', pattern: 'squares' },
  }
  const t = telaColors[tela] || telaColors.mezcla
  const sizes = { sm: 80, md: 200, lg: 320 }
  const s = sizes[size] || sizes.md

  const patterns = {
    dots: `<circle cx="8" cy="8" r="2" fill="${t.fg}" opacity="0.15"/><circle cx="24" cy="24" r="2" fill="${t.fg}" opacity="0.15"/>`,
    lines: `<line x1="0" y1="16" x2="32" y2="16" stroke="${t.fg}" stroke-width="1" opacity="0.12"/><line x1="0" y1="8" x2="32" y2="8" stroke="${t.fg}" stroke-width="0.5" opacity="0.08"/>`,
    cross: `<line x1="0" y1="0" x2="32" y2="32" stroke="${t.fg}" stroke-width="1" opacity="0.1"/><line x1="32" y1="0" x2="0" y2="32" stroke="${t.fg}" stroke-width="1" opacity="0.1"/>`,
    waves: `<path d="M0 16 Q8 8 16 16 T32 16" stroke="${t.fg}" fill="none" stroke-width="1" opacity="0.12"/>`,
    grid: `<rect x="0" y="0" width="16" height="16" stroke="${t.fg}" fill="none" stroke-width="0.5" opacity="0.1"/>`,
    diagonal: `<line x1="0" y1="0" x2="32" y2="32" stroke="${t.fg}" stroke-width="1.5" opacity="0.1"/>`,
    squares: `<rect x="4" y="4" width="8" height="8" rx="1" fill="${t.fg}" opacity="0.08"/><rect x="20" y="20" width="8" height="8" rx="1" fill="${t.fg}" opacity="0.08"/>`,
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
    <rect width="${s}" height="${s}" fill="${t.bg}"/>
    <defs><pattern id="p" width="32" height="32" patternUnits="userSpaceOnUse">${patterns[t.pattern]}</pattern></defs>
    <rect width="${s}" height="${s}" fill="url(#p)"/>
    <g transform="translate(${s/2}, ${s/2-12})">
      <rect x="-20" y="-8" width="40" height="36" rx="4" fill="${t.fg}" opacity="0.15"/>
      <text text-anchor="middle" y="16" font-family="Inter,sans-serif" font-size="10" font-weight="600" fill="${t.fg}">${tela || 'tela'}</text>
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

