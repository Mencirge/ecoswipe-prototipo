export default function StarRating({ rating, size = 16 }) {
  const full = Math.floor(rating)
  const hasHalf = rating % 1 >= 0.5
  const stars = []

  for (let i = 0; i < 5; i++) {
    if (i < full) {
      stars.push(
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="#F59E0B">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      )
    } else if (i === full && hasHalf) {
      stars.push(
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="url(#halfGrad)">
          <defs>
            <linearGradient id="halfGrad">
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#E5E7EB" stopOpacity="1" />
            </linearGradient>
          </defs>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      )
    } else {
      stars.push(
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="#E5E7EB">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      )
    }
  }

  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} de 5 estrellas`}>
      {stars}
    </span>
  )
}

