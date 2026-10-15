import { PHOTOS } from '../data/photos'

/**
 * A framed photo with an identity label and corner ticks.
 * `variant` picks the photo; `className` positions it (stage layer or inline).
 */
export default function PhotoFrame({ variant, className = '', sizes = '(min-width: 1024px) 440px, 90vw', eager = false, ...rest }) {
  const p = PHOTOS[variant]
  return (
    <figure className={`photo-frame photo-frame--${variant} ${className}`} style={{ '--ratio': `${p.w} / ${p.h}` }} {...rest}>
      <div className="photo-frame__media">
        <picture>
          <source type="image/webp" srcSet={p.webp} sizes={sizes} />
          <img
            className="photo-frame__img"
            src={p.fallback}
            width={p.w}
            height={p.h}
            alt={p.alt}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
          />
        </picture>
      </div>
      <span className="photo-frame__tick photo-frame__tick--tl" aria-hidden="true" />
      <span className="photo-frame__tick photo-frame__tick--br" aria-hidden="true" />
      <figcaption className="photo-frame__cap mono">
        <span className="photo-frame__idx">{p.index}</span>
        <span>{p.label}</span>
      </figcaption>
    </figure>
  )
}
