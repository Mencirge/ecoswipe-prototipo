import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import LoteCard from '../components/LoteCard'
import mascotaWebp from '../assets/mascota.webp'
import mascotaPng from '../assets/mascota.png'
import lotes from '../data/lotes.json'
import tiendas from '../data/tiendas.json'

const TELAS = ['Todas', 'algodon', 'poliester', 'denim', 'jersey', 'mezcla', 'licra', 'franela']
const ORDEN = [
  { value: 'reciente', label: 'Más recientes' },
  { value: 'precio-asc', label: 'Menor precio' },
  { value: 'precio-desc', label: 'Mayor precio' },
  { value: 'peso-desc', label: 'Mayor peso' },
]

export default function Mercado() {
  const [searchParams] = useSearchParams()
  const initialQ = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQ)
  const [tela, setTela] = useState('Todas')
  const [entrega, setEntrega] = useState('todas')
  const [orden, setOrden] = useState('reciente')
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    let result = [...lotes]
    if (query) {
      const q = query.toLowerCase()
      result = result.filter(l => {
        const t = tiendas.find(x => x.id === l.tiendaId)
        return l.titulo.toLowerCase().includes(q) ||
               l.tela.toLowerCase().includes(q) ||
               l.color.toLowerCase().includes(q) ||
               (t && t.nombre.toLowerCase().includes(q))
      })
    }
    if (tela !== 'Todas') result = result.filter(l => l.tela === tela)
    if (entrega === 'delivery') result = result.filter(l => l.entrega.includes('delivery'))
    if (entrega === 'recojo') result = result.filter(l => l.entrega.includes('recojo'))
    result.sort((a, b) => {
      if (orden === 'precio-asc') return a.precioKg - b.precioKg
      if (orden === 'precio-desc') return b.precioKg - a.precioKg
      if (orden === 'peso-desc') return b.pesoKg - a.pesoKg
      return b.fechaPublicacion.localeCompare(a.fechaPublicacion)
    })
    return result
  }, [query, tela, entrega, orden])

  const FilterPanel = ({ mobile = false }) => (
    <div className={mobile ? 'p-4 space-y-6' : 'space-y-6'}>
      <div>
        <label className="text-sm font-sans font-semibold text-verde-bosque mb-2.5 block">
          Tipo de tela
        </label>
        <div className="flex flex-wrap gap-2">
          {TELAS.map(t => (
            <button
              key={t}
              onClick={() => setTela(t)}
              className={`chip text-sm font-semibold min-h-[44px] px-3.5 py-2 ${
                tela === t ? 'chip-active' : 'chip-inactive'
              }`}
            >
              {t === 'Todas' ? 'Todas' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Separador sutil con puntada textil */}
      <div className="border-t border-dashed border-menta my-2" />

      <div>
        <label className="text-sm font-sans font-semibold text-verde-bosque mb-2.5 block">
          Modalidad de entrega
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            ['todas', 'Todas'],
            ['delivery', 'Delivery'],
            ['recojo', 'Recojo en taller'],
          ].map(([v, l]) => (
            <button
              key={v}
              onClick={() => setEntrega(v)}
              className={`chip text-sm font-semibold min-h-[44px] px-4 py-2 ${
                entrega === v ? 'chip-active' : 'chip-inactive'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Separador sutil con puntada textil */}
      <div className="border-t border-dashed border-menta my-2" />

      <div>
        <label className="text-sm font-sans font-semibold text-verde-bosque mb-2 block">
          Ordenar resultados
        </label>
        <select
          value={orden}
          onChange={e => setOrden(e.target.value)}
          className="input-field text-sm font-sans font-semibold text-verde-bosque bg-white min-h-[44px]"
        >
          {ORDEN.map(o => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )

  return (
    <div className="page-enter max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-8 bg-crema">
      {/* Search bar y botón de filtros móvil */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gris-calido pointer-events-none"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por tejido, fardo, color o taller..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="input-field pl-10 bg-white text-verde-bosque min-h-[44px]"
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden btn-secondary px-3.5 py-2.5 min-h-[44px] flex items-center gap-1.5"
          aria-label="Filtros"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="8" y1="12" x2="20" y2="12" />
            <line x1="12" y1="18" x2="20" y2="18" />
          </svg>
          <span className="text-sm font-semibold">Filtros</span>
        </button>
      </div>

      <div className="flex gap-8">
        {/* Barra lateral de filtros para Desktop con puntada en ficha */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-20 card p-5 border-menta bg-white">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-dashed border-menta">
              <h3 className="font-fredoka font-semibold text-lg text-verde-bosque">
                Filtros de búsqueda
              </h3>
              {(tela !== 'Todas' || entrega !== 'todas' || query) && (
                <button
                  type="button"
                  onClick={() => { setTela('Todas'); setEntrega('todas'); setQuery(''); }}
                  className="text-sm text-verde-bosque font-semibold hover:underline underline-offset-2"
                >
                  Limpiar
                </button>
              )}
            </div>
            <FilterPanel />
          </div>
        </aside>

        {/* Listado de resultados */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-sans font-normal text-gris-calido">
              {filtered.length} lote{filtered.length !== 1 ? 's' : ''} disponible{filtered.length !== 1 ? 's' : ''}
            </p>

            <select
              value={orden}
              onChange={e => setOrden(e.target.value)}
              className="hidden md:block text-sm font-sans font-semibold border border-menta rounded-boton px-3 py-2 text-verde-bosque bg-white min-h-[44px]"
            >
              {ORDEN.map(o => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* Estado vacío: Swipee con microcopy oficial en lugar de emoji */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white rounded-tarjeta border border-menta shadow-xs max-w-md mx-auto my-6">
              <picture className="mx-auto mb-4 block">
                <source srcSet={mascotaWebp} type="image/webp" />
                <img
                  src={mascotaPng}
                  alt=""
                  width="88"
                  height="108"
                  className="mx-auto object-contain"
                />
              </picture>
              <h3 className="text-lg font-fredoka font-semibold text-verde-bosque">
                Aún no hay coincidencias
              </h3>
              <p className="text-base font-sans font-normal text-verde-bosque/85 mt-1 max-w-xs mx-auto">
                &ldquo;Aún no hay coincidencias. Vuelvo a buscar por ti.&rdquo;
              </p>
              <button
                type="button"
                onClick={() => { setTela('Todas'); setEntrega('todas'); setQuery(''); }}
                className="mt-5 btn-secondary min-h-[44px] text-sm font-semibold"
              >
                Restablecer todos los filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 md:gap-4">
              {filtered.map(l => (
                <LoteCard key={l.id} lote={l} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal / bottom sheet de filtros en móvil */}
      {showFilters && (
        <div className="fixed inset-0 z-50 md:hidden" onClick={() => setShowFilters(false)}>
          <div className="absolute inset-0 bg-verde-bosque/40 transition-opacity" style={{ animation: 'fadeIn 0.2s ease' }} />
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-tarjeta max-h-[80vh] overflow-y-auto page-enter border-t border-menta"
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-crema px-5 py-4 border-b border-menta flex items-center justify-between z-10">
              <h3 className="font-fredoka font-semibold text-lg text-verde-bosque">
                Filtros de búsqueda
              </h3>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-gris-calido hover:text-verde-bosque"
                aria-label="Cerrar filtros"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <FilterPanel mobile />
            <div className="p-4 border-t border-menta bg-crema sticky bottom-0">
              <button
                onClick={() => setShowFilters(false)}
                className="btn-primary w-full min-h-[44px]"
              >
                Ver {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
