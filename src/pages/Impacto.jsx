import { useState } from 'react'
import ImpactBanner from '../components/ImpactBanner'
import { formatNumero, telaLabel } from '../utils/formato'
import tiendas from '../data/tiendas.json'
import {
  impactoDe, impactoUsuario, movimientosUsuario, impactoComunidad, impactoTienda,
  nivelDe, FACTORES_EFECTIVOS, REDUCCION, factorDe, kgPorMetro,
} from '../utils/impacto'
import lotes from '../data/lotes.json'

// Ejemplos de la metodología tomados de los propios datos
const EJEMPLO = movimientosUsuario[0]
const LOTE_METRO = lotes.find(l => l.metroDisponible && l.largoM)

export default function Impacto() {
  const [tab, setTab] = useState('comunidad')

  // Todo sale de los movimientos del taller y de los mismos factores por tela
  const userImpact = impactoUsuario
  const nivel = nivelDe(userImpact.kg)

  /* Logros sin emojis: iconografía SVG consistente con el sistema de diseño (trazo 2px, puntas redondeadas) */
  const logros = [
    {
      id: 1,
      titulo: 'Primer intercambio',
      desc: 'Compraste o entregaste tu primer lote textil',
      completado: movimientosUsuario.length > 0,
      tipo: 'leaf'
    },
    {
      id: 2,
      titulo: 'Ahorro de agua',
      desc: `Preservaste ${formatNumero(100000)} litros de agua`,
      completado: userImpact.agua >= 100000,
      tipo: 'water'
    },
    {
      id: 3,
      titulo: 'Taller circular',
      desc: 'Reincorpora 100 kg de retazos a la confección',
      completado: userImpact.kg >= 100,
      meta: 100,
      tipo: 'recycle'
    },
  ]

  const historial = movimientosUsuario.slice(0, 3).map(m => ({ ...m, co2: impactoDe(m.kg, m.tela).co2 }))

  // Ranking por kg rescatados: los talleres de la comunidad más el taller del usuario
  const ranking = [
    ...tiendas.map(t => ({ nombre: t.nombre, avatar: t.avatar, kg: impactoTienda(t).kg })),
    { nombre: 'Tu taller', avatar: 'YO', kg: userImpact.kg, isUser: true },
  ]
    .sort((a, b) => b.kg - a.kg)
    .map((r, i) => ({ ...r, pos: i + 1 }))

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
              <div className="flex items-start sm:items-center justify-between gap-4">
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
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-verde-bosque text-crema flex items-center justify-center font-fredoka text-2xl font-bold border-2 border-verde-hoja/40 shadow-xs" aria-hidden="true">
                    {nivel.nivel}
                  </div>
                  <span className="text-sm font-semibold text-verde-bosque mt-1">Nivel {nivel.nivel}</span>
                </div>
              </div>

              {/* Barra de progreso hacia el siguiente nivel (un nivel cada 50 kg rescatados) */}
              <div className="mt-5 flex flex-wrap gap-x-4 items-baseline justify-between text-sm font-semibold text-verde-bosque">
                <span>{formatNumero(userImpact.kg)} de {formatNumero(nivel.hasta)} kg rescatados</span>
                <span className="text-verde-bosque/75">Faltan {formatNumero(nivel.faltan)} kg para el nivel {nivel.nivel + 1}</span>
              </div>
              <div
                className="mt-2 bg-menta/50 rounded-full h-2.5 overflow-hidden border border-verde-hoja/20"
                role="progressbar"
                aria-valuemin={nivel.desde}
                aria-valuemax={nivel.hasta}
                aria-valuenow={userImpact.kg}
                aria-label={`Progreso al nivel ${nivel.nivel + 1}`}
              >
                <div
                  className="bg-verde-hoja h-full rounded-full transition-all duration-700"
                  style={{ width: `${nivel.progreso * 100}%` }}
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
                        : 'bg-white border-dashed border-terracota/50'
                    }`}
                  >
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${
                        l.completado
                          ? 'bg-menta text-verde-bosque'
                          : 'bg-terracota/10 text-terracota'
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
                      <h4 className="text-sm font-semibold text-verde-bosque">
                        {l.titulo}
                      </h4>
                      <p className="text-base text-verde-bosque/75 mt-0.5">
                        {l.desc}
                      </p>
                      {!l.completado && l.meta && (
                        <div className="mt-2">
                          <div className="flex justify-between text-sm font-semibold text-verde-bosque">
                            <span>En progreso</span>
                            <span>{formatNumero(userImpact.kg)} / {formatNumero(l.meta)} kg</span>
                          </div>
                          <div className="mt-1 bg-menta/60 rounded-full h-2 overflow-hidden">
                            <div className="bg-terracota h-full rounded-full" style={{ width: `${Math.min(userImpact.kg / l.meta, 1) * 100}%` }} />
                          </div>
                        </div>
                      )}
                    </div>
                    {l.completado && (
                      <span className="text-sm font-semibold text-verde-hoja flex-shrink-0">Logrado</span>
                    )}
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
                        {h.fecha} · {formatNumero(h.kg)} kg de {telaLabel(h.tela).toLowerCase()}
                      </p>
                    </div>
                    <div className="bg-menta/50 border border-verde-hoja/20 px-3 py-1 rounded-full text-sm font-semibold text-verde-bosque whitespace-nowrap">
                      +{formatNumero(h.co2)} kg CO₂
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
              En conjunto, los talleres de la comunidad han rescatado {formatNumero(impactoComunidad.kg)} kg de retazos y evitado unas {formatNumero(impactoComunidad.co2 / 1000)} toneladas de CO₂ en Gamarra.
            </p>
          </div>

          {/* Tabla de clasificación */}
          <div className="bg-white rounded-tarjeta border border-menta shadow-sm overflow-hidden">
            <div className="bg-crema px-6 py-3 border-b border-menta flex text-sm font-semibold text-verde-bosque/75 uppercase tracking-wider">
              <div className="w-12 text-center">#</div>
              <div className="flex-1">Taller</div>
              <div className="text-right">Kg rescatados</div>
            </div>
            <div>
              {ranking.map(r => (
                <div
                  key={r.nombre}
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
                    {formatNumero(r.kg)} kg
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Metodología: un solo factor por tela para todo el prototipo */}
      <details className="bg-white rounded-tarjeta border border-menta p-5 shadow-xs">
        <summary className="cursor-pointer text-lg font-fredoka font-semibold text-verde-bosque min-h-[44px] flex items-center">
          ¿Cómo lo calculamos?
        </summary>
        <div className="mt-3 space-y-4 text-base text-verde-bosque/85">
          <p>
            <strong className="text-verde-bosque">Impacto evitado = kg del lote × huella de fabricar esa tela nueva × {formatNumero(REDUCCION * 100, 0)}%.</strong>{' '}
            Suponemos que reutilizar un retazo evita el {formatNumero(REDUCCION * 100, 0)}% del impacto de fabricar tela nueva.
            Se suma solo cuando taller y comprador confirman la entrega. Todas las cifras de EcoSwipe usan esta misma tabla.
          </p>
          <p className="bg-menta/30 rounded-boton px-3 py-2 text-sm">
            <strong className="text-verde-bosque">Ejemplo:</strong> {formatNumero(EJEMPLO.kg)} kg de {telaLabel(EJEMPLO.tela).toLowerCase()} ×{' '}
            {formatNumero(factorDe(EJEMPLO.tela).co2PorKg)} kg CO₂/kg × {formatNumero(REDUCCION * 100, 0)}% ={' '}
            <strong className="text-verde-bosque">{formatNumero(impactoDe(EJEMPLO.kg, EJEMPLO.tela).co2)} kg de CO₂ evitados</strong>.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-verde-bosque border-b border-menta align-bottom">
                  <th className="py-2 pr-4 font-semibold">Tela</th>
                  <th className="py-2 pr-4 font-semibold text-right">Huella tela nueva<br /><span className="font-normal">kg CO₂ por kg</span></th>
                  <th className="py-2 pr-4 font-semibold text-right">Evitado (× {formatNumero(REDUCCION * 100, 0)}%)<br /><span className="font-normal">kg CO₂ por kg</span></th>
                  <th className="py-2 pr-4 font-semibold text-right">Agua tela nueva<br /><span className="font-normal">L por kg</span></th>
                  <th className="py-2 font-semibold text-right">Evitada (× {formatNumero(REDUCCION * 100, 0)}%)<br /><span className="font-normal">L por kg</span></th>
                </tr>
              </thead>
              <tbody>
                {FACTORES_EFECTIVOS.slice().sort((a, b) => b.co2 - a.co2).map(f => (
                  <tr key={f.tela} className="border-b border-menta/50 last:border-0">
                    <td className="py-2 pr-4">{telaLabel(f.tela)}</td>
                    <td className="py-2 pr-4 text-right">{formatNumero(f.co2Base)}</td>
                    <td className="py-2 pr-4 text-right font-semibold text-verde-bosque">{formatNumero(f.co2)}</td>
                    <td className="py-2 pr-4 text-right">{formatNumero(f.aguaBase, 0)}</td>
                    <td className="py-2 text-right font-semibold text-verde-bosque">{formatNumero(f.agua, 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm">
            <strong className="text-verde-bosque">Lotes por metro:</strong> los factores van por kg, así que usamos el peso que el taller declara
            para el lote. Si se vende solo una parte, convertimos metros a kg con el peso por metro de ese mismo lote
            {LOTE_METRO && (
              <> (por ejemplo, {formatNumero(LOTE_METRO.pesoKg)} kg en {formatNumero(LOTE_METRO.largoM)} m = {formatNumero(kgPorMetro(LOTE_METRO), 2)} kg por metro)</>
            )}.
          </p>
          <p className="text-sm">
            <strong className="text-verde-bosque">Fuentes y criterio:</strong> factores referenciales del equipo EcoSwipe, elegidos a propósito por
            debajo de la literatura. Como referencia, RREUSE estima unos 15 kg de CO₂ y casi {formatNumero(10000)} L de agua ahorrados por cada kg de ropa
            reutilizada, y Carbonfact sitúa la huella del algodón virgen en {formatNumero(29.1)} kg CO₂e por kg. Pendiente de validar con un especialista en
            análisis de ciclo de vida (ACV).
          </p>
        </div>
      </details>
    </div>
  )
}
