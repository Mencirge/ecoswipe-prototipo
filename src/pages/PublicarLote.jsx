import { useState } from 'react'
import { Link } from 'react-router-dom'
import Modal from '../components/Modal'
import Swipee from '../components/Swipee'
import impactoConfig from '../data/impactoConfig.json'

const PASOS = [
  { num: 1, label: 'Fotos y tela' },
  { num: 2, label: 'Cantidad y precio' },
  { num: 3, label: 'Entrega y cobro' },
]

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
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-fredoka font-semibold text-verde-bosque">
          Publicar un lote
        </h1>
        <p className="text-base font-sans font-normal text-verde-bosque/80 mt-1">
          Comparte tu excedente textil con otros talleres y confeccionistas.
        </p>
      </div>

      {/* Stepper con número + etiqueta legible a 14px SemiBold (no solo color) */}
      <nav aria-label="Progreso de publicación" className="mb-8">
        <ol className="grid grid-cols-3 gap-2 sm:gap-4">
          {PASOS.map(p => {
            const isCurrent = p.num === step
            const isCompleted = p.num < step
            return (
              <li
                key={p.num}
                className={`flex flex-col sm:flex-row items-center sm:items-center gap-2 p-2.5 rounded-tarjeta border transition-colors ${
                  isCurrent
                    ? 'bg-white border-verde-hoja shadow-xs'
                    : isCompleted
                    ? 'bg-menta/50 border-verde-hoja/30 text-verde-bosque'
                    : 'bg-white/60 border-menta text-gris-calido'
                }`}
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-sans font-semibold text-sm flex-shrink-0 transition-colors ${
                    isCurrent
                      ? 'bg-verde-bosque text-crema'
                      : isCompleted
                      ? 'bg-verde-hoja text-white'
                      : 'bg-menta text-verde-bosque/70'
                  }`}
                >
                  {isCompleted ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    p.num
                  )}
                </div>
                <div className="text-center sm:text-left min-w-0">
                  <span
                    className={`block font-sans text-sm font-semibold truncate ${
                      isCurrent ? 'text-verde-bosque' : isCompleted ? 'text-verde-bosque' : 'text-gris-calido'
                    }`}
                  >
                    {p.label}
                  </span>
                </div>
              </li>
            )
          })}
        </ol>
      </nav>

      {/* Tarjeta del formulario con radio de 16px (rounded-tarjeta) */}
      <div className="bg-white rounded-tarjeta p-5 sm:p-7 border border-menta shadow-xs">
        {step === 1 && (
          <div className="space-y-6 page-enter">
            <div>
              <h2 className="text-xl font-fredoka font-semibold text-verde-bosque">
                1. Fotos y características del tejido
              </h2>
              <p className="text-base text-gris-calido mt-0.5">
                Muestra claramente el tejido, textura y acabado de tus retazos.
              </p>
            </div>
            
            <div>
              <label className="text-sm font-semibold text-verde-bosque block mb-2">
                Fotos del lote
              </label>
              <div className="border-2 border-dashed border-menta hover:border-verde-hoja rounded-tarjeta p-7 text-center hover:bg-crema/50 transition-colors cursor-pointer group">
                <div className="w-12 h-12 rounded-full bg-menta text-verde-bosque flex items-center justify-center mx-auto mb-2 group-hover:bg-verde-hoja group-hover:text-white transition-colors">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-verde-bosque">
                  Sube fotos claras del retazo
                </p>
                <p className="text-base text-gris-calido mt-1">
                  Incluye una regla o mano como escala de referencia
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-verde-bosque block mb-2">
                Tipo de tela principal
              </label>
              <select
                name="tela"
                value={formData.tela}
                onChange={handleChange}
                className="input-field bg-white text-verde-bosque border-menta rounded-boton min-h-[44px] text-sm"
              >
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
              <label className="text-sm font-semibold text-verde-bosque block mb-2">
                Composición del tejido
              </label>
              <input
                type="text"
                name="composicion"
                value={formData.composicion}
                onChange={handleChange}
                className="input-field bg-white text-verde-bosque border-menta rounded-boton min-h-[44px] text-sm"
                placeholder="Ej. 100% Algodón pima, 60/40 poli-algodón..."
              />
              {!formData.composicion && step === 1 && (
                <p className="text-base text-gris-calido mt-1.5 flex items-center gap-1">
                  Campo requerido para avanzar al siguiente paso.
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-semibold text-verde-bosque block mb-2">
                Color o patrón
              </label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="input-field bg-white text-verde-bosque border-menta rounded-boton min-h-[44px] text-sm"
                placeholder="Ej. Blanco puro, Azul marino, Estampado floral..."
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 page-enter">
            <div className="flex items-center gap-3 sm:gap-4">
              <Swipee pose="anotando" size="sm" alt="" className="flex-shrink-0" />
              <div>
                <h2 className="text-xl font-fredoka font-semibold text-verde-bosque">
                  2. Cantidad, dimensiones y precio
                </h2>
                <p className="text-base text-gris-calido mt-0.5">
                  Anota el peso y el precio del lote.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-verde-bosque block mb-2">
                  Peso total del lote (kg)
                </label>
                <input
                  type="number"
                  name="pesoKg"
                  value={formData.pesoKg}
                  onChange={handleChange}
                  className="input-field bg-white text-verde-bosque border-menta rounded-boton min-h-[44px] text-sm"
                  placeholder="0.0"
                  step="0.5"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-verde-bosque block mb-2">
                  Precio por kg (S/)
                </label>
                <input
                  type="number"
                  name="precioKg"
                  value={formData.precioKg}
                  onChange={handleChange}
                  className="input-field bg-white text-verde-bosque border-menta rounded-boton min-h-[44px] text-sm"
                  placeholder="0.00"
                  step="0.5"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-verde-bosque block mb-2">
                Tamaño mínimo de pieza
              </label>
              <input
                type="text"
                name="tamanoMinPieza"
                value={formData.tamanoMinPieza}
                onChange={handleChange}
                className="input-field bg-white text-verde-bosque border-menta rounded-boton min-h-[44px] text-sm"
                placeholder="Ej. Mayor a 30 cm, piezas de 50x50 cm..."
              />
              <p className="text-base text-gris-calido mt-1.5">
                Ayuda a los talleres compradores a saber si el corte les sirve para sus patrones.
              </p>
            </div>

            {/* Opción de venta por metro */}
            <div className="p-4 sm:p-5 bg-menta/30 rounded-tarjeta border border-menta">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="metroDisponible"
                  checked={formData.metroDisponible}
                  onChange={handleChange}
                  className="w-5 h-5 text-verde-hoja rounded focus:ring-verde-hoja cursor-pointer"
                />
                <span className="font-semibold text-sm text-verde-bosque">
                  También vender piezas por metro
                </span>
              </label>
              <p className="text-base text-gris-calido mt-1 ml-8">
                Habilita esta opción solo para retazos grandes continuos (≥ 1 metro).
              </p>
              
              {formData.metroDisponible && (
                <div className="mt-4 pt-3 border-t border-verde-hoja/20 ml-0 sm:ml-8 space-y-4 page-enter">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-semibold text-verde-bosque block mb-1">
                        Ancho útil (m)
                      </label>
                      <input
                        type="number"
                        name="anchoM"
                        value={formData.anchoM}
                        onChange={handleChange}
                        className="input-field bg-white text-verde-bosque border-menta rounded-boton min-h-[44px] text-sm"
                        placeholder="Ej. 1.5"
                        step="0.1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-verde-bosque block mb-1">
                        Largo aprox. (m)
                      </label>
                      <input
                        type="number"
                        name="largoM"
                        value={formData.largoM}
                        onChange={handleChange}
                        className="input-field bg-white text-verde-bosque border-menta rounded-boton min-h-[44px] text-sm"
                        placeholder="Ej. 3.0"
                        step="0.5"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-verde-bosque block mb-1">
                      Precio por metro lineal (S/)
                    </label>
                    <input
                      type="number"
                      name="precioMetro"
                      value={formData.precioMetro}
                      onChange={handleChange}
                      className="input-field bg-white text-verde-bosque border-menta rounded-boton min-h-[44px] text-sm"
                      placeholder="0.00"
                      step="0.5"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Estimacion de impacto ambiental con icono SVG */}
            {peso > 0 && (
              <div className="bg-menta/40 border border-verde-hoja/20 p-4 rounded-tarjeta page-enter">
                <h3 className="text-sm font-semibold text-verde-bosque flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E8449" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2C19.5 4.5 19 7 17.9 12.2A7 7 0 0 1 11 20Z" />
                    <path d="M11 20C11 16 13 13 18 10" />
                  </svg>
                  <span>Impacto ecológico que generarás con este lote</span>
                </h3>
                <p className="text-base text-verde-bosque/85 mt-1.5 leading-relaxed">
                  Al vender este lote evitarás la emisión de <strong>{impactoEstimado.co2} kg de CO₂</strong> y ahorrarás <strong>{impactoEstimado.agua} litros de agua</strong>.
                </p>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 page-enter">
            <div>
              <h2 className="text-xl font-fredoka font-semibold text-verde-bosque">
                3. Modalidad de entrega y cobro
              </h2>
              <p className="text-base text-gris-calido mt-0.5">
                Elige cómo los confeccionistas podrán retirar o recibir el lote.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-verde-bosque mb-3">
                Opciones de entrega para este lote
              </h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3.5 p-3.5 border border-menta rounded-tarjeta cursor-pointer hover:bg-crema/50 transition-colors">
                  <input
                    type="checkbox"
                    name="entrega.recojo"
                    checked={formData.entrega.recojo}
                    onChange={handleChange}
                    className="w-5 h-5 text-verde-hoja rounded focus:ring-verde-hoja cursor-pointer"
                  />
                  <div>
                    <span className="font-semibold text-sm text-verde-bosque block">Recojo en taller</span>
                    <span className="text-sm text-gris-calido">El comprador retira directamente de tu local en Gamarra</span>
                  </div>
                </label>
                <label className="flex items-center gap-3.5 p-3.5 border border-menta rounded-tarjeta cursor-pointer hover:bg-crema/50 transition-colors">
                  <input
                    type="checkbox"
                    name="entrega.delivery"
                    checked={formData.entrega.delivery}
                    onChange={handleChange}
                    className="w-5 h-5 text-verde-hoja rounded focus:ring-verde-hoja cursor-pointer"
                  />
                  <div>
                    <span className="font-semibold text-sm text-verde-bosque block">Delivery / Despacho</span>
                    <span className="text-sm text-gris-calido">Tú gestionas el envío o mototaxi con el comprador</span>
                  </div>
                </label>
              </div>
              {!formData.entrega.delivery && !formData.entrega.recojo && (
                <div className="mt-2.5 p-3 rounded-boton bg-terracota/10 border border-terracota/30 text-verde-bosque flex items-center gap-2 text-sm font-normal">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E4793B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>Debes seleccionar al menos una modalidad de entrega.</span>
                </div>
              )}
            </div>

            <div className="bg-menta/30 p-4 rounded-tarjeta border border-menta">
              <h3 className="text-sm font-semibold text-verde-bosque flex items-center gap-2 mb-1">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E8449" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <span>Información sobre cobranza</span>
              </h3>
              <p className="text-base text-verde-bosque/85 leading-relaxed">
                EcoSwipe conecta talleres directamente. Cobrarás al comprador según los medios configurados en tu taller (Yape, Plin, Transferencia o Efectivo contra entrega).
              </p>
            </div>
          </div>
        )}

        {/* Barra de navegación de pasos con tap targets de 44px */}
        <div className="mt-8 pt-6 border-t border-menta flex justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(s => s - 1)}
              className="btn-secondary min-h-[44px] px-5"
            >
              Atrás
            </button>
          ) : <div />}
          
          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(s => s + 1)}
              disabled={!canProceed()}
              className="btn-primary min-h-[44px] px-6 disabled:opacity-50"
            >
              Siguiente
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setPreviewModal(true)}
              disabled={!canProceed()}
              className="btn-primary min-h-[44px] px-6 disabled:opacity-50"
            >
              Vista previa y Publicar
            </button>
          )}
        </div>
      </div>

      {/* Modal de Vista previa */}
      <Modal isOpen={previewModal} onClose={() => setPreviewModal(false)} title="Vista previa del lote">
        <div className="space-y-4">
          <p className="text-base text-verde-bosque/85">
            Así verán los demás talleres tu publicación en el mercado:
          </p>
          <div className="bg-white rounded-tarjeta p-4 border border-menta shadow-xs">
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.entrega.delivery && <span className="badge badge-delivery">Delivery</span>}
              {formData.entrega.recojo && <span className="badge badge-recojo">Recojo en taller</span>}
            </div>
            <h3 className="font-fredoka font-semibold text-lg text-verde-bosque uppercase">
              {formData.tela} - {formData.color}
            </h3>
            <p className="text-sm text-gris-calido mt-0.5">{formData.composicion}</p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-fredoka font-bold text-verde-bosque">
                S/{(parseFloat(formData.precioKg) || 0).toFixed(2)}
              </span>
              <span className="text-sm font-semibold text-gris-calido">por kg</span>
            </div>
            <p className="text-sm text-verde-bosque font-normal mt-1">Peso total: {formData.pesoKg} kg</p>
            {formData.metroDisponible && (
              <p className="text-sm text-verde-bosque mt-2 font-semibold bg-menta/50 p-2 rounded-boton border border-verde-hoja/20">
                También por metro a S/{(parseFloat(formData.precioMetro) || 0).toFixed(2)} / m
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => { setPreviewModal(false); setSuccessModal(true) }}
            className="btn-primary w-full min-h-[44px] mt-4"
          >
            Confirmar y Publicar
          </button>
        </div>
      </Modal>

      {/* Modal de Éxito con Swipee y microcopy oficial del Brandbook */}
      <Modal isOpen={successModal} onClose={() => setSuccessModal(false)} title="¡Lote publicado!">
        <div className="text-center py-4 space-y-4">
          <Swipee pose="celebrando" size="md" priority className="mx-auto block" alt="" />
          <h3 className="text-xl font-fredoka font-semibold text-verde-bosque">
            ¡Listo! Tu retazo ya está publicado.
          </h3>
          <p className="text-base font-sans font-normal text-verde-bosque/85 max-w-sm mx-auto leading-relaxed">
            Los confeccionistas ya pueden encontrar tu lote en el mercado y contactarte directamente.
          </p>
          <div className="pt-3 flex flex-col sm:flex-row gap-3">
            <Link to="/mercado" className="btn-secondary flex-1 min-h-[44px] flex items-center justify-center">
              Ver mercado
            </Link>
            <button
              type="button"
              onClick={() => {
                setSuccessModal(false)
                setStep(1)
                setFormData({
                  ...formData,
                  composicion: '',
                  color: '',
                  pesoKg: '',
                  tamanoMinPieza: '',
                  precioKg: '',
                  metroDisponible: false,
                  anchoM: '',
                  largoM: '',
                  precioMetro: ''
                })
              }}
              className="btn-primary flex-1 min-h-[44px]"
            >
              Publicar otro
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
