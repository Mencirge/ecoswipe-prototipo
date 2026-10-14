import principalWebp from '../assets/mascota.webp'
import principalPng from '../assets/mascota.png'
import cartaWebp from '../assets/mascota-carta.webp'
import cartaPng from '../assets/mascota-carta.png'
import anotandoWebp from '../assets/mascota-anotando.webp'
import anotandoPng from '../assets/mascota-anotando.png'
import celebrandoWebp from '../assets/mascota-celebrando.webp'
import celebrandoPng from '../assets/mascota-celebrando.png'
import durmiendoWebp from '../assets/mascota-durmiendo.webp'
import durmiendoPng from '../assets/mascota-durmiendo.png'
import molestoWebp from '../assets/mascota-molesto.webp'
import molestoPng from '../assets/mascota-molesto.png'
import pensandoWebp from '../assets/mascota-pensando.webp'
import pensandoPng from '../assets/mascota-pensando.png'
import tristeWebp from '../assets/mascota-triste.webp'
import tristePng from '../assets/mascota-triste.png'

const POSES = {
  principal: {
    webp: principalWebp,
    png: principalPng,
    baseWidth: 120,
    baseHeight: 147,
  },
  carta: {
    webp: cartaWebp,
    png: cartaPng,
    baseWidth: 106,
    baseHeight: 154,
  },
  anotando: {
    webp: anotandoWebp,
    png: anotandoPng,
    baseWidth: 104,
    baseHeight: 147,
  },
  celebrando: {
    webp: celebrandoWebp,
    png: celebrandoPng,
    baseWidth: 151,
    baseHeight: 166,
  },
  durmiendo: {
    webp: durmiendoWebp,
    png: durmiendoPng,
    baseWidth: 130,
    baseHeight: 147,
  },
  molesto: {
    webp: molestoWebp,
    png: molestoPng,
    baseWidth: 88,
    baseHeight: 148,
  },
  pensando: {
    webp: pensandoWebp,
    png: pensandoPng,
    baseWidth: 132,
    baseHeight: 154,
  },
  triste: {
    webp: tristeWebp,
    png: tristePng,
    baseWidth: 105,
    baseHeight: 147,
  },
}

const SCALE_FACTORS = {
  sm: 0.5,
  md: 1.0,
  lg: 1.15,
  hero: 1.0,
}

export default function Swipee({
  pose = 'principal',
  size = 'md',
  alt = '',
  className = '',
  priority = false,
}) {
  const poseData = POSES[pose] || POSES.principal
  const factor = typeof size === 'number'
    ? size / poseData.baseHeight
    : (SCALE_FACTORS[size] || 1.0)

  const width = Math.round(poseData.baseWidth * factor)
  const height = Math.round(poseData.baseHeight * factor)
  const altText = alt === '' ? '' : (alt || 'Swipee, la hojita de EcoSwipe')
  const isHero = size === 'hero'

  return (
    <picture className={`inline-block flex-shrink-0 transition-opacity duration-200 motion-reduce:transition-none ${className}`}>
      <source srcSet={poseData.webp} type="image/webp" />
      <img
        src={poseData.png}
        alt={altText}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        className={`object-contain block mx-auto select-none pointer-events-none ${
          isHero ? 'w-[88px] h-[108px] lg:w-[120px] lg:h-[147px]' : ''
        }`}
        style={isHero ? undefined : { width: `${width}px`, height: `${height}px` }}
      />
    </picture>
  )
}
