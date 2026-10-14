import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * ScrollToTop: Restaura el scroll a la parte superior (0, 0) al cambiar de ruta.
 * Solo se dispara cuando cambia location.pathname (no se activa cuando solo cambia location.search).
 * Cuarta excepción documentada a "lógica intacta".
 */
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    // Restaurar inmediatamente a la parte superior (0, 0)
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [pathname])

  return null
}
