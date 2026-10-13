export default function Logo({ size = 32, className = '' }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 120 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#2D6A4F"/>
      <path d="M16 6c-2 0-6 4-6 10s4 10 6 10c1 0 2-1 3-3-1 1-2 1.5-3 1.5-3.5 0-4.5-4-4.5-8.5S13.5 7.5 16 7.5c1.5 0 3 1.5 4 4 .5-1.5.5-3 0-4C19 6.5 17.5 6 16 6z" fill="#52B788"/>
      <path d="M18 10c-1 0-3 2-3 6s2 6 3 6 3-2 3-6-2-6-3-6z" fill="#A5D6A7" opacity=".7"/>
      <text x="38" y="22" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="18" fill="#2D6A4F">eco</text>
      <text x="62" y="22" fontFamily="Inter, sans-serif" fontWeight="800" fontSize="18" fill="#52B788">swipe</text>
    </svg>
  )
}

