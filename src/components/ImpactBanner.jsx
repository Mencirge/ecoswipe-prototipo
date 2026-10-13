export default function ImpactBanner({ co2 = 1420.5, agua = 98500, kg = 350, compact = false }) {
  const items = [
    { label: 'CO₂ Evitado', value: co2, unit: 'kg', color: 'text-brand-600', bg: 'bg-brand-50' },
    { label: 'Agua ahorrada', value: agua, unit: 'L', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Desviado', value: kg, unit: 'kg', color: 'text-success', bg: 'bg-success/10' },
  ]

  return (
    <div className={`flex ${compact ? 'gap-2' : 'gap-3 overflow-x-auto pb-2 scrollbar-none'}`}>
      {items.map((it, i) => (
        <div key={i} className={`flex-1 min-w-[100px] p-3 rounded-2xl ${it.bg} border border-white/50 shadow-sm`}>
          <span className="text-[10px] md:text-xs font-semibold text-neutral-600 uppercase tracking-wider block mb-1">
            {it.label}
          </span>
          <div className="flex items-baseline gap-1">
            <span className={`${it.color} ${compact ? 'text-lg' : 'text-xl md:text-2xl'} font-bold`}>
              {it.value.toLocaleString?.() || it.value}
            </span>
            <span className={`text-xs font-medium ${it.color} opacity-80`}>{it.unit}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

