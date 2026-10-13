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
          <span className="absolute top-2 left-2 badge badge-metro">
            Tambi&eacute;n por metro
          </span>
        )}
        <div className="absolute top-2 right-2 flex gap-1">
          {lote.entrega.includes('delivery') && <span className="badge badge-delivery">Delivery</span>}
          {lote.entrega.includes('recojo') && <span className="badge badge-recojo">Recojo</span>}
        </div>
      </div>
      <div className="p-3.5 md:p-4">
        <h3 className="font-sans font-semibold text-sm md:text-base text-verde-bosque line-clamp-2 group-hover:text-verde-hoja transition-colors">
          {lote.titulo}
        </h3>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="text-xl md:text-2xl font-fredoka font-bold text-verde-bosque">S/{lote.precioKg.toFixed(2)}</span>
          <span className="text-sm text-gris-calido">por kg</span>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-sm text-gris-calido font-sans font-medium">
          <span>{lote.pesoKg} kg</span>
          <span>·</span>
          <span className="capitalize">{lote.tela}</span>
          <span>·</span>
          <span>{lote.color}</span>
        </div>
        {tienda && (
          <div className="mt-2.5 flex items-center gap-2 pt-2 border-t border-menta/50">
            <div className="w-7 h-7 rounded-full bg-menta text-verde-bosque text-sm font-bold flex items-center justify-center flex-shrink-0">
              {tienda.avatar}
            </div>
            <span className="text-sm text-verde-bosque font-medium truncate">{tienda.nombre}</span>
            {tienda.verificado && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#1E8449" className="flex-shrink-0" aria-label="Verificado">
                <path d="M12 2L15.09 5.09L19.5 5.5L18.91 9.91L22 13L18.91 16.09L19.5 20.5L15.09 20.91L12 24L8.91 20.91L4.5 20.5L5.09 16.09L2 13L5.09 9.91L4.5 5.5L8.91 5.09L12 2ZM10.5 16.5L17.5 9.5L16.09 8.09L10.5 13.68L7.91 11.09L6.5 12.5L10.5 16.5Z"/>
              </svg>
            )}
            <div className="ml-auto">
              <StarRating rating={tienda.calificacion} size={14} />
            </div>
          </div>
        )}
      </div>
    </Link>
  )
}
