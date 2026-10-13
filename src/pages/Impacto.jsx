import { useState } from 'react'
import ImpactBanner from '../components/ImpactBanner'

export default function Impacto() {
  const [tab, setTab] = useState('comunidad')

  const userImpact = { co2: 45, agua: 3200, kg: 95, nivel: 2, xp: 450, proxNivel: 500 }

  /* Logros sin emojis: iconografía SVG consistente con el sistema de diseño (trazo 2px, puntas redondeadas) */
  const logros = [
    {
      id: 1,
      titulo: 'Primer intercambio',
      desc: 'Compraste o entregaste tu primer lote textil',
      completado: true,
      tipo: 'leaf'
    },
    {
      id: 2,
      titulo: 'Ahorro de agua',
      desc: 'Preservaste tus primeros 1,000 litros de agua',
      completado: true,
      tipo: 'water'
    },
    {
      id: 3,
      titulo: 'Taller circular',
      desc: 'Reincorporaste 100 kg de retazos a la confección',
      completado: false,
      tipo: 'recycle'
    },
  ]

  const historial = [
    { id: 1, fecha: '04 Oct 2026', desc: 'Venta: Denim azul', co2: '+4.2', color: 'text-verde-bosque' },
    { id: 2, fecha: '28 Sep 2026', desc: 'Compra: Retazos algodón', co2: '+1.8', color: 'text-verde-bosque' },
    { id: 3, fecha: '15 Sep 2026', desc: 'Venta: Jersey gris', co2: '+3.5', color: 'text-verde-bosque' },
  ]

  const ranking = [
    { pos: 1, nombre: 'Retazos del Sur', puntos: 2540, avatar: 'RS' },
    { pos: 2, nombre: 'Textiles Quispe', puntos: 1820, avatar: 'TQ' },
    { pos: 3, nombre: 'Tu taller', puntos: 450, avatar: 'YO', isUser: true },
    { pos: 4, nombre: 'Hilados y Cortes M.', puntos: 310, avatar: 'HM' },
  ]

  return (
    <div className="page-enter max-w-4xl mx-auto px-4 md:px-8 py-6 space-y-6">
      {/* Encabezado en tono de taller: práctico, directo y sin alarmismo */}
      <div>
        <h1 className="text-2xl md:text-3xl font-fredoka font-semibold text-verde-bosque">
          Balance de impacto del taller
        </h1>
        <p className="text-base text-verde-bosque/80 mt-1">
          Seguimiento de merma textil evitada y recursos preservados en Gamarra.
        </p>
      </div>

      {/* Selector de pestañas */}
      <div className="flex gap-4 border-b border-menta">
        <button
          type="button"
          onClick={() => setTab('comunidad')}
          className={`pb-3 text-sm font-semibold transition-colors relative min-h-[44px] flex items-center ${
            tab === 'comunidad' ? 'text-verde-bosque' : 'text-verde-bosque/60 hover:text-verde-bosque'
          }`}
        >
          Mi impacto acumulado
          {tab === 'comunidad' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-verde-hoja rounded-t-full" />
          )}
        </button>
        <button
          type="button"
          onClick={() => setTab('ranking')}
          className={`pb-3 text-sm font-semibold transition-colors relative min-h-[44px] flex items-center ${
            tab === 'ranking' ? 'text-verde-bosque' : 'text-verde-bosque/60 hover:text-verde-bosque'
          }`}
        >
          Comunidad de talleres
          {tab === 'ranking' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-verde-hoja rounded-t-full" />
          )}
        </button>
      </div>

      {tab === 'comunidad' && (
        <div className="space-y-6 page-enter">
          {/* Tarjeta de Nivel: Crema y Menta artesanal (sin tarjeta oscura ni blur) */}
          <div className="bg-white rounded-tarjeta border border-menta shadow-sm overflow-hidden">
            <div className="bg-crema p-6 border-b-2 border-dashed border-menta/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-sm font-semibold text-verde-bosque uppercase tracking-wider block mb-1">
                    Actividad registrada
                  </span>
                  <h2 className="text-xl md:text-2xl font-fredoka font-semibold text-verde-bosque">
                    Taller activo en EcoSwipe
                  </h2>
                  <p className="text-base font-normal text-verde-bosque/80 mt-1">
                    Cifras estimadas según los retazos registrados y entregados en la plataforma.
                  </p>
                </div>
                <div className="w-16 h-16 rounded-full bg-verde-bosque text-crema flex items-center justify-center font-fredoka text-2xl font-bold border-2 border-verde-hoja/40 shadow-xs flex-shrink-0">
                  {userImpact.nivel}
                </div>
              </div>

              {/* Barra de progreso */}
              <div className="mt-5 bg-menta/50 rounded-full h-2.5 overflow-hidden border border-verde-hoja/20">
                <div
                  className="bg-verde-hoja h-full rounded-full transition-all duration-700"
                  style={{ width: `${(userImpact.xp / userImpact.proxNivel) * 100}%` }}
                />
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-sm font-semibold text-verde-bosque/80 uppercase tracking-wider mb-4">
                Recursos aprovechados en tu taller
              </h3>
              <ImpactBanner co2={userImpact.co2} agua={userImpact.agua} kg={userImpact.kg} compact />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Logros alcanzados con íconos SVG (sin emojis) */}
            <div className="bg-white rounded-tarjeta border border-menta p-5 shadow-xs space-y-4">
              <h3 className="text-lg font-fredoka font-semibold text-verde-bosque border-b border-dashed border-menta pb-2">
                Hitos del taller
              </h3>
              <div className="space-y-3">
                {logros.map(l => (
                  <div
                    key={l.id}
                    className={`p-4 rounded-boton border flex gap-3.5 items-center transition-colors ${
                      l.completado
                        ? 'bg-crema/60 border-verde-hoja/30'
                        : 'bg-neutral-50 border-neutral-200 opacity-60'
                    }`}
                  >
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${
                        l.completado
                          ? 'bg-menta text-verde-bosque'
                          : 'bg-neutral-200 text-neutral-500'
                      }`}
                    >
                      {l.tipo === 'leaf' && (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2C19.5 4.5 19 7 17.9 12.2A7 7 0 0 1 11 20Z" />
                          <path d="M11 20C11 16 13 13 18 10" />
                        </svg>
                      )}
                      {l.tipo === 'water' && (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                        </svg>
                      )}
                      {l.tipo === 'recycle' && (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
                          <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12" />
                          <path d="m14 16 3 3-3 3" />
                          <path d="M8.293 13.596 4.3 9.5l3.993-4.096" />
                          <path d="m20.5 9-3-3 3-3" />
                          <path d="M17.5 6h-6.203a1.83 1.83 0 0 0-1.556.89 1.784 1.784 0 0 0 0 1.775l.726 1.259" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-semibold ${l.completado ? 'text-verde-bosque' : 'text-neutral-500'}`}>
                        {l.titulo}
                      </h4>
                      <p className="text-base text-verde-bosque/75 mt-0.5">
                        {l.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Historial de Movimientos de Merma */}
            <div className="bg-white rounded-tarjeta border border-menta p-5 shadow-xs space-y-4">
              <h3 className="text-lg font-fredoka font-semibold text-verde-bosque border-b border-dashed border-menta pb-2">
                Movimientos recientes
              </h3>
              <div className="space-y-3">
                {historial.map((h, i) => (
                  <div
                    key={h.id}
                    className={`flex items-center justify-between gap-3 ${
                      i !== historial.length - 1 ? 'border-b border-dashed border-menta/60 pb-3' : ''
                    }`}
                  >
                    <div>
                      <p className="text-sm font-semibold text-verde-bosque">
                        {h.desc}
                      </p>
                      <p className="text-sm font-semibold text-verde-bosque/60 mt-0.5">
                        {h.fecha}
                      </p>
                    </div>
                    <div className="bg-menta/50 border border-verde-hoja/20 px-3 py-1 rounded-full text-sm font-semibold text-verde-bosque">
                      {h.co2} kg CO₂
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'ranking' && (
        <div className="space-y-6 page-enter">
          {/* Banner de comunidad: Crema y Verde Bosque */}
          <div className="bg-crema rounded-tarjeta border border-menta p-6 text-center space-y-2">
            <h2 className="text-xl md:text-2xl font-fredoka font-semibold text-verde-bosque">
              Talleres participantes en Gamarra
            </h2>
            <p className="text-base text-verde-bosque/85 max-w-lg mx-auto leading-relaxed">
              En conjunto, los talleres de la comunidad han evitado más de 1.4 toneladas de CO₂ en Gamarra.
            </p>
          </div>

          {/* Tabla de clasificación */}
          <div className="bg-white rounded-tarjeta border border-menta shadow-sm overflow-hidden">
            <div className="bg-crema px-6 py-3 border-b border-menta flex text-sm font-semibold text-verde-bosque/75 uppercase tracking-wider">
              <div className="w-12 text-center">#</div>
              <div className="flex-1">Taller</div>
              <div className="text-right">Puntos de recirculación</div>
            </div>
            <div>
              {ranking.map((r, i) => (
                <div
                  key={i}
                  className={`flex items-center px-6 py-4 border-b border-menta/40 last:border-0 ${
                    r.isUser ? 'bg-menta/20 font-semibold' : 'bg-white'
                  }`}
                >
                  <div className="w-12 text-center font-fredoka font-bold text-lg text-verde-bosque">
                    {r.pos}
                  </div>
                  <div className="flex-1 flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-fredoka font-bold ${
                        r.isUser
                          ? 'bg-verde-bosque text-crema'
                          : 'bg-crema border border-menta text-verde-bosque'
                      }`}
                    >
                      {r.avatar}
                    </div>
                    <span
                      className={`text-sm font-semibold ${
                        r.isUser ? 'text-verde-bosque font-semibold' : 'text-verde-bosque/90'
                      }`}
                    >
                      {r.nombre} {r.isUser && '(Taller propio)'}
                    </span>
                  </div>
                  <div className="text-right stat-figure text-sm font-semibold text-verde-bosque">
                    {r.puntos.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
