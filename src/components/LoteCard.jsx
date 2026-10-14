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
      className={`card block group ${isSwipe ? 'swipe-card w-[68%] min-w-[220px] max-w-[240px] md:w-auto md:min-w-[260px] md:max-w-[280px] snap-center flex-shrink-0' : ''}`}
    >
      <div className="relative">
        <PlaceholderImg tela={lote.tela} color={lote.color} className="w-full aspect-[4/3]" size="lg" />
        <div className="absolute top-2 left-2 right-2 flex flex-wrap gap-1 items-start justify-between pointer-events-none">
          {lote.metroDisponible && (
            <span className="badge badge-metro">
              Por metro
            </span>
          )}
          {/* Delivery y Recojo sobre la imagen: solo en desktop md+ */}
          <div className="hidden md:flex gap-1 ml-auto">
            {lote.entrega.includes('delivery') && <span className="badge badge-delivery">Delivery</span>}
            {lote.entrega.includes('recojo') && <span className="badge badge-recojo">Recojo</span>}
          </div>
        </div>
      </div>
      <div className="p-3 md:p-4">
        <h3 className="font-sans font-semibold text-[15px] md:text-base text-verde-bosque line-clamp-2 leading-snug group-hover:text-verde-hoja transition-colors">
          {lote.titulo}
        </h3>
        <div className="mt-1 md:mt-1.5 flex items-baseline gap-1.5 md:gap-2">
          <span className="text-[18px] md:text-2xl font-fredoka font-bold text-verde-bosque">S/{lote.precioKg.toFixed(2)}</span>
          <span className="text-[13px] text-gris-calido md:hidden">/kg</span>
          <span className="hidden md:inline text-sm text-gris-calido">por kg</span>
        </div>
        {/* En móvil: Delivery y Recojo pasan a una línea de texto de 13px bajo el precio con ícono SVG de 16px */}
        <div className="flex md:hidden items-center gap-1 text-[13px] text-gris-calido mt-0.5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-verde-hoja" aria-hidden="true">
            <rect x="1" y="3" width="15" height="13" />
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
          </svg>
          <span className="truncate">
            {lote.entrega.includes('delivery') && lote.entrega.includes('recojo')
              ? 'Delivery · Recojo'
              : lote.entrega.includes('delivery')
              ? 'Delivery'
              : 'Recojo'}
          </span>
        </div>
        {/* Metadatos en una sola línea con truncate */}
        <div className="mt-1 text-[13px] text-gris-calido font-sans truncate md:hidden">
          <span>{lote.pesoKg} kg</span> · <span className="capitalize">{lote.tela}</span>
        </div>
        <div className="mt-1 hidden md:flex items-center gap-1.5 text-sm text-gris-calido font-sans font-normal">
          <span>{lote.pesoKg} kg</span>
          <span>·</span>
          <span className="capitalize">{lote.tela}</span>
          <span>·</span>
          <span>{lote.color}</span>
        </div>
        {tienda && (
          <div className="mt-2 md:mt-2.5 flex items-center gap-1.5 md:gap-2 pt-1.5 md:pt-2 border-t border-menta/50">
            <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-menta text-verde-bosque text-xs md:text-sm font-semibold flex items-center justify-center flex-shrink-0">
              {tienda.avatar}
            </div>
            <span className="text-[13px] md:text-sm text-verde-bosque font-semibold truncate">{tienda.nombre}</span>
            {tienda.verificado && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#1E8449" className="flex-shrink-0" aria-label="Verificado">
                <path d="M12 2L15.09 5.09L19.5 5.5L18.91 9.91L22 13L18.91 16.09L19.5 20.5L15.09 20.91L12 24L8.91 20.91L4.5 20.5L5.09 16.09L2 13L5.09 9.91L4.5 5.5L8.91 5.09L12 2ZM10.5 16.5L17.5 9.5L16.09 8.09L10.5 13.68L7.91 11.09L6.5 12.5L10.5 16.5Z"/>
              </svg>
            )}
            <div className="ml-auto flex-shrink-0">
              <StarRating rating={tienda.calificacion} size={14} />
            </div>
          </div>
        )}
      </div>
    </Link>
  )
}
