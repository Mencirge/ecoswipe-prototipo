import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import StarRating from '../components/StarRating'
import PlaceholderImg from '../components/PlaceholderImg'
import Modal from '../components/Modal'
import Swipee from '../components/Swipee'
import lotes from '../data/lotes.json'
import tiendas from '../data/tiendas.json'
import impactoConfig from '../data/impactoConfig.json'

export default function DetalleLote() {
  const { id } = useParams()
  const lote = lotes.find(l => l.id === id)
  const tienda = lote ? tiendas.find(t => t.id === lote.tiendaId) : null
  const [contactModal, setContactModal] = useState(false)
  const [ofertaModal, setOfertaModal] = useState(false)
  const [confirmModal, setConfirmModal] = useState(false)
  const [confirmDone, setConfirmDone] = useState(false)

  if (!lote) return (
    <div className="page-enter max-w-5xl mx-auto px-4 md:px-8 py-20 text-center">
      <Swipee pose="triste" size="md" className="mx-auto mb-4" alt="" />
      <h2 className="text-2xl font-fredoka font-semibold text-verde-bosque">Lote no encontrado</h2>
      <p className="text-base text-verde-bosque/85 mt-2">No encuentro ese lote. Revisa el enlace o vuelve al mercado.</p>
      <Link to="/mercado" className="btn-primary mt-6 inline-flex min-h-[44px] items-center">
        Ir al mercado
      </Link>
    </div>
  )

  const factor = impactoConfig.factores[lote.tela] || impactoConfig.factores.mezcla
  const reduccion = impactoConfig.reduccion
  const impacto = {
    co2: (lote.pesoKg * factor.co2PorKg * reduccion).toFixed(1),
    agua: (lote.pesoKg * factor.aguaPorKg * reduccion).toFixed(0),
  }

  const pagosLabels = { yape: 'Yape', plin: 'Plin', transferencia: 'Transferencia', efectivo: 'Efectivo' }

  return (
    <div className="page-enter max-w-5xl mx-auto px-4 md:px-8 py-6">
      <Link
        to="/mercado"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-verde-bosque hover:text-verde-hoja mb-6 transition-colors min-h-[44px]"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        <span>Volver al mercado</span>
      </Link>

      <div className="md:flex gap-8 items-start">
        {/* Galería visual */}
        <div className="md:w-1/2">
          <div className="card overflow-hidden border-2 border-menta">
            <PlaceholderImg tela={lote.tela} color={lote.color} className="w-full aspect-square" size="lg" />
          </div>
          <div className="flex gap-2.5 mt-3">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="card w-20 h-20 flex-shrink-0 opacity-70 hover:opacity-100 cursor-pointer transition-opacity border border-menta"
              >
                <PlaceholderImg tela={lote.tela} color={lote.color} className="w-full h-full" size="sm" />
              </div>
            ))}
          </div>
        </div>

        {/* Información del lote */}
        <div className="md:w-1/2 mt-6 md:mt-0 space-y-5">
          <div>
            <div className="flex flex-wrap gap-2 mb-2">
              {lote.entrega.includes('delivery') && <span className="badge badge-delivery">Delivery</span>}
              {lote.entrega.includes('recojo') && <span className="badge badge-recojo">Recojo en taller</span>}
            </div>
            <h1 className="text-2xl md:text-3xl font-fredoka font-semibold text-verde-bosque leading-snug">
              {lote.titulo}
            </h1>

            {/* Precio en Verde Bosque sin Terracota sobre fondo claro */}
            <div className="flex items-baseline gap-2 mt-3">
              <span className="text-3xl md:text-4xl font-fredoka font-bold text-verde-bosque">
                S/{lote.precioKg.toFixed(2)}
              </span>
              <span className="text-sm font-semibold text-gris-calido">por kg</span>
            </div>

            {/* Venta por metro: sólo si metroDisponible es true */}
            {lote.metroDisponible && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-menta text-verde-bosque text-sm font-semibold border border-verde-hoja/20">
                <span className="badge badge-metro">Por metro</span>
                <span>
                  S/{lote.precioMetro?.toFixed(2)} / metro {lote.anchoM && lote.largoM ? `(${lote.anchoM}m × ${lote.largoM}m)` : ''}
                </span>
              </div>
            )}
          </div>

          {/* Ficha técnica artesanal: único lugar con puntada fuerte */}
          <div className="bg-white rounded-tarjeta p-4 md:p-5 border-2 border-dashed border-verde-hoja/40 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-dashed border-verde-hoja/25">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E8449" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M2 12h20" strokeDasharray="3 3"/>
                <circle cx="12" cy="12" r="3" fill="#1E8449"/>
              </svg>
              <h2 className="font-fredoka font-semibold text-base text-verde-bosque">
                Ficha técnica del retazo
              </h2>
            </div>
            {[
              ['Tela', lote.tela.charAt(0).toUpperCase() + lote.tela.slice(1)],
              ['Composición', lote.composicion],
              ['Color o tono', lote.color],
              ['Peso total del lote', `${lote.pesoKg} kg`],
              ['Tamaño mín. de pieza', lote.tamanoMinPieza],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between items-baseline text-sm pt-0.5">
                <span className="text-gris-calido font-normal">{k}</span>
                <span className="font-semibold text-verde-bosque text-right">{v}</span>
              </div>
            ))}
          </div>

          {/* Separador de puntada artesanal */}
          <div className="border-t border-dashed border-verde-hoja/30 my-4" />

          {/* Estimación de impacto ambiental */}
          <div className="bg-menta/35 rounded-tarjeta p-4 border border-verde-hoja/20">
            <h3 className="font-fredoka font-semibold text-sm text-verde-bosque flex items-center gap-2 mb-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E8449" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2C19.5 4.5 19 7 17.9 12.2A7 7 0 0 1 11 20Z" />
                <path d="M11 20C11 16 13 13 18 10" />
              </svg>
              <span>Impacto estimado al reutilizar este lote</span>
            </h3>
            <div className="flex gap-6 mt-1">
              <div>
                <div className="text-xl font-bold font-fredoka text-verde-bosque">{impacto.co2}</div>
                <div className="text-sm font-semibold text-verde-bosque/75">kg CO₂ evitados</div>
              </div>
              <div className="border-l border-verde-hoja/20 pl-6">
                <div className="text-xl font-bold font-fredoka text-verde-bosque">{Number(impacto.agua).toLocaleString()}</div>
                <div className="text-sm font-semibold text-verde-bosque/75">L agua ahorrada</div>
              </div>
            </div>
            <p className="text-base text-verde-bosque/85 mt-2">
              Factores referenciales de circularidad textil en Gamarra.
            </p>
          </div>

          {/* Tienda y reputación */}
          {tienda && (
            <Link
              to={`/tienda/${tienda.id}`}
              className="flex items-center gap-3.5 p-3.5 rounded-tarjeta bg-white border border-menta hover:border-verde-hoja transition-colors shadow-xs"
            >
              <div className="w-12 h-12 rounded-full bg-menta text-verde-bosque font-semibold flex items-center justify-center text-lg flex-shrink-0">
                {tienda.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-verde-bosque truncate text-sm md:text-base">
                    {tienda.nombre}
                  </span>
                  {tienda.verificado && (
                    <span className="badge badge-verificado flex-shrink-0">
                      Verificado
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <StarRating rating={tienda.calificacion} size={14} />
                  <span className="text-sm text-gris-calido">({tienda.totalResenas} reseñas)</span>
                </div>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B6F6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </Link>
          )}

          {/* Medios de pago aceptados */}
          {tienda && (
            <div>
              <h3 className="text-sm font-semibold text-verde-bosque mb-2">Medios de pago aceptados</h3>
              <div className="flex gap-2 flex-wrap">
                {tienda.pagos.map(p => (
                  <span key={p} className="chip chip-inactive text-sm font-semibold cursor-default">
                    {pagosLabels[p]}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Botones de acción principales con 44px tap target */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setContactModal(true)}
              className="btn-primary flex-1 min-h-[44px] flex items-center justify-center gap-2"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
              </svg>
              <span>Contactar</span>
            </button>
            <button
              type="button"
              onClick={() => setOfertaModal(true)}
              className="btn-secondary flex-1 min-h-[44px] flex items-center justify-center"
            >
              Hacer oferta
            </button>
          </div>

          {/* Confirmación de entrega */}
          <div>
            <button
              type="button"
              onClick={() => setConfirmModal(true)}
              className={`w-full min-h-[44px] px-4 py-3 rounded-boton font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                confirmDone
                  ? 'bg-verde-hoja text-white'
                  : 'bg-white text-verde-bosque border border-menta hover:bg-crema'
              }`}
            >
              {confirmDone ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span>Entrega confirmada</span>
                </>
              ) : (
                <span>Confirmar entrega (entregué / recibí)</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Reseñas */}
      <div className="mt-12 pt-8 border-t border-menta">
        <h2 className="text-xl font-fredoka font-semibold text-verde-bosque mb-4">
          Reseñas del lote ({lote.resenas.length})
        </h2>
        {lote.resenas.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-tarjeta border border-menta p-6">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-menta text-verde-bosque flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <p className="text-base font-semibold text-verde-bosque">Aún no hay reseñas para este lote</p>
            <p className="text-base text-verde-bosque/80 mt-1">Sé el primero en compartir tu experiencia tras recibirlo.</p>
            {confirmDone && (
              <button type="button" className="btn-primary mt-4 text-sm min-h-[44px]">
                Escribir reseña
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {lote.resenas.map((r, i) => (
              <div key={i} className="bg-white rounded-tarjeta p-4 border border-menta shadow-xs">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="w-8 h-8 rounded-full bg-menta text-verde-bosque font-semibold flex items-center justify-center text-sm flex-shrink-0">
                    {r.usuario.charAt(0)}
                  </div>
                  <span className="font-semibold text-sm text-verde-bosque">{r.usuario}</span>
                  <StarRating rating={r.calificacion} size={14} />
                  <span className="text-sm text-gris-calido ml-auto">{r.fecha}</span>
                </div>
                <p className="text-base text-verde-bosque/90 ml-10 leading-relaxed">{r.texto}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Contacto - Sin emojis, íconos SVG de 2px */}
      <Modal isOpen={contactModal} onClose={() => setContactModal(false)} title="Contactar vendedor">
        {tienda && (
          <div className="space-y-4">
            <p className="text-base text-verde-bosque/85">
              Contacta directamente a <strong>{tienda.nombre}</strong> para coordinar entrega y pago:
            </p>
            {tienda.contacto.whatsapp && (
              <button
                type="button"
                className="w-full flex items-center gap-3.5 p-4 rounded-tarjeta bg-menta/50 hover:bg-menta transition-colors min-h-[56px] text-left border border-verde-hoja/20"
              >
                <div className="w-10 h-10 rounded-full bg-verde-hoja text-white flex items-center justify-center flex-shrink-0">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="5" y="2" width="14" height="20" rx="3" ry="3" />
                    <line x1="12" y1="18" x2="12.01" y2="18" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-verde-bosque">WhatsApp directo</p>
                  <p className="text-sm text-gris-calido">{tienda.contacto.whatsapp}</p>
                </div>
              </button>
            )}
            {tienda.contacto.telefono && (
              <button
                type="button"
                className="w-full flex items-center gap-3.5 p-4 rounded-tarjeta bg-white hover:bg-crema transition-colors min-h-[56px] text-left border border-menta"
              >
                <div className="w-10 h-10 rounded-full bg-verde-bosque text-crema flex items-center justify-center flex-shrink-0">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-verde-bosque">Llamada telefónica</p>
                  <p className="text-sm text-gris-calido">{tienda.contacto.telefono}</p>
                </div>
              </button>
            )}
            <p className="text-base text-gris-calido text-center pt-2">
              Contacto directo de taller a taller, sin intermediarios.
            </p>
          </div>
        )}
      </Modal>

      {/* Modal de Oferta */}
      <Modal isOpen={ofertaModal} onClose={() => setOfertaModal(false)} title="Hacer una oferta">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-verde-bosque block mb-1.5">
              Tu oferta por kg (S/)
            </label>
            <input
              type="number"
              className="input-field bg-white text-verde-bosque border-menta min-h-[44px]"
              placeholder={lote.precioKg.toFixed(2)}
              step="0.50"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-verde-bosque block mb-1.5">
              Cantidad que necesitas (kg)
            </label>
            <input
              type="number"
              className="input-field bg-white text-verde-bosque border-menta min-h-[44px]"
              placeholder={lote.pesoKg.toString()}
              step="0.5"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-verde-bosque block mb-1.5">
              Mensaje para el taller (opcional)
            </label>
            <textarea
              className="input-field bg-white text-verde-bosque border-menta min-h-[88px]"
              placeholder="Hola, me interesa tu lote para confección..."
            />
          </div>
          <button
            type="button"
            className="btn-primary w-full min-h-[44px]"
            onClick={() => setOfertaModal(false)}
          >
            Enviar oferta al taller
          </button>
          <p className="text-base text-gris-calido text-center">
            El confeccionista recibirá tu propuesta por mensaje.
          </p>
        </div>
      </Modal>

      {/* Modal de Confirmación ("Trato cerrado" con Swipee) */}
      <Modal isOpen={confirmModal} onClose={() => setConfirmModal(false)} title={confirmDone ? "Trato cerrado" : "Confirmar entrega"}>
        <div className="space-y-5 text-center">
          {confirmDone ? (
            /* Vista de Trato Cerrado con Swipee */
            <div className="space-y-4 py-2 page-enter">
              <Swipee pose="celebrando" size="md" className="mx-auto block" alt="" />
              <h3 className="text-xl font-fredoka font-semibold text-verde-bosque">
                ¡Trato cerrado!
              </h3>
              {/* Frase oficial en la voz de Swipee (APROBADA) */}
              <p className="text-base font-sans font-normal text-verde-bosque/90 max-w-sm mx-auto leading-relaxed">
                &ldquo;¡Trato hecho! Ese retazo ya tiene dónde seguir.&rdquo;
              </p>
              <button
                type="button"
                onClick={() => setConfirmModal(false)}
                className="btn-primary w-full min-h-[44px] mt-4"
              >
                Continuar
              </button>
            </div>
          ) : (
            /* Opciones de entrega: reemplazo de emojis por SVG */
            <>
              <p className="text-base font-semibold text-verde-bosque">
                ¿Ya entregaste o recibiste el lote?
              </p>
              <p className="text-base text-verde-bosque/85">
                Confirma la entrega según tu rol para habilitar la calificación mutua.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  className="btn-primary flex-1 min-h-[44px] flex items-center justify-center gap-2"
                  onClick={() => { setConfirmDone(true) }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                  <span>Entregué</span>
                </button>
                <button
                  type="button"
                  className="btn-secondary flex-1 min-h-[44px] flex items-center justify-center gap-2"
                  onClick={() => { setConfirmDone(true) }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span>Recibí</span>
                </button>
              </div>
              <p className="text-base text-gris-calido">
                Al confirmar sumas impacto ambiental y habilitas la calificación de taller.
              </p>
            </>
          )}
        </div>
      </Modal>
    </div>
  )
}
