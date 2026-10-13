import { Link } from 'react-router-dom'
import StarRating from './StarRating'
import PlaceholderImg from './PlaceholderImg'
import tiendas from '../data/tiendas.json'

export default function LoteCard({ lote, variant = 'grid' }) {
  const tienda = tiendas.find(t => t.id === lote.tiendaId)
  const isSwipe = variant === 'swipe'

  return (
    <Link
      to={`/lote/${lote.id}`}
      className={`card block group ${isSwipe ? 'swipe-card min-w-[260px] max-w-[280px] snap-center flex-shrink-0' : ''}`}
    >
      <div className="relative">
        <PlaceholderImg tela={lote.tela} color={lote.color} className="w-full aspect-[4/3]" size="lg" />
        {lote.metroDisponible && (
          <span className="absolute top-2 left-2 badge bg-purple-100 text-purple-700 text-[11px]">
            Tambi&eacute;n por metro
          </span>
        )}
        <div className="absolute top-2 right-2 flex gap-1">
          {lote.entrega.includes('delivery') && <span className="badge-delivery badge text-[11px]">Delivery</span>}
          {lote.entrega.includes('recojo') && <span className="badge-recojo badge text-[11px]">Recojo</span>}
        </div>
      </div>
      <div className="p-3 md:p-4">
        <h3 className="font-semibold text-sm md:text-base text-neutral-800 line-clamp-2 group-hover:text-brand-600 transition-colors">
          {lote.titulo}
        </h3>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="text-lg md:text-xl font-bold text-brand-600">S/{lote.precioKg.toFixed(2)}</span>
          <span className="text-xs text-neutral-400">por kg</span>
        </div>
        <div className="mt-1 flex items-center gap-2 text-xs text-neutral-500">
          <span>{lote.pesoKg} kg</span>
          <span>·</span>
          <span className="capitalize">{lote.tela}</span>
          <span>·</span>
          <span>{lote.color}</span>
        </div>
        {tienda && (
          <div className="mt-2 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-[10px] font-bold flex items-center justify-center">
              {tienda.avatar}
            </div>
            <span className="text-xs text-neutral-500 truncate">{tienda.nombre}</span>
            {tienda.verificado && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#2D6A4F"><path d="M12 2l2.4 4.8 5.3.8-3.8 3.7.9 5.3L12 14.1l-4.8 2.5.9-5.3L4.3 7.6l5.3-.8z"/></svg>
            )}
            <StarRating rating={tienda.calificacion} size={12} />
          </div>
        )}
      </div>
    </Link>
  )
}

