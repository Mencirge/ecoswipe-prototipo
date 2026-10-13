import { useParams, Link } from 'react-router-dom'
import LoteCard from '../components/LoteCard'
import StarRating from '../components/StarRating'
import lotes from '../data/lotes.json'
import tiendas from '../data/tiendas.json'

export default function PerfilVendedor() {
  const { id } = useParams()
  const tienda = tiendas.find(t => t.id === id)
  const lotesTienda = lotes.filter(l => l.tiendaId === id)

  if (!tienda) return (
    <div className="text-center py-20">
      <h2 className="text-xl font-bold text-neutral-700">Tienda no encontrada</h2>
      <Link to="/mercado" className="btn-primary mt-4 inline-flex">Ir al mercado</Link>
    </div>
  )

  const pagosLabels = { yape: 'Yape', plin: 'Plin', transferencia: 'Transferencia', efectivo: 'Efectivo' }

  return (
    <div className="page-enter max-w-5xl mx-auto px-4 md:px-8 py-6">
      {/* Cover and Profile */}
      <div className="card overflow-hidden">
        <div className="h-32 md:h-48 bg-gradient-to-r from-brand-300 to-brand-500 relative">
          {tienda.verificado && (
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold text-brand-700 shadow-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#2D6A4F"><path d="M12 2l2.4 4.8 5.3.8-3.8 3.7.9 5.3L12 14.1l-4.8 2.5.9-5.3L4.3 7.6l5.3-.8z"/></svg>
              Vendedor Verificado
            </div>
          )}
        </div>
        <div className="px-6 pb-6 relative">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white bg-white shadow-sm flex items-center justify-center text-3xl font-bold text-brand-700 -mt-10 md:-mt-12 relative z-10">
            <div className="w-full h-full rounded-full bg-brand-50 flex items-center justify-center">
              {tienda.avatar}
            </div>
          </div>
          
          <div className="mt-4 md:flex justify-between items-start">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-neutral-800">{tienda.nombre}</h1>
              <p className="text-neutral-500 flex items-center gap-1 mt-1 text-sm md:text-base">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {tienda.ubicacion}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <StarRating rating={tienda.calificacion} size={16} />
                <span className="font-semibold text-neutral-700">{tienda.calificacion}</span>
                <span className="text-sm text-neutral-400">({tienda.totalResenas} reseñas)</span>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 flex gap-2">
              <button className="btn-primary py-2 text-sm">Seguir tienda</button>
            </div>
          </div>
          
          <p className="mt-4 text-neutral-600 max-w-2xl">{tienda.descripcion}</p>
        </div>
      </div>

      <div className="md:flex gap-8 mt-6">
        {/* Info Sidebar */}
        <div className="md:w-1/3 space-y-6">
          <div className="card p-5">
            <h3 className="font-bold text-neutral-800 mb-3">Impacto generado</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">CO₂ evitado</span>
                <span className="font-bold text-brand-600">{tienda.impactoTotal.co2Kg} kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Agua ahorrada</span>
                <span className="font-bold text-blue-600">{tienda.impactoTotal.aguaLt.toLocaleString()} L</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Retazos desviados</span>
                <span className="font-bold text-success">{tienda.impactoTotal.kgDesviados} kg</span>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-bold text-neutral-800 mb-3">Información</h3>
            <div className="space-y-4 text-sm">
              <div>
                <span className="text-neutral-500 block mb-1">Opciones de entrega</span>
                <div className="flex gap-2">
                  {tienda.entrega.includes('delivery') && <span className="badge badge-delivery">Delivery</span>}
                  {tienda.entrega.includes('recojo') && <span className="badge badge-recojo">Recojo en tienda</span>}
                </div>
              </div>
              <div>
                <span className="text-neutral-500 block mb-1">Medios de pago</span>
                <div className="flex gap-2 flex-wrap">
                  {tienda.pagos.map(p => (
                    <span key={p} className="chip chip-inactive text-xs">{pagosLabels[p]}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lotes */}
        <div className="md:w-2/3 mt-6 md:mt-0">
          <h2 className="text-xl font-bold text-neutral-800 mb-4">Lotes publicados ({lotesTienda.length})</h2>
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {lotesTienda.map(l => <LoteCard key={l.id} lote={l} />)}
          </div>
        </div>
      </div>
    </div>
  )
}

