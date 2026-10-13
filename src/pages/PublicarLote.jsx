import { useState } from 'react'
import { Link } from 'react-router-dom'
import Modal from '../components/Modal'
import impactoConfig from '../data/impactoConfig.json'

export default function PublicarLote() {
  const [step, setStep] = useState(1)
  const [previewModal, setPreviewModal] = useState(false)
  const [successModal, setSuccessModal] = useState(false)
  
  const [formData, setFormData] = useState({
    tela: 'algodon',
    composicion: '',
    color: '',
    pesoKg: '',
    tamanoMinPieza: '',
    precioKg: '',
    metroDisponible: false,
    anchoM: '',
    largoM: '',
    precioMetro: '',
    entrega: { delivery: false, recojo: true }
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (type === 'checkbox' && name.startsWith('entrega.')) {
      const field = name.split('.')[1]
      setFormData(prev => ({ ...prev, entrega: { ...prev.entrega, [field]: checked } }))
    } else {
      setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    }
  }

  const factor = impactoConfig.factores[formData.tela] || impactoConfig.factores.mezcla
  const peso = parseFloat(formData.pesoKg) || 0
  const impactoEstimado = {
    co2: (peso * factor.co2PorKg * impactoConfig.reduccion).toFixed(1),
    agua: (peso * factor.aguaPorKg * impactoConfig.reduccion).toFixed(0)
  }

  const canProceed = () => {
    if (step === 1) return formData.composicion && formData.color
    if (step === 2) return formData.pesoKg && formData.tamanoMinPieza && formData.precioKg && 
      (!formData.metroDisponible || (formData.anchoM && formData.largoM && formData.precioMetro))
    return formData.entrega.delivery || formData.entrega.recojo
  }

  return (
    <div className="page-enter max-w-2xl mx-auto px-4 md:px-8 py-6">
      <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-6">Publicar un lote</h1>

      {/* Progress */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map(i => (
          <div key={i} className={`h-2 flex-1 rounded-full transition-colors ${i <= step ? 'bg-brand-500' : 'bg-neutral-200'}`} />
        ))}
      </div>

      <div className="card p-6">
        {step === 1 && (
          <div className="space-y-5 page-enter">
            <h2 className="text-xl font-bold text-neutral-800">1. Fotos y características</h2>
            
            <div>
              <label className="text-sm font-semibold text-neutral-700 block mb-2">Fotos del lote</label>
              <div className="border-2 border-dashed border-neutral-300 rounded-xl p-8 text-center hover:bg-neutral-50 transition-colors cursor-pointer">
                <div className="text-3xl mb-2">↑</div>
                <p className="text-sm font-medium text-neutral-700">Sube fotos claras</p>
                <p className="text-xs text-neutral-500 mt-1">Incluye una regla o mano como escala</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-neutral-700 block mb-2">Tipo de tela principal</label>
              <select name="tela" value={formData.tela} onChange={handleChange} className="input-field">
                <option value="algodon">Algodón</option>
                <option value="poliester">Poliéster</option>
                <option value="denim">Denim</option>
                <option value="jersey">Jersey</option>
                <option value="licra">Licra</option>
                <option value="franela">Franela</option>
                <option value="mezcla">Mezcla / Otros</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-neutral-700 block mb-2">Composición (ej. 100% Algodón pima)</label>
              <input type="text" name="composicion" value={formData.composicion} onChange={handleChange} className="input-field" placeholder="Describe la composición..." />
            </div>

            <div>
              <label className="text-sm font-semibold text-neutral-700 block mb-2">Color o patrón</label>
              <input type="text" name="color" value={formData.color} onChange={handleChange} className="input-field" placeholder="Ej. Azul marino, Estampado floral..." />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 page-enter">
            <h2 className="text-xl font-bold text-neutral-800">2. Cantidad y precio</h2>
            
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm font-semibold text-neutral-700 block mb-2">Peso total (kg)</label>
                <input type="number" name="pesoKg" value={formData.pesoKg} onChange={handleChange} className="input-field" placeholder="0.0" step="0.5" />
              </div>
              <div className="flex-1">
                <label className="text-sm font-semibold text-neutral-700 block mb-2">Precio por kg (S/)</label>
                <input type="number" name="precioKg" value={formData.precioKg} onChange={handleChange} className="input-field" placeholder="0.00" step="0.5" />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-neutral-700 block mb-2">Tamaño mínimo de pieza</label>
              <input type="text" name="tamanoMinPieza" value={formData.tamanoMinPieza} onChange={handleChange} className="input-field" placeholder="Ej. Mayor a 30 cm" />
              <p className="text-xs text-neutral-500 mt-1">Ayuda a los compradores a saber si les sirve para sus cortes.</p>
            </div>

            <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 mt-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="metroDisponible" checked={formData.metroDisponible} onChange={handleChange} className="w-5 h-5 text-purple-600 rounded" />
                <span className="font-semibold text-purple-900">También vender piezas por metro</span>
              </label>
              <p className="text-xs text-purple-700 mt-1 ml-8">Solo para piezas grandes declaradas (≥ 1m).</p>
              
              {formData.metroDisponible && (
                <div className="mt-4 ml-8 space-y-4 page-enter">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-xs font-semibold text-purple-800 block mb-1">Ancho (m)</label>
                      <input type="number" name="anchoM" value={formData.anchoM} onChange={handleChange} className="input-field py-2" placeholder="Ej. 1.5" step="0.1" />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs font-semibold text-purple-800 block mb-1">Largo aprox (m)</label>
                      <input type="number" name="largoM" value={formData.largoM} onChange={handleChange} className="input-field py-2" placeholder="Ej. 3.0" step="0.5" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-purple-800 block mb-1">Precio por metro (S/)</label>
                    <input type="number" name="precioMetro" value={formData.precioMetro} onChange={handleChange} className="input-field py-2" placeholder="0.00" step="0.5" />
                  </div>
                </div>
              )}
            </div>

            {peso > 0 && (
              <div className="bg-brand-50 p-4 rounded-xl mt-4 page-enter">
                <h3 className="text-sm font-semibold text-brand-700 flex items-center gap-1.5">
                  🌱 Impacto estimado que generarás
                </h3>
                <p className="text-sm text-neutral-600 mt-1">
                  Al vender este lote evitarás la emisión de <strong>{impactoEstimado.co2} kg de CO₂</strong> y ahorrarás <strong>{impactoEstimado.agua} L de agua</strong>.
                </p>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5 page-enter">
            <h2 className="text-xl font-bold text-neutral-800">3. Entrega y cobro</h2>
            
            <div>
              <h3 className="text-sm font-semibold text-neutral-700 mb-3">Opciones de entrega para este lote</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-50">
                  <input type="checkbox" name="entrega.recojo" checked={formData.entrega.recojo} onChange={handleChange} className="w-5 h-5 text-brand-600 rounded" />
                  <div>
                    <span className="font-semibold text-neutral-800 block">Recojo en tienda</span>
                    <span className="text-xs text-neutral-500">El comprador retira de tu local</span>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 border border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-50">
                  <input type="checkbox" name="entrega.delivery" checked={formData.entrega.delivery} onChange={handleChange} className="w-5 h-5 text-brand-600 rounded" />
                  <div>
                    <span className="font-semibold text-neutral-800 block">Delivery</span>
                    <span className="text-xs text-neutral-500">Tú gestionas el envío con el comprador</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl">
              <h3 className="text-sm font-semibold text-blue-800 flex items-center gap-1.5 mb-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                Información de pagos
              </h3>
              <p className="text-xs text-blue-700">
                En esta fase piloto, Eco Swipe no procesa pagos. Cobrarás directamente al comprador (Yape, Plin, Transferencia o Efectivo) según los medios que configuraste en tu perfil.
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-neutral-100 flex justify-between">
          {step > 1 ? (
            <button onClick={() => setStep(s => s - 1)} className="btn-secondary">Atrás</button>
          ) : <div></div>}
          
          {step < 3 ? (
            <button onClick={() => setStep(s => s + 1)} disabled={!canProceed()} className="btn-primary disabled:opacity-50">Siguiente</button>
          ) : (
            <button onClick={() => setPreviewModal(true)} disabled={!canProceed()} className="btn-primary disabled:opacity-50">Vista previa y Publicar</button>
          )}
        </div>
      </div>

      <Modal isOpen={previewModal} onClose={() => setPreviewModal(false)} title="Vista previa">
        <div className="space-y-4">
          <p className="text-sm text-neutral-600">Así verán los compradores tu lote:</p>
          <div className="card p-4">
            <div className="flex gap-2 mb-2">
              {formData.entrega.delivery && <span className="badge badge-delivery">Delivery</span>}
              {formData.entrega.recojo && <span className="badge badge-recojo">Recojo en tienda</span>}
            </div>
            <h3 className="font-bold text-lg">{formData.tela.toUpperCase()} - {formData.color}</h3>
            <p className="text-sm text-neutral-500 mt-1">{formData.composicion}</p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-xl font-bold text-brand-600">S/{(parseFloat(formData.precioKg) || 0).toFixed(2)}</span>
              <span className="text-sm text-neutral-400">por kg</span>
            </div>
            <p className="text-sm mt-1">Peso total: {formData.pesoKg} kg</p>
            {formData.metroDisponible && (
              <p className="text-sm text-purple-600 mt-2 font-medium">
                También por metro a S/{(parseFloat(formData.precioMetro) || 0).toFixed(2)}
              </p>
            )}
          </div>
          <button onClick={() => { setPreviewModal(false); setSuccessModal(true) }} className="btn-primary w-full mt-4">
            Confirmar y Publicar
          </button>
        </div>
      </Modal>

      <Modal isOpen={successModal} onClose={() => setSuccessModal(false)} title="¡Lote publicado!">
        <div className="text-center py-6">
          <div className="w-16 h-16 rounded-full bg-success/20 text-success flex items-center justify-center mx-auto mb-4 text-3xl">
            ✓
          </div>
          <h3 className="text-lg font-bold text-neutral-800">Tu lote ya está en el mercado</h3>
          <p className="text-sm text-neutral-500 mt-2">Los compradores ya pueden encontrarlo y contactarte.</p>
          <div className="mt-6 flex gap-3">
            <Link to="/mercado" className="btn-secondary flex-1">Ver mercado</Link>
            <button onClick={() => { setSuccessModal(false); setStep(1); setFormData({...formData, composicion:'', color:'', pesoKg:'', tamanoMinPieza:'', precioKg:''}) }} className="btn-primary flex-1">
              Publicar otro
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

