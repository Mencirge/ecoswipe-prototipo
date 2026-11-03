// Formato único de números y textos del prototipo (convención peruana).
// Para cambiar a coma decimal (1.420,5) basta con usar 'es-ES' aquí.
const LOCALE = 'es-PE'

const cache = new Map()
function formatter(min, max) {
  const key = `${min}-${max}`
  if (!cache.has(key)) {
    cache.set(key, new Intl.NumberFormat(LOCALE, {
      minimumFractionDigits: min,
      maximumFractionDigits: max,
      useGrouping: 'always',
    }))
  }
  return cache.get(key)
}

// 1420.5 -> "1,420.5" · 3.5 -> "3.5" · 98500 -> "98,500"
export function formatNumero(valor, maxDecimales = 1) {
  const n = Number(valor)
  if (!Number.isFinite(n)) return String(valor ?? '')
  // Limpia errores de punto flotante (5.5 × 0.7 = 3.8499…) antes de redondear
  return formatter(0, maxDecimales).format(Number(n.toPrecision(12)))
}

// 14 -> "S/ 14.00"
export function formatSoles(valor) {
  const n = Number(valor)
  if (!Number.isFinite(n)) return 'S/ 0.00'
  return `S/ ${formatter(2, 2).format(n)}`
}

// Claves internas de tela (sin tildes, se usan para filtrar y para impactoConfig)
// y su nombre visible.
export const TELA_LABEL = {
  algodon: 'Algodón',
  poliester: 'Poliéster',
  denim: 'Denim',
  jersey: 'Jersey',
  mezcla: 'Mezcla',
  licra: 'Licra',
  franela: 'Franela',
}

export const TELA_KEYS = Object.keys(TELA_LABEL)

export function telaLabel(key) {
  return TELA_LABEL[key] || (key ? key.charAt(0).toUpperCase() + key.slice(1) : '')
}

// Quita tildes y pasa a minúsculas para comparar búsquedas ("Algodón" == "algodon").
export function normalizar(texto) {
  return String(texto ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

// Precio y cantidad principales del lote: en metros si se vende por metro, si no en kg.
export function precioPrincipal(lote) {
  if (lote.metroDisponible && lote.precioMetro) {
    return { precio: lote.precioMetro, unidad: 'metro', unidadCorta: 'm' }
  }
  return { precio: lote.precioKg, unidad: 'kg', unidadCorta: 'kg' }
}

export function cantidadPrincipal(lote) {
  if (lote.metroDisponible && lote.largoM) {
    return `${formatNumero(lote.largoM)} m`
  }
  return `${formatNumero(lote.pesoKg)} kg`
}
