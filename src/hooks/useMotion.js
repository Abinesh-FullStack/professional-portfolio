import { useLayoutEffect } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'

/**
 * SITE-WIDE MOTION SYSTEM
 *
 * Content is fully visible in the HTML. Motion only applies when GSAP runs and
 * the visitor allows motion.
 *
 * ROOT-CAUSE FIX (sections 01–04 appearing empty):
 * The previous version hid every element up front and relied on `once: true`
 * `onEnter` callbacks. Those only fire when you scroll DOWN past the start line,
 * so if the triggers were created while the page was already scrolled — a
 * #section link, a restored scroll position, a dev hot-reload, or a fast nav
 * jump — the callback never fired and the content stayed at opacity 0 forever.
 *
 * `watch()` below reveals an element when ANY of these happens:
 *   • it enters from below (onEnter) or from above (onEnterBack)
 *   • the page jumps right past it (onLeave → shown instantly)
 *   • on any refresh the page is already past its start line (onRefresh)
 *   • right after setup, for everything already scrolled past
 * Each element is revealed exactly once and its trigger is then removed.
 *
 *   [data-split]             headings — words rise out of masks
 *   [data-reveal]            default — fade + rise
 *   [data-reveal=fade|rise|left|right|scale|pop|panel|line|clip]
 *   [data-count]             count-up (data-decimals)
 *   .pcard                   staggered card entrance
 */
const FROM = {
  default: { opacity: 0, y: 28 },
  fade: { opacity: 0 },
  rise: { opacity: 0, y: 40 },
  left: { opacity: 0, x: -36 },
  right: { opacity: 0, x: 36 },
  scale: { opacity: 0, scale: 0.94 },
  pop: { opacity: 0, scale: 0 },
  panel: { opacity: 0, y: 24, scale: 0.98 },
  line: { scaleX: 0, transformOrigin: 'left center' },
  clip: { clipPath: 'inset(100% 0% 0% 0%)' },
}
const TO = {
  default: { opacity: 1, x: 0, y: 0, scale: 1, duration: 0.85, ease: 'power3.out' },
  clip: { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'power4.inOut' },
  pop: { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2.2)' },
  line: { scaleX: 1, duration: 0.9, ease: 'power3.inOut' },
}
const FINAL = { opacity: 1, x: 0, y: 0, scale: 1, scaleX: 1, clipPath: 'inset(0% 0% 0% 0%)' }

/**
 * Reveal each element once, robustly. `show(batch, instant)` receives elements
 * grouped per animation frame so they can stagger together.
 */
function watch(els, { start = 'top 90%', show }) {
  const queue = { anim: [], instant: [] }
  const done = []
  let raf = 0
  const flush = () => {
    raf = 0
    if (queue.instant.length) show(queue.instant.splice(0), true)
    if (queue.anim.length) show(queue.anim.splice(0), false)
    // Kill finished triggers here — never inside ScrollTrigger's own callbacks,
    // which would mutate its list mid-iteration and skip neighbouring triggers.
    done.splice(0).forEach((st) => st.kill())
  }
  const enqueue = (el, instant, st) => {
    if (el.__shown) return
    el.__shown = true
    ;(instant ? queue.instant : queue.anim).push(el)
    if (st) done.push(st)
    if (!raf) raf = requestAnimationFrame(flush)
  }

  const triggers = els.map((el) =>
    ScrollTrigger.create({
      trigger: el,
      // clamp(): near the end of the page the line is pulled up to the max scroll,
      // so the last elements on the page can always be reached.
      start: `clamp(${start})`,
      end: 'clamp(bottom top)',
      onEnter: (st) => enqueue(el, false, st),
      onEnterBack: (st) => enqueue(el, false, st),
      onLeave: (st) => enqueue(el, true, st),
      onRefresh: (st) => {
        if (st.progress > 0) enqueue(el, st.progress >= 1, st)
      },
    }),
  )
  // Anything already past its start line when we set up (hash links, restored scroll).
  const check = () =>
    triggers.forEach((st) => {
      const y = st.scroll()
      if (y >= st.start && y > 0) enqueue(st.trigger, y >= st.end, st)
    })
  check()
  // …and once more after the browser settles a hash jump or restores scroll.
  const t1 = setTimeout(check, 400)
  return () => {
    clearTimeout(t1)
    cancelAnimationFrame(raf)
    els.forEach((el) => delete el.__shown)
  }
}

export function useMotion() {
  useLayoutEffect(() => {
    const mm = gsap.matchMedia()

    mm.add(
      { motion: '(prefers-reduced-motion: no-preference)', mobile: '(max-width: 767px)' },
      (ctx) => {
        const { motion, mobile } = ctx.conditions
        if (!motion) return // reduced motion: everything simply stays visible
        const k = mobile ? 0.6 : 1
        const cleanups = []

        // ── Split headings ────────────────────────────────────────────────
        const headings = gsap.utils.toArray('[data-split]')
        headings.forEach((h) => gsap.set(h.querySelectorAll('.rt-word'), { yPercent: 110 }))
        cleanups.push(
          watch(headings, {
            start: 'top 90%',
            show: (batch, instant) =>
              batch.forEach((h, i) => {
                const words = h.querySelectorAll('.rt-word')
                if (instant) gsap.set(words, { yPercent: 0 })
                else gsap.to(words, { yPercent: 0, duration: 0.9, ease: 'power4.out', stagger: 0.05, delay: i * 0.08 })
              }),
          }),
        )

        // ── Reveal patterns ───────────────────────────────────────────────
        const groups = {}
        gsap.utils.toArray('[data-reveal]').forEach((el) => {
          const type = el.dataset.reveal || 'default'
          ;(groups[type] ||= []).push(el)
        })
        Object.entries(groups).forEach(([type, els]) => {
          const from = { ...(FROM[type] || FROM.default) }
          if (from.y) from.y *= k
          if (from.x) from.x *= k
          gsap.set(els, from)
          cleanups.push(
            watch(els, {
              show: (batch, instant) => {
                const clear = type === 'clip' ? 'clipPath' : 'transform,opacity'
                if (instant) gsap.set(batch, { ...FINAL, clearProps: clear })
                else
                  gsap.to(batch, {
                    ...TO.default,
                    ...TO[type],
                    stagger: 0.07,
                    overwrite: true,
                    clearProps: clear,
                  })
              },
            }),
          )
        })

        // ── Project cards ─────────────────────────────────────────────────
        const cards = gsap.utils.toArray('.pcard')
        gsap.set(cards, { opacity: 0, y: 50 * k })
        cleanups.push(
          watch(cards, {
            start: 'top 95%',
            show: (batch, instant) =>
              instant
                ? gsap.set(batch, { opacity: 1, y: 0, clearProps: 'transform,opacity' })
                : gsap.to(batch, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1, clearProps: 'transform,opacity' }),
          }),
        )

        // ── Count-ups ─────────────────────────────────────────────────────
        const counters = gsap.utils.toArray('[data-count]').filter((el) => Number.isFinite(Number(el.dataset.count)))
        const final = (el) => Number(el.dataset.count).toFixed(Number(el.dataset.decimals || 0))
        counters.forEach((el) => (el.textContent = (0).toFixed(Number(el.dataset.decimals || 0))))
        cleanups.push(
          watch(counters, {
            start: 'top 95%',
            show: (batch, instant) =>
              batch.forEach((el) => {
                if (instant) return (el.textContent = final(el))
                const obj = { v: 0 }
                const dec = Number(el.dataset.decimals || 0)
                gsap.to(obj, { v: Number(el.dataset.count), duration: 1.3, ease: 'power2.out', onUpdate: () => (el.textContent = obj.v.toFixed(dec)) })
              }),
          }),
        )
        // Counters must never be left at 0 if this context is reverted mid-way.
        cleanups.push(() => counters.forEach((el) => (el.textContent = final(el))))

        // ── Analytics: bars grow, trend line draws ─────────────────────────
        const hbars = document.querySelector('.hbars')
        if (hbars) {
          const bars = hbars.querySelectorAll('.hbars__bar')
          gsap.set(bars, { scaleX: 0, transformOrigin: 'left' })
          cleanups.push(
            watch([hbars], {
              show: (_b, instant) =>
                instant
                  ? gsap.set(bars, { scaleX: 1 })
                  : gsap.to(bars, { scaleX: 1, duration: 1, ease: 'power3.out', stagger: 0.06 }),
            }),
          )
        }
        const line = document.querySelector('.chart__line')
        if (line) {
          const len = line.getTotalLength()
          gsap.set(line, { strokeDasharray: len, strokeDashoffset: len })
          cleanups.push(
            watch([line], {
              show: (_b, instant) =>
                instant
                  ? gsap.set(line, { clearProps: 'strokeDasharray,strokeDashoffset' })
                  : gsap.to(line, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', clearProps: 'strokeDasharray,strokeDashoffset' }),
            }),
          )
        }

        // ── Workflow: scrubbed connecting line, nodes pop as it passes ─────
        const process = document.querySelector('.process')
        if (process) {
          const fill = process.querySelector('.process__fill')
          const nodes = gsap.utils.toArray('.process__node', process)
          const vertical = () => window.matchMedia('(max-width: 1023px)').matches
          const tl = gsap.timeline({
            scrollTrigger: { trigger: process, start: 'top 75%', end: 'bottom 60%', scrub: 0.5, invalidateOnRefresh: true },
          })
          tl.fromTo(
            fill,
            { scaleX: () => (vertical() ? 1 : 0), scaleY: () => (vertical() ? 0 : 1) },
            { scaleX: 1, scaleY: 1, ease: 'none', duration: nodes.length },
            0,
          )
          nodes.forEach((n, i) => {
            tl.fromTo(n, { scale: 0.4, opacity: 0.4 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(3)' }, i * 0.95)
          })
        }

        // ── Footer ─────────────────────────────────────────────────────────
        gsap.from('.footer__giant', {
          yPercent: 40,
          opacity: 0,
          ease: 'none',
          scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'top 40%', scrub: true },
        })

        // Late layout changes (fonts, images) — re-check positions once things settle.
        const settle = () => ScrollTrigger.refresh()
        window.addEventListener('load', settle)
        cleanups.push(() => window.removeEventListener('load', settle))

        return () => cleanups.forEach((fn) => fn())
      },
    )

    return () => mm.revert()
  }, [])
}
