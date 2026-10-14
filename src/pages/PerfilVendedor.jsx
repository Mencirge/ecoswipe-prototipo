import { useParams, Link } from 'react-router-dom'
import LoteCard from '../components/LoteCard'
import StarRating from '../components/StarRating'
import Swipee from '../components/Swipee'
import lotes from '../data/lotes.json'
import tiendas from '../data/tiendas.json'

export default function PerfilVendedor() {
  const { id } = useParams()
  const tienda = tiendas.find(t => t.id === id)
  const lotesTienda = lotes.filter(l => l.tiendaId === id)

  if (!tienda) return (
    <div className="text-center py-20 px-4">
      <h2 className="text-2xl font-fredoka font-semibold text-verde-bosque">Tienda no encontrada</h2>
      <p className="text-base text-verde-bosque/80 mt-2">No encontramos ningún taller registrado con este identificador.</p>
      <Link to="/mercado" className="btn-primary min-h-[44px] mt-6 inline-flex items-center justify-center">
        Ir al mercado
      </Link>
    </div>
  )

  const pagosLabels = { yape: 'Yape', plin: 'Plin', transferencia: 'Transferencia', efectivo: 'Efectivo' }

  return (
    <div className="page-enter max-w-5xl mx-auto px-4 md:px-8 py-6 space-y-8">
      {/* Cabecera del Taller: Verde Bosque y Crema artesanal (sin blur ni degradados artificiales) */}
      <section className="bg-white rounded-tarjeta border border-menta shadow-sm overflow-hidden" aria-label="Perfil del taller">
        {/* Franja superior artesanal en Verde Bosque sólido con puntada decorativa */}
        <div className="h-28 md:h-36 bg-verde-bosque relative px-6 py-4 flex items-start justify-between border-b-2 border-dashed border-menta/40">
          <span className="text-sm font-semibold text-crema/90 tracking-wide">
            Taller Textil de Gamarra
          </span>

          {tienda.verificado && (
            <div className="bg-crema border border-verde-hoja/30 px-3.5 py-1.5 rounded-full flex items-center gap-2 shadow-xs">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1E8449" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="text-sm font-semibold text-verde-bosque">
                Taller verificado
              </span>
            </div>
          )}
        </div>

        {/* Datos principales del taller */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-12 md:-mt-14 mb-4">
            {/* Avatar circular con borde sólido Crema */}
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-crema bg-verde-bosque flex items-center justify-center text-3xl font-fredoka font-bold text-crema shadow-sm">
              <span>{tienda.avatar}</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="btn-primary min-h-[44px] px-6 text-sm font-semibold"
              >
                Contactar taller
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-fredoka font-semibold text-verde-bosque">
                {tienda.nombre}
              </h1>
              <p className="text-sm font-semibold text-verde-bosque/85 flex items-center gap-1.5 mt-1">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E8449" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>{tienda.ubicacion}</span>
              </p>
            </div>

            {/* Reputación y reseñas */}
            <div className="flex items-center gap-2 pt-1">
              <StarRating rating={tienda.calificacion} size={18} />
              <span className="text-sm font-semibold font-fredoka text-verde-bosque text-base">
                {tienda.calificacion.toFixed(1)}
              </span>
              <span className="text-sm font-semibold text-verde-bosque/70">
                ({tienda.totalResenas} reseñas de confeccionistas)
              </span>
            </div>

            <p className="text-base font-normal text-verde-bosque/90 max-w-2xl leading-relaxed pt-1">
              {tienda.descripcion}
            </p>
          </div>
        </div>
      </section>

      {/* Distribución anti-IA: Sidebar con métricas reales y catálogo en rejilla */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Columna lateral: métricas y datos comerciales */}
        <aside className="space-y-6">
          {/* Métricas de impacto del taller (cifras exactas de tiendas.json) */}
          <div className="bg-white rounded-tarjeta border border-menta p-5 shadow-xs space-y-4">
            <div className="border-b border-dashed border-menta pb-2">
              <h2 className="text-lg font-fredoka font-semibold text-verde-bosque">
                Material textil aprovechado
              </h2>
              <p className="text-sm font-semibold text-verde-bosque/70 mt-0.5">
                Acumulado histórico del taller
              </p>
            </div>

            <div className="space-y-3.5">
              <div className="bg-menta/30 p-3 rounded-boton flex items-center justify-between">
                <span className="text-sm font-semibold text-verde-bosque">
                  Retazos recirculados
                </span>
                <span className="stat-figure text-base">
                  {tienda.impactoTotal.kgDesviados} kg
                </span>
              </div>

              <div className="bg-crema p-3 rounded-boton flex items-center justify-between border border-menta/40">
                <span className="text-sm font-semibold text-verde-bosque">
                  CO₂ estimado evitado
                </span>
                <span className="stat-figure text-base">
                  {tienda.impactoTotal.co2Kg} kg
                </span>
              </div>

              <div className="bg-crema p-3 rounded-boton flex items-center justify-between border border-menta/40">
                <span className="text-sm font-semibold text-verde-bosque">
                  Agua preservada
                </span>
                <span className="stat-figure text-base">
                  {tienda.impactoTotal.aguaLt.toLocaleString()} L
                </span>
              </div>
            </div>
          </div>

          {/* Información de entrega y pagos */}
          <div className="bg-white rounded-tarjeta border border-menta p-5 shadow-xs space-y-4">
            <h2 className="text-lg font-fredoka font-semibold text-verde-bosque border-b border-dashed border-menta pb-2">
              Condiciones de venta
            </h2>

            <div className="space-y-4">
              <div>
                <span className="text-sm font-semibold text-verde-bosque/80 block mb-2">
                  Modalidades de entrega
                </span>
                <div className="flex flex-wrap gap-2">
                  {tienda.entrega.includes('delivery') && (
                    <span className="badge-delivery">
                      Envío a acordar
                    </span>
                  )}
                  {tienda.entrega.includes('recojo') && (
                    <span className="badge-recojo">
                      Recojo en taller
                    </span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-sm font-semibold text-verde-bosque/80 block mb-2">
                  Medios de pago aceptados
                </span>
                <div className="flex flex-wrap gap-2">
                  {tienda.pagos.map(p => (
                    <span
                      key={p}
                      className="px-3 py-1 rounded-full bg-crema border border-menta text-verde-bosque text-sm font-semibold"
                    >
                      {pagosLabels[p] || p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Catálogo de lotes publicados por el taller */}
        <main className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-dashed border-menta pb-3">
            <div>
              <h2 className="text-xl font-fredoka font-semibold text-verde-bosque">
                Lotes disponibles ({lotesTienda.length})
              </h2>
              <p className="text-base text-verde-bosque/75 mt-0.5">
                Retazos listos para entrega directa en Gamarra
              </p>
            </div>
          </div>

          {lotesTienda.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {lotesTienda.map(l => (
                <LoteCard key={l.id} lote={l} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-tarjeta border border-menta p-8 text-center space-y-3">
              <Swipee pose="durmiendo" size="md" className="mx-auto mb-2" alt="" />
              <p className="text-base font-normal text-verde-bosque">
                Este taller no tiene lotes activos en este momento.
              </p>
              <Link to="/mercado" className="btn-secondary min-h-[44px] inline-flex items-center justify-center text-sm font-semibold">
                Ver otros lotes en el mercado
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
