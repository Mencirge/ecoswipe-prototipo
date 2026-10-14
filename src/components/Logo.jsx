import logoPrincipal from '../assets/logo-principal.svg'
import logoBlanco from '../assets/logo-blanco.svg'
import faviconSvg from '../assets/favicon.svg'

/**
 * Componente oficial Logo EcoSwipe
 * Reglas de Brandbook:
 * - Utiliza los archivos SVG oficiales de la marca (logo-principal.svg y logo-blanco.svg).
 * - Símbolo: favicon.svg (hoja con nervadura curva de swipe). Tamaño mínimo: 24px.
 * - Horizontal: logo-principal.svg (hoja + wordmark). Tamaño mínimo: 96px de ancho.
 * - Respeta la zona de respeto integrada en el archivo SVG.
 */
export default function Logo({ size = 36, variant = 'full', className = '' }) {
  const isWhite = variant === 'blanco'
  const isSymbol = variant === 'symbol'
  const isMobile = variant === 'mobile'

  if (isSymbol) {
    const symbolSize = Math.max(size, 24)
    return (
      <img
        src={faviconSvg}
        alt="EcoSwipe"
        width={symbolSize}
        height={symbolSize}
        className={`inline-block flex-shrink-0 object-contain select-none ${className}`}
        style={{ width: `${symbolSize}px`, height: `${symbolSize}px` }}
      />
    )
  }

  const height = Math.max(size, 32)
  const width = Math.max(Math.round(height * 1.81), 96)

  return isMobile ? (
    <svg
      viewBox="50 50 227 171"
      className={`inline-block select-none flex-shrink-0 ${className}`}
      style={{ height: `${size || 42}px`, width: 'auto' }}
      role="img"
      aria-label="EcoSwipe"
    >
      <image href={isWhite ? logoBlanco : logoPrincipal} width="327" height="271" />
    </svg>
  ) : (
    <img
      src={isWhite ? logoBlanco : logoPrincipal}
      alt="EcoSwipe"
      width={width}
      height={height}
      className={`inline-block object-contain select-none flex-shrink-0 ${className}`}
      style={{ height: `${height}px`, width: 'auto', minWidth: '96px' }}
    />
  )
}
