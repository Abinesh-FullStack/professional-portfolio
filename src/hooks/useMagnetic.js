import { useEffect } from 'react'
import { gsap } from '../lib/gsap'

/**
 * Subtle magnetic pull for major CTAs. Desktop fine pointers only, never under
 * reduced motion. Only reacts while the pointer is near — no idle animation.
 */
export function useMagnetic(ref, { strength = 0.28, radius = 70 } = {}) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ok = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches
    if (!ok) return

    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' })
    let active = false

    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const within =
        Math.abs(dx) < r.width / 2 + radius && Math.abs(dy) < r.height / 2 + radius
      if (within) {
        active = true
        xTo(dx * strength)
        yTo(dy * strength)
      } else if (active) {
        active = false
        xTo(0)
        yTo(0)
      }
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      gsap.set(el, { x: 0, y: 0 })
    }
  }, [ref, strength, radius])
}
