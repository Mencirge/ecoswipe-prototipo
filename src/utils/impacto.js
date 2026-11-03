// Única fuente de cálculo de impacto: todas las pantallas usan estos factores.
// Impacto evitado = kg × factor del material × reducción (70%).
import impactoConfig from '../data/impactoConfig.json'
import tiendas from '../data/tiendas.json'

export const REDUCCION = impactoConfig.reduccion

export function factorDe(tela) {
  return impactoConfig.factores[tela] || impactoConfig.factores.mezcla
}

export function impactoDe(kg, tela) {
  const f = factorDe(tela)
  return {
    kg,
    co2: kg * f.co2PorKg * REDUCCION,
    agua: kg * f.aguaPorKg * REDUCCION,
  }
}

export function sumarImpacto(items) {
  return items.reduce(
    (acc, it) => {
      const i = impactoDe(it.kg, it.tela)
      return { kg: acc.kg + i.kg, co2: acc.co2 + i.co2, agua: acc.agua + i.agua }
    },
    { kg: 0, co2: 0, agua: 0 }
  )
}

// Para la metodología: huella de fabricar tela nueva (base) y lo evitado al reutilizar (base × reducción)
export const FACTORES_EFECTIVOS = Object.entries(impactoConfig.factores).map(([tela, f]) => ({
  tela,
  descripcion: f.descripcion,
  co2Base: f.co2PorKg,
  aguaBase: f.aguaPorKg,
  co2: f.co2PorKg * REDUCCION,
  agua: f.aguaPorKg * REDUCCION,
}))

// Lotes por metro: los factores van por kg, así que se convierte con el peso por metro del propio lote
export function kgPorMetro(lote) {
  return lote.largoM ? lote.pesoKg / lote.largoM : null
}

export function impactoTienda(tienda) {
  return impactoDe(tienda.kgRescatados, tienda.telaPrincipal)
}

// Impacto acumulado de la comunidad = suma de lo rescatado por cada taller
export const impactoComunidad = sumarImpacto(
  tiendas.map(t => ({ kg: t.kgRescatados, tela: t.telaPrincipal }))
)

// Movimientos del taller del usuario (demo). Sus totales salen de aquí, no de cifras fijas.
export const movimientosUsuario = [
  { id: 1, fecha: '04 Oct 2026', desc: 'Venta: Denim azul', kg: 4.2, tela: 'denim' },
  { id: 2, fecha: '28 Sep 2026', desc: 'Compra: Retazos de algodón', kg: 3.5, tela: 'algodon' },
  { id: 3, fecha: '15 Sep 2026', desc: 'Venta: Jersey gris', kg: 2.8, tela: 'jersey' },
  { id: 4, fecha: '02 Sep 2026', desc: 'Venta: Mezcla algodón-poliéster', kg: 12.5, tela: 'mezcla' },
  { id: 5, fecha: '20 Ago 2026', desc: 'Venta: Algodón crudo', kg: 18, tela: 'algodon' },
  { id: 6, fecha: '05 Ago 2026', desc: 'Venta: Franela estampada', kg: 14, tela: 'franela' },
  { id: 7, fecha: '22 Jul 2026', desc: 'Venta: Denim negro', kg: 20, tela: 'denim' },
  { id: 8, fecha: '10 Jul 2026', desc: 'Venta: Lote mixto', kg: 20, tela: 'mezcla' },
]

export const impactoUsuario = sumarImpacto(movimientosUsuario)

// Niveles por kg rescatados: un nivel cada 50 kg
export const KG_POR_NIVEL = 50
export function nivelDe(kg) {
  const nivel = Math.floor(kg / KG_POR_NIVEL) + 1
  const desde = (nivel - 1) * KG_POR_NIVEL
  const hasta = nivel * KG_POR_NIVEL
  return { nivel, desde, hasta, faltan: hasta - kg, progreso: (kg - desde) / KG_POR_NIVEL }
}
