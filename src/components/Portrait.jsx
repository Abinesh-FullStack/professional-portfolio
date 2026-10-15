import { forwardRef } from 'react'
import { PHOTOS } from '../data/photos'
import { ScrollTrigger } from '../lib/gsap'

/**
 * Photo 1 — the transparent cut-out (816 × 1224, 2:3, never cropped or stretched).
 * A warm spotlight + arch sits behind it and a soft rim light around it, so the dark
 * suit reads clearly on the dark theme without darkening the photo itself.
 *
 * Layers (outer → inner) so different animations never fight over one transform:
 *   .portrait            → scroll choreography (x / y / scale)
 *   .portrait__float     → cursor parallax + bottom fade mask
 *   .portrait__arch/img  → entrance (mask reveal)
 */
const Portrait = forwardRef(function Portrait({ className = '', decorative = false }, ref) {
  const p = PHOTOS.photo1
  return (
    <figure ref={ref} className={`portrait ${className}`} aria-hidden={decorative || undefined}>
      <div className="portrait__float">
        <div className="portrait__arch js-intro-arch">
          <span className="portrait__spot" />
          <span className="portrait__ring portrait__ring--1" />
          <span className="portrait__ring portrait__ring--2" />
        </div>
        <picture>
          <source srcSet={p.webp} sizes="(min-width: 1024px) 480px, 80vw" type="image/webp" />
          <img
            className="portrait__img js-intro-img"
            src={p.fallback}
            width={p.w}
            height={p.h}
            alt={decorative ? '' : p.alt}
            loading="eager"
            decoding="async"
            fetchpriority="high"
            onLoad={() => ScrollTrigger.refresh()}
          />
        </picture>
      </div>
    </figure>
  )
})

export default Portrait
