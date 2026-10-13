import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import LoteCard from '../components/LoteCard'
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
    <div className={mobile ? 'p-4 space-y-5' : 'space-y-5'}>
      <div>
        <label className="text-sm font-semibold text-neutral-700 mb-2 block">Tipo de tela</label>
        <div className="flex flex-wrap gap-2">
          {TELAS.map(t => (
            <button key={t} onClick={() => setTela(t)}
              className={`chip text-xs ${tela === t ? 'chip-active' : 'chip-inactive'}`}
            >{t === 'Todas' ? 'Todas' : t.charAt(0).toUpperCase() + t.slice(1)}</button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-sm font-semibold text-neutral-700 mb-2 block">Entrega</label>
        <div className="flex gap-2">
          {[['todas','Todas'],['delivery','Delivery'],['recojo','Recojo']].map(([v,l]) => (
            <button key={v} onClick={() => setEntrega(v)}
              className={`chip text-xs ${entrega === v ? 'chip-active' : 'chip-inactive'}`}
            >{l}</button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-sm font-semibold text-neutral-700 mb-2 block">Ordenar por</label>
        <select value={orden} onChange={e => setOrden(e.target.value)} className="input-field text-sm">
          {ORDEN.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
    </div>
  )

  return (
    <div className="page-enter max-w-6xl mx-auto px-4 md:px-8 py-6">
      {/* Search bar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Buscar retazos..." value={query} onChange={e => setQuery(e.target.value)}
            className="input-field pl-10" />
        </div>
        <button onClick={() => setShowFilters(!showFilters)}
          className="md:hidden btn-secondary px-3 py-3" aria-label="Filtros">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="12" y1="18" x2="20" y2="18"/></svg>
        </button>
      </div>

      <div className="flex gap-8">
        {/* Desktop sidebar filters */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-20 card p-5">
            <h3 className="font-bold text-neutral-800 mb-4">Filtros</h3>
            <FilterPanel />
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-neutral-500">{filtered.length} lote{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}</p>
            <select value={orden} onChange={e => setOrden(e.target.value)}
              className="hidden md:block text-sm border border-neutral-200 rounded-lg px-3 py-2 text-neutral-600 bg-white">
              {ORDEN.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-neutral-700">No encontramos lotes</h3>
              <p className="text-sm text-neutral-500 mt-1">Intenta con otros filtros o términos de búsqueda</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
              {filtered.map(l => <LoteCard key={l.id} lote={l} />)}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter sheet */}
      {showFilters && (
        <div className="fixed inset-0 z-50 md:hidden" onClick={() => setShowFilters(false)}>
          <div className="absolute inset-0 bg-black/40" style={{ animation: 'fadeIn 0.2s ease' }} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[70vh] overflow-y-auto page-enter"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
              <h3 className="font-bold text-lg">Filtros</h3>
              <button onClick={() => setShowFilters(false)} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <FilterPanel mobile />
            <div className="p-4 border-t border-neutral-100">
              <button onClick={() => setShowFilters(false)} className="btn-primary w-full">
                Ver {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

