import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'

/**
 * Desktop-only cursor treatment: a small dot (exact position) and a ring that
 * follows smoothly. The native cursor always stays visible. Nothing animates
 * while the pointer is still — quickTo tweens simply finish.
 */
export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    const ok = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)')
    if (!dot || !ring || !ok.matches) return

    const rx = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' })
    const ry = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' })
    let shown = false
    let lastTarget = null

    const move = (e) => {
      if (e.pointerType && e.pointerType !== 'mouse') return
      if (!shown) {
        gsap.set([dot, ring], { x: e.clientX, y: e.clientY })
        dot.classList.add('is-visible')
        ring.classList.add('is-visible')
        shown = true
      }
      gsap.set(dot, { x: e.clientX, y: e.clientY })
      rx(e.clientX)
      ry(e.clientY)

      if (e.target !== lastTarget) {
        lastTarget = e.target
        const card = e.target.closest?.('[data-cursor="card"]')
        const interactive = e.target.closest?.('a, button, [role="switch"], input, [data-cursor]')
        ring.classList.toggle('is-card', Boolean(card))
        ring.classList.toggle('is-hover', Boolean(interactive) && !card)
        dot.classList.toggle('is-hover', Boolean(interactive))
      }
    }
    const leave = () => {
      dot.classList.remove('is-visible')
      ring.classList.remove('is-visible')
      shown = false
    }
    const down = () => ring.classList.add('is-down')
    const up = () => ring.classList.remove('is-down')

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', down, { passive: true })
    window.addEventListener('pointerup', up, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [])

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  )
}
