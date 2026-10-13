import { useState } from 'react'
import ImpactBanner from '../components/ImpactBanner'

export default function Impacto() {
  const [tab, setTab] = useState('comunidad')

  const userImpact = { co2: 45, agua: 3200, kg: 95, nivel: 2, xp: 450, proxNivel: 500 }
  const logros = [
    { id: 1, titulo: 'Primer rescate', desc: 'Compraste o vendiste tu primer lote', completado: true, icon: '🌱' },
    { id: 2, titulo: 'Guardián del agua', desc: 'Ahorraste tus primeros 1,000L de agua', completado: true, icon: '💧' },
    { id: 3, titulo: 'Campeón circular', desc: 'Desviaste 100kg de residuos textiles', completado: false, icon: '♻️' },
  ]

  const historial = [
    { id: 1, fecha: '04 Oct 2026', desc: 'Venta: Denim azul', co2: '+4.2', color: 'text-success' },
    { id: 2, fecha: '28 Sep 2026', desc: 'Compra: Retazos algodón', co2: '+1.8', color: 'text-success' },
    { id: 3, fecha: '15 Sep 2026', desc: 'Venta: Jersey gris', co2: '+3.5', color: 'text-success' },
  ]

  const ranking = [
    { pos: 1, nombre: 'Retazos del Sur', puntos: 2540, avatar: 'RS' },
    { pos: 2, nombre: 'Textiles Quispe', puntos: 1820, avatar: 'TQ' },
    { pos: 3, nombre: 'Tú', puntos: 450, avatar: 'YO', isUser: true },
    { pos: 4, nombre: 'Hilados y Cortes M.', puntos: 310, avatar: 'HM' },
  ]

  return (
    <div className="page-enter max-w-4xl mx-auto px-4 md:px-8 py-6">
      <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-6">Tu Impacto</h1>

      <div className="flex gap-4 mb-6 border-b border-neutral-200">
        <button onClick={() => setTab('comunidad')} className={`pb-3 text-sm font-semibold transition-colors relative ${tab === 'comunidad' ? 'text-brand-600' : 'text-neutral-500 hover:text-neutral-800'}`}>
          Mi Impacto
          {tab === 'comunidad' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-t-full" />}
        </button>
        <button onClick={() => setTab('ranking')} className={`pb-3 text-sm font-semibold transition-colors relative ${tab === 'ranking' ? 'text-brand-600' : 'text-neutral-500 hover:text-neutral-800'}`}>
          Ranking Global
          {tab === 'ranking' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-t-full" />}
        </button>
      </div>

      {tab === 'comunidad' && (
        <div className="space-y-6 page-enter">
          {/* User Stats Card */}
          <div className="card overflow-hidden">
            <div className="bg-neutral-800 text-white p-6 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <h2 className="text-xl font-bold">Nivel {userImpact.nivel}: Reciclador Novato</h2>
                  <p className="text-sm text-neutral-300 mt-1">Faltan {userImpact.proxNivel - userImpact.xp} XP para subir de nivel</p>
                </div>
                <div className="w-16 h-16 rounded-full bg-brand-500 flex items-center justify-center text-2xl font-bold shadow-lg">
                  {userImpact.nivel}
                </div>
              </div>
              <div className="mt-6 bg-white/10 rounded-full h-2 overflow-hidden">
                <div className="bg-brand-400 h-full rounded-full transition-all duration-1000" style={{ width: `${(userImpact.xp / userImpact.proxNivel) * 100}%` }}></div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4">Lo que has logrado</h3>
              <ImpactBanner co2={userImpact.co2} agua={userImpact.agua} kg={userImpact.kg} compact />
            </div>
          </div>

          <div className="md:flex gap-6">
            {/* Achievements */}
            <div className="md:w-1/2">
              <h3 className="font-bold text-neutral-800 mb-4">Tus Logros</h3>
              <div className="space-y-3">
                {logros.map(l => (
                  <div key={l.id} className={`p-4 rounded-xl border flex gap-4 transition-colors ${l.completado ? 'bg-white border-neutral-200' : 'bg-neutral-50 border-transparent opacity-60'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0 ${l.completado ? 'bg-brand-100 text-brand-600' : 'bg-neutral-200 text-neutral-400'}`}>
                      {l.icon}
                    </div>
                    <div>
                      <h4 className={`font-semibold ${l.completado ? 'text-neutral-800' : 'text-neutral-500'}`}>{l.titulo}</h4>
                      <p className="text-xs text-neutral-500 mt-0.5">{l.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* History */}
            <div className="md:w-1/2 mt-6 md:mt-0">
              <h3 className="font-bold text-neutral-800 mb-4">Historial de Impacto</h3>
              <div className="card p-4">
                <div className="space-y-4">
                  {historial.map((h, i) => (
                    <div key={h.id} className={`flex justify-between items-center ${i !== historial.length - 1 ? 'border-b border-neutral-100 pb-4' : ''}`}>
                      <div>
                        <p className="text-sm font-medium text-neutral-800">{h.desc}</p>
                        <p className="text-xs text-neutral-400 mt-0.5">{h.fecha}</p>
                      </div>
                      <div className={`font-bold ${h.color} bg-success/10 px-2 py-1 rounded text-sm`}>
                        {h.co2} kg CO₂
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'ranking' && (
        <div className="space-y-6 page-enter">
          <div className="card p-6 text-center bg-gradient-to-br from-brand-50 to-white">
            <h2 className="text-xl font-bold text-brand-800 mb-2">Comunidad Eco Swipe</h2>
            <p className="text-sm text-neutral-600 max-w-md mx-auto">Juntos hemos evitado más de 1.4 toneladas de CO₂ en Gamarra.</p>
          </div>

          <div className="card overflow-hidden">
            <div className="bg-neutral-50 px-6 py-3 border-b border-neutral-100 flex text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              <div className="w-12 text-center">#</div>
              <div className="flex-1">Participante</div>
              <div className="text-right">XP / Impacto</div>
            </div>
            <div>
              {ranking.map((r, i) => (
                <div key={i} className={`flex items-center px-6 py-4 border-b border-neutral-50 last:border-0 ${r.isUser ? 'bg-brand-50/50' : 'bg-white'}`}>
                  <div className={`w-12 text-center font-bold ${r.pos <= 3 ? 'text-brand-500 text-lg' : 'text-neutral-400'}`}>
                    {r.pos}
                  </div>
                  <div className="flex-1 flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${r.isUser ? 'bg-brand-500 text-white' : 'bg-neutral-200 text-neutral-600'}`}>
                      {r.avatar}
                    </div>
                    <span className={`font-medium ${r.isUser ? 'text-brand-700' : 'text-neutral-700'}`}>
                      {r.nombre} {r.isUser && '(Tú)'}
                    </span>
                  </div>
                  <div className="text-right font-semibold text-neutral-700">
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

