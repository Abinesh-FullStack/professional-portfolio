import { useEffect, useRef } from 'react'
import { marqueeItems } from '../data/skills'

/**
 * CSS-driven technology marquee.
 * Pauses on hover/focus and while off-screen; static under reduced motion (see CSS).
 */
export default function Marquee() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => el.classList.toggle('is-offscreen', !e.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const row = (hidden) => (
    <ul className="marquee__row" aria-hidden={hidden || undefined}>
      {marqueeItems.map((t) => (
        <li key={t}>
          <span>{t}</span>
          <span className="marquee__sep" aria-hidden="true">✦</span>
        </li>
      ))}
    </ul>
  )

  return (
    <div ref={ref} className="marquee" role="region" aria-label="Technologies I work with">
      <div className="marquee__track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}
