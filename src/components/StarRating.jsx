export default function StarRating({ rating, size = 16 }) {
  const full = Math.floor(rating)
  const hasHalf = rating % 1 >= 0.5
  const stars = []

  for (let i = 0; i < 5; i++) {
    if (i < full) {
      stars.push(
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="#E4793B" stroke="#12372A" strokeWidth="1.2" strokeLinejoin="round">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      )
    } else if (i === full && hasHalf) {
      stars.push(
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="url(#halfGrad)" stroke="#12372A" strokeWidth="1.2" strokeLinejoin="round">
          <defs>
            <linearGradient id="halfGrad">
              <stop offset="50%" stopColor="#E4793B" />
              <stop offset="50%" stopColor="rgba(107, 111, 106, 0.25)" />
            </linearGradient>
          </defs>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      )
    } else {
      stars.push(
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="rgba(107, 111, 106, 0.15)" stroke="#6B6F6A" strokeWidth="1.2" strokeLinejoin="round">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      )
    }
  }

  const numText = typeof rating === 'number' ? rating.toFixed(1) : rating

  return (
    <span className="inline-flex items-center gap-1 md:gap-1.5" aria-label={`${rating} de 5 estrellas`}>
      {/* Móvil: 1 sola estrella + número visible */}
      <span className="inline-flex md:hidden items-center gap-1">
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#E4793B" stroke="#12372A" strokeWidth="1.2" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        <span className="text-[13px] font-sans font-semibold text-verde-bosque">
          {numText}
        </span>
      </span>

      {/* Desktop (md+): 5 estrellas completas idéntico a baseline */}
      <span className="hidden md:inline-flex items-center gap-0.5">{stars}</span>
      <span className="hidden md:inline text-sm font-sans font-semibold text-verde-bosque">
        {numText}
      </span>
    </span>
  )
}
