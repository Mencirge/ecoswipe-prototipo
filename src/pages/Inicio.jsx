import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LoteCard from '../components/LoteCard'
import ImpactBanner from '../components/ImpactBanner'
import Logo from '../components/Logo'
import mascotaWebp from '../assets/mascota.webp'
import mascotaPng from '../assets/mascota.png'
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

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -280, behavior: 'smooth' })
  }

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 280, behavior: 'smooth' })
  }

  return (
    <div className="page-enter bg-crema">
      {/* Hero cálido sobre Crema: sin degradados, sin glassmorphism */}
      <section className="bg-crema border-b border-menta/70 py-8 md:py-14">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="md:hidden mb-4">
            <Logo size={32} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Titular y buscador con voz de taller y Gamarra */}
            <div className="lg:col-span-7">
              <span className="inline-block px-3 py-1 rounded-full bg-menta text-verde-bosque text-sm font-semibold uppercase tracking-wider mb-3">
                Mercado de retazos en Gamarra
              </span>
              <h1 className="font-fredoka text-[28px] md:text-[38px] font-semibold text-verde-bosque leading-tight">
                El excedente textil de Gamarra, directo a tu taller
              </h1>
              <p className="mt-3 font-sans text-base text-verde-bosque/85 max-w-xl leading-relaxed">
                Retazos y saldos al peso. Algunos lotes tambi&eacute;n por metro.
              </p>

              <form onSubmit={handleSearch} className="mt-6 flex flex-col sm:flex-row gap-2.5 max-w-lg">
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
                    placeholder="Buscar por tela, fardo, color o taller..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="input-field pl-10 bg-white text-verde-bosque border-menta placeholder:text-gris-calido/70"
                  />
                </div>
                <button type="submit" className="btn-primary min-h-[44px] whitespace-nowrap">
                  Buscar
                </button>
              </form>
            </div>

            {/* Swipee directamente sobre fondo Crema, sin tarjeta blanca */}
            <div className="lg:col-span-5 flex items-center gap-4 sm:gap-5">
              <picture className="flex-shrink-0">
                <source srcSet={mascotaWebp} type="image/webp" />
                <img
                  src={mascotaPng}
                  alt=""
                  width="88"
                  height="108"
                  className="object-contain"
                />
              </picture>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-verde-hoja" />
                  <span className="text-sm font-semibold text-verde-bosque uppercase tracking-wider font-sans">
                    Swipee
                  </span>
                </div>
                <p className="text-base md:text-lg font-sans font-semibold text-verde-bosque leading-snug">
                  &ldquo;Encuentra el retazo exacto para tu confecci&oacute;n.&rdquo;
                </p>
                <p className="text-base text-verde-bosque/85">
                  Trato directo entre talleres y confeccionistas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-10 md:space-y-14">
        {/* Banner de Impacto */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base md:text-lg font-fredoka font-semibold text-verde-bosque">
              Impacto ambiental acumulado
            </h2>
            <Link to="/impacto" className="text-sm font-semibold text-verde-bosque hover:text-verde-hoja">
              Ver detalle &rarr;
            </Link>
          </div>
          <ImpactBanner />
        </section>

        {/* Chips de filtro por tejido con tap targets de 44px */}
        <section>
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="text-xl md:text-2xl font-fredoka font-semibold text-verde-bosque">
              Retazos clasificados por tejido
            </h2>
            <span className="text-sm text-gris-calido font-normal hidden sm:inline">
              Toca para filtrar por tipo de tela
            </span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none">
            {TELAS.map(t => (
              <button
                key={t}
                onClick={() => setTelaFilter(t)}
                className={`chip min-h-[44px] px-4 whitespace-nowrap text-sm font-semibold ${
                  telaFilter === t ? 'chip-active' : 'chip-inactive'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </section>

        {/* Carrusel de lotes destacados */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-xl md:text-2xl font-fredoka font-semibold text-verde-bosque flex items-center gap-2">
                <span>Lotes destacados</span>
              </h2>
              <p className="text-base text-verde-bosque/85 mt-0.5">
                Desliza para ver m&aacute;s lotes
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              {/* Botón scroll izquierda */}
              <button
                type="button"
                onClick={scrollLeft}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-boton border border-gris-calido/30 bg-white text-gris-calido hover:bg-crema text-sm font-semibold min-h-[44px] transition-colors"
                aria-label="Desplazar a la izquierda"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
                <span>Anterior</span>
              </button>

              {/* Botón scroll derecha */}
              <button
                type="button"
                onClick={scrollRight}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-boton bg-verde-hoja text-white hover:bg-brand-600 text-sm font-semibold min-h-[44px] transition-colors shadow-xs"
                aria-label="Desplazar a la derecha"
              >
                <span>Siguiente</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>

              <Link
                to="/mercado"
                className="text-sm font-semibold text-verde-bosque hover:text-verde-hoja ml-2 pl-2 border-l border-menta"
              >
                Ver todos &rarr;
              </Link>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none -mx-4 px-4"
          >
            {destacados.map(l => (
              <LoteCard key={l.id} lote={l} variant="swipe" />
            ))}
          </div>
        </section>

        {/* Separador de puntada artesanal textil */}
        <div className="border-t border-dashed border-verde-hoja/30 my-6" />

        {/* Sección de lotes recién publicados */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl md:text-2xl font-fredoka font-semibold text-verde-bosque">
                Últimos lotes publicados
              </h2>
              <p className="text-base text-verde-bosque/85 mt-0.5">
                Lo &uacute;ltimo que subieron los talleres.
              </p>
            </div>
            <Link to="/mercado" className="text-sm font-semibold text-verde-bosque hover:text-verde-hoja">
              Ver catálogo completo &rarr;
            </Link>
          </div>

          {/* Grilla asimétrica: lote protagonista de mayor tamaño + lotes complementarios */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {recientes.length > 0 && (
              <div className="md:col-span-2 lg:col-span-2 bg-white rounded-tarjeta p-1 border-2 border-menta shadow-sm relative">
                <span className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-verde-bosque text-crema text-sm font-semibold tracking-wide flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#FBF7EE" stroke="#FBF7EE" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  <span>&Uacute;ltimo lote publicado</span>
                </span>
                <LoteCard lote={recientes[0]} />
              </div>
            )}
            {recientes.slice(1).map(l => (
              <div key={l.id} className="col-span-1">
                <LoteCard lote={l} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
