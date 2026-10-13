import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import StarRating from '../components/StarRating'
import PlaceholderImg from '../components/PlaceholderImg'
import Modal from '../components/Modal'
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
    <div className="text-center py-20">
      <div className="text-5xl mb-4">📦</div>
      <h2 className="text-xl font-bold text-neutral-700">Lote no encontrado</h2>
      <Link to="/mercado" className="btn-primary mt-4 inline-flex">Ir al mercado</Link>
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
      <Link to="/mercado" className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-brand-500 mb-4">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        Volver al mercado
      </Link>

      <div className="md:flex gap-8">
        {/* Gallery */}
        <div className="md:w-1/2">
          <div className="card overflow-hidden">
            <PlaceholderImg tela={lote.tela} color={lote.color} className="w-full aspect-square" size="lg" />
          </div>
          <div className="flex gap-2 mt-3">
            {[1,2,3].map(i => (
              <div key={i} className="card w-20 h-20 flex-shrink-0 opacity-60 hover:opacity-100 cursor-pointer transition-opacity">
                <PlaceholderImg tela={lote.tela} color={lote.color} className="w-full h-full" size="sm" />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="md:w-1/2 mt-6 md:mt-0">
          <div className="flex gap-2 mb-2">
            {lote.entrega.includes('delivery') && <span className="badge badge-delivery">Delivery</span>}
            {lote.entrega.includes('recojo') && <span className="badge badge-recojo">Recojo en tienda</span>}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-800">{lote.titulo}</h1>

          <div className="flex items-baseline gap-3 mt-3">
            <span className="text-3xl font-extrabold text-brand-600">S/{lote.precioKg.toFixed(2)}</span>
            <span className="text-neutral-400">por kg</span>
          </div>
          {lote.metroDisponible && (
            <p className="text-sm text-purple-600 mt-1 font-medium">
              Tambi&eacute;n disponible por metro: S/{lote.precioMetro?.toFixed(2)}/m ({lote.anchoM}m x {lote.largoM}m)
            </p>
          )}

          {/* Technical sheet */}
          <div className="mt-5 bg-neutral-50 rounded-xl p-4 space-y-2.5">
            <h3 className="font-semibold text-sm text-neutral-700">Ficha t&eacute;cnica</h3>
            {[
              ['Tela', lote.tela.charAt(0).toUpperCase() + lote.tela.slice(1)],
              ['Composici\u00f3n', lote.composicion],
              ['Color', lote.color],
              ['Peso del lote', `${lote.pesoKg} kg`],
              ['Tama\u00f1o m\u00edn. pieza', lote.tamanoMinPieza],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm">
                <span className="text-neutral-500">{k}</span>
                <span className="font-medium text-neutral-700">{v}</span>
              </div>
            ))}
          </div>

          {/* Impact estimate */}
          <div className="mt-4 bg-brand-50 rounded-xl p-4">
            <h3 className="font-semibold text-sm text-brand-700 mb-2">\ud83c\udf31 Impacto estimado de este lote</h3>
            <div className="flex gap-6">
              <div><span className="text-lg font-bold text-brand-600">{impacto.co2}</span> <span className="text-xs text-neutral-500">kg CO\u2082</span></div>
              <div><span className="text-lg font-bold text-blue-600">{Number(impacto.agua).toLocaleString()}</span> <span className="text-xs text-neutral-500">L agua</span></div>
            </div>
            <p className="text-[10px] text-neutral-400 mt-1">Factores referenciales, por validar</p>
          </div>

          {/* Seller */}
          {tienda && (
            <Link to={`/tienda/${tienda.id}`} className="mt-4 flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-lg">
                {tienda.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-neutral-800">{tienda.nombre}</span>
                  {tienda.verificado && <span className="badge badge-verificado text-[10px]">Verificado</span>}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <StarRating rating={tienda.calificacion} size={14} />
                  <span className="text-xs text-neutral-400">({tienda.totalResenas})</span>
                </div>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </Link>
          )}

          {/* Payment methods */}
          {tienda && (
            <div className="mt-3">
              <h3 className="text-sm font-semibold text-neutral-700 mb-2">Medios de pago aceptados</h3>
              <div className="flex gap-2 flex-wrap">
                {tienda.pagos.map(p => (
                  <span key={p} className="chip chip-inactive text-xs cursor-default">{pagosLabels[p]}</span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <button onClick={() => setContactModal(true)} className="btn-primary flex-1 gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
              Contactar
            </button>
            <button onClick={() => setOfertaModal(true)} className="btn-secondary flex-1">Hacer oferta</button>
          </div>

          {/* Confirm delivery */}
          <div className="mt-3">
            <button onClick={() => setConfirmModal(true)}
              className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${confirmDone ? 'bg-success text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>
              {confirmDone ? '\u2705 Entrega confirmada' : 'Confirmar entrega (entregué / recibí)'}
            </button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-neutral-800 mb-4">Reseñas ({lote.resenas.length})</h2>
        {lote.resenas.length === 0 ? (
          <div className="text-center py-10 bg-neutral-50 rounded-xl">
            <div className="text-3xl mb-2">💬</div>
            <p className="text-sm text-neutral-500">Aún no hay reseñas para este lote</p>
            {confirmDone && <button className="btn-primary mt-3 text-sm">Escribir reseña</button>}
          </div>
        ) : (
          <div className="space-y-3">
            {lote.resenas.map((r, i) => (
              <div key={i} className="card p-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full bg-accent-50 text-accent-400 font-bold flex items-center justify-center text-xs">{r.usuario.charAt(0)}</div>
                  <span className="font-medium text-sm text-neutral-700">{r.usuario}</span>
                  <StarRating rating={r.calificacion} size={12} />
                  <span className="text-xs text-neutral-400 ml-auto">{r.fecha}</span>
                </div>
                <p className="text-sm text-neutral-600 ml-10">{r.texto}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contact Modal */}
      <Modal isOpen={contactModal} onClose={() => setContactModal(false)} title="Contactar vendedor">
        {tienda && (
          <div className="space-y-4">
            <p className="text-sm text-neutral-600">Contacta a <strong>{tienda.nombre}</strong> por estos medios:</p>
            {tienda.contacto.whatsapp && (
              <button className="w-full flex items-center gap-3 p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors min-h-[56px]">
                <span className="text-2xl">📱</span>
                <div className="text-left"><p className="font-semibold text-green-700">WhatsApp</p><p className="text-sm text-green-600">{tienda.contacto.whatsapp}</p></div>
              </button>
            )}
            {tienda.contacto.telefono && (
              <button className="w-full flex items-center gap-3 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors min-h-[56px]">
                <span className="text-2xl">📞</span>
                <div className="text-left"><p className="font-semibold text-blue-700">Teléfono</p><p className="text-sm text-blue-600">{tienda.contacto.telefono}</p></div>
              </button>
            )}
            <p className="text-xs text-neutral-400 text-center">Los contactos son simulados en este prototipo</p>
          </div>
        )}
      </Modal>

      {/* Offer Modal */}
      <Modal isOpen={ofertaModal} onClose={() => setOfertaModal(false)} title="Hacer una oferta">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-neutral-700 block mb-1">Tu oferta por kg (S/)</label>
            <input type="number" className="input-field" placeholder={lote.precioKg.toFixed(2)} step="0.50" />
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-700 block mb-1">Cantidad que quieres (kg)</label>
            <input type="number" className="input-field" placeholder={lote.pesoKg.toString()} step="0.5" />
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-700 block mb-1">Mensaje (opcional)</label>
            <textarea className="input-field min-h-[80px]" placeholder="Hola, me interesa tu lote..."></textarea>
          </div>
          <button className="btn-primary w-full" onClick={() => { setOfertaModal(false) }}>Enviar oferta</button>
          <p className="text-xs text-neutral-400 text-center">Función simulada en este prototipo</p>
        </div>
      </Modal>

      {/* Confirm Modal */}
      <Modal isOpen={confirmModal} onClose={() => setConfirmModal(false)} title="Confirmar entrega">
        <div className="space-y-4 text-center">
          <p className="text-sm text-neutral-600">Confirma que la entrega se realizó correctamente. Ambas partes deben confirmar.</p>
          <div className="flex gap-3">
            <button className="btn-primary flex-1" onClick={() => { setConfirmDone(true); setConfirmModal(false) }}>
              📦 Entregué
            </button>
            <button className="btn-secondary flex-1" onClick={() => { setConfirmDone(true); setConfirmModal(false) }}>
              ✅ Recibí
            </button>
          </div>
          <p className="text-xs text-neutral-400">Al confirmar se habilita la reseña y se suma el impacto ambiental</p>
        </div>
      </Modal>
    </div>
  )
}

