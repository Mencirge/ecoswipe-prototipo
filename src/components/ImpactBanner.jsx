export default function ImpactBanner({ co2 = 1420.5, agua = 98500, kg = 350, compact = false }) {
  const items = [
    { label: 'CO₂ Evitado', value: co2, unit: 'kg', bg: 'bg-menta/60' },
    { label: 'Agua ahorrada', value: agua, unit: 'L', bg: 'bg-menta/40' },
    { label: 'Retazos rescatados', value: kg, unit: 'kg', bg: 'bg-menta/80' },
  ]

  return (
    <div className={`flex ${compact ? 'gap-2' : 'gap-3 overflow-x-auto pb-2 scrollbar-none'}`}>
      {items.map((it, i) => (
        <div
          key={i}
          className={`flex-1 min-w-[105px] p-3.5 rounded-tarjeta ${it.bg} border border-verde-hoja/20 shadow-xs`}
        >
          <span className="text-[11px] md:text-xs font-sans font-semibold text-verde-bosque/85 uppercase tracking-wider block mb-1">
            {it.label}
          </span>
          <div className="flex items-baseline gap-1.5">
            <span
              className={`font-fredoka font-bold text-verde-bosque ${
                compact ? 'text-lg' : 'text-xl md:text-2xl'
              } border-b-2 border-terracota pb-0.5`}
            >
              {it.value.toLocaleString?.() || it.value}
            </span>
            <span className="text-xs font-semibold text-verde-bosque/80">{it.unit}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
