import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LoteCard from '../components/LoteCard'
import ImpactBanner from '../components/ImpactBanner'
import Logo from '../components/Logo'
import lotes from '../data/lotes.json'

const TELAS = ['Todas', 'Algodón', 'Poliéster', 'Denim', 'Jersey', 'Mezcla', 'Licra', 'Franela']

export default function Inicio() {
  const [search, setSearch] = useState('')
  const [telaFilter, setTelaFilter] = useState('Todas')
  const scrollRef = useRef(null)
  const navigate = useNavigate()

  const destacados = lotes.filter(l => l.destacado)
  const recientes = lotes.slice().sort((a, b) => b.fechaPublicacion.localeCompare(a.fechaPublicacion)).slice(0, 6)

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/mercado?q=${encodeURIComponent(search)}`)
  }

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-500 via-brand-400 to-brand-300 text-white">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 md:py-16">
          <div className="md:hidden mb-4"><Logo size={28} /></div>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-balance">
            Dale nueva vida a los<br/>retazos de Gamarra
          </h1>
          <p className="mt-3 text-base md:text-lg opacity-90 max-w-xl">
            Compra y vende retazos textiles. Cada kilo que rescatas reduce desperdicios y genera impacto real.
          </p>
          <form onSubmit={handleSearch} className="mt-6 flex gap-2 max-w-lg">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                type="text"
                placeholder="Buscar por tela, color, tienda..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-field pl-10 bg-white/95 text-neutral-800"
              />
            </div>
            <button type="submit" className="btn-accent whitespace-nowrap">Buscar</button>
          </form>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-10 space-y-8 md:space-y-12">
        {/* Impact */}
        <ImpactBanner />

        {/* Filter chips */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-neutral-800 mb-3">Descubre retazos</h2>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none">
            {TELAS.map(t => (
              <button
                key={t}
                onClick={() => setTelaFilter(t)}
                className={`chip whitespace-nowrap ${telaFilter === t ? 'chip-active' : 'chip-inactive'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Swipe section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl md:text-2xl font-bold text-neutral-800">✨ Lotes destacados</h2>
            <Link to="/mercado" className="text-sm font-medium text-brand-500 hover:text-brand-600">Ver todos &rarr;</Link>
          </div>
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none -mx-4 px-4"
          >
            {destacados.map(l => (
              <LoteCard key={l.id} lote={l} variant="swipe" />
            ))}
          </div>
        </div>

        {/* Recent grid */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl md:text-2xl font-bold text-neutral-800">Publicados recientemente</h2>
            <Link to="/mercado" className="text-sm font-medium text-brand-500 hover:text-brand-600">Ver todos &rarr;</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {recientes.map(l => (
              <LoteCard key={l.id} lote={l} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

