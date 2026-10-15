import { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import Portrait from '../components/Portrait'
import PhotoFrame from '../components/PhotoFrame'
import Hero from './Hero'
import About from './About'
import Experience from './Experience'

/**
 * THE TWO-PHOTO SCROLL STORY (desktop)
 *
 *   Hero        text LEFT   · Photo 1 RIGHT
 *      ↓ scroll: Photo 1 glides to the LEFT while the hero copy lifts away
 *   01 About    Photo 1 LEFT · text RIGHT          ← story start
 *      ↓ scroll: Photo 1 scales down and travels LEFT → RIGHT;
 *                as it arrives, Photo 2 is mask-revealed in exactly the same box
 *   02 Experience  text LEFT · Photo 2 RIGHT (subtle parallax)
 *      ↓ the stage ends with Experience and releases before 03 Tech Stack
 *
 * One sticky stage, one Photo 1 element, one Photo 2 element — no duplicates.
 * Both moves are scrubbed fromTo tweens with measured geometry and adjacent,
 * non-overlapping scroll ranges, so they reverse cleanly when scrolling up.
 * Content sections sit above the stage (z-index) and never depend on these
 * animations to be visible.
 *
 * Modes (data-mode, from gsap.matchMedia):
 *   motion → desktop: scrubbed choreography
 *   static → desktop + reduced motion: the same three positions, switched instantly
 *   stack  → below 1024px: natural flow — Photo 1 (hero), content, Photo 2 (Experience)
 */
export default function ScrollStory() {
  const rootRef = useRef(null)
  const slotRef = useRef(null)
  const stickyRef = useRef(null)
  const figRef = useRef(null)
  const leftRef = useRef(null)
  const rightRef = useRef(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    const mm = gsap.matchMedia(root)

    mm.add(
      {
        any: 'all',
        desktop: '(min-width: 1024px)',
        reduce: '(prefers-reduced-motion: reduce)',
      },
      (ctx) => {
        const { desktop, reduce } = ctx.conditions
        root.dataset.mode = desktop ? (reduce ? 'static' : 'motion') : 'stack'

        // ── 1. Hero entrance (short delay, mask reveal; never blocks content) ──
        if (!reduce) {
          const intro = desktop ? figRef.current : slotRef.current
          const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.15 })
          tl.from('.hero__cols span', { scaleY: 0, transformOrigin: 'top', duration: 0.9, stagger: 0.06, ease: 'power2.inOut' }, 0)
            .from(intro.querySelector('.js-intro-arch'), { scale: 0.9, opacity: 0, transformOrigin: '50% 100%', duration: 1 }, 0.1)
            .fromTo(
              intro.querySelector('.js-intro-img'),
              { clipPath: 'inset(100% 0% 0% 0%)', y: 30 },
              { clipPath: 'inset(0% 0% 0% 0%)', y: 0, duration: 1.2, ease: 'power4.inOut', clearProps: 'clipPath' },
              0.2,
            )
            .from('.hero__rim', { opacity: 0, duration: 1.2 }, 0.6)
            .from('.js-intro-char', { yPercent: 110, duration: 0.8, stagger: 0.035, ease: 'power4.out' }, 0.25)
            .from('.js-intro-role', { y: 16, opacity: 0, duration: 0.6, stagger: 0.08 }, 0.55)
            .from('.js-intro-line', { yPercent: 105, duration: 0.8, stagger: 0.1, ease: 'power4.out' }, 0.62)
            .from('.js-intro-fade', { y: 16, opacity: 0, duration: 0.6, stagger: 0.07 }, 0.8)
            .from(['.js-intro-cue', '.hero__coords span'], { opacity: 0, duration: 0.6 }, 1.05)

          // Experience timeline line draws with scroll (all layouts).
          gsap.from('.js-timeline-fill', {
            scaleY: 0,
            transformOrigin: 'top',
            ease: 'none',
            scrollTrigger: { trigger: '.timeline', start: 'top 70%', end: 'bottom 55%', scrub: true },
          })
        }

        if (!desktop) {
          if (!reduce) {
            gsap.to(slotRef.current.querySelector('.portrait__float'), {
              yPercent: 6,
              ease: 'none',
              scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
            })
          }
          return () => delete root.dataset.mode
        }

        // ── 2. Desktop geometry: hero slot → LEFT anchor → RIGHT anchor ───────
        const fig = figRef.current
        const slot = slotRef.current
        const sticky = stickyRef.current
        const hero = root.querySelector('.hero')
        const photo2 = root.querySelector('.stage__photo2')
        const media2 = photo2.querySelector('.photo-frame__media')
        const geo = { L: { x: 0, y: 0, s: 1 }, R: { x: 0, y: 0, s: 1 } }

        // Positions are measured in sticky-stage coordinates (sticky top === hero top
        // at scroll 0) and re-measured on every ScrollTrigger refresh.
        const measure = () => {
          const st = sticky.getBoundingClientRect()
          const hb = hero.getBoundingClientRect()
          const s = slot.getBoundingClientRect()
          const left = s.left - st.left
          const top = s.top - hb.top
          gsap.set(fig, { left, top, width: s.width, height: s.height })

          const to = (anchor) => {
            const a = anchor.getBoundingClientRect()
            const aL = a.left - st.left
            const aT = a.top - st.top
            return {
              box: { left: aL, top: aT, width: a.width, height: a.height },
              x: aL + a.width / 2 - (left + s.width / 2), // transform-origin: bottom centre
              y: aT + a.height - (top + s.height),
              s: a.height / s.height,
            }
          }
          const L = to(leftRef.current)
          const R = to(rightRef.current)
          geo.L = L
          geo.R = R
          gsap.set(photo2, R.box) // Photo 2 occupies exactly the box Photo 1 lands in
        }
        measure()
        ScrollTrigger.addEventListener('refreshInit', measure)

        // Reduced motion: same story, instant state changes.
        if (reduce) {
          const apply = (stage) => {
            const g = stage === 0 ? { x: 0, y: 0, s: 1 } : stage === 1 ? geo.L : geo.R
            gsap.set(fig, { x: g.x, y: g.y, scale: g.s, autoAlpha: stage === 2 ? 0 : 1 })
            gsap.set(photo2, { clipPath: stage === 2 ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)' })
            gsap.set('.js-hero-content', { autoAlpha: stage === 0 ? 1 : 0 })
          }
          let stage = 0
          const set = (n) => apply((stage = n))
          set(0)
          ScrollTrigger.create({ trigger: '#about', start: 'top 60%', onEnter: () => set(1), onLeaveBack: () => set(0) })
          ScrollTrigger.create({ trigger: '#about', start: 'bottom 55%', onEnter: () => set(2), onLeaveBack: () => set(1) })
          const reapply = () => apply(stage)
          ScrollTrigger.addEventListener('refresh', reapply)
          return () => {
            ScrollTrigger.removeEventListener('refreshInit', measure)
            ScrollTrigger.removeEventListener('refresh', reapply)
            delete root.dataset.mode
          }
        }

        // ── 3. Move 1 — hero (right) → About (left) ───────────────────────────
        gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom 20%', scrub: 0.6, invalidateOnRefresh: true },
          })
          .fromTo(
            fig,
            { x: 0, y: 0, scale: 1 },
            { x: () => geo.L.x, y: () => geo.L.y, scale: () => geo.L.s, ease: 'power2.inOut', duration: 1 },
            0,
          )
          .to('.js-hero-content', { y: -90, opacity: 0, duration: 0.45 }, 0)
          .to(['.scroll-cue-wrap', '.hero__coords', '.hero__portrait-slot'], { opacity: 0, duration: 0.25 }, 0)

        // ── 4. Move 2 — About (left) → Experience (right), Photo 2 revealed ───
        // Runs while About's last lines leave the viewport, before the Experience
        // heading arrives — so the photo never crosses readable text.
        gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: '#about',
              start: 'bottom 88%',
              end: 'bottom 22%',
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          })
          .to('.chapter--about .chapter__body', { opacity: 0, y: -40, duration: 0.35 }, 0)
          .fromTo(
            fig,
            { x: () => geo.L.x, y: () => geo.L.y, scale: () => geo.L.s },
            { x: () => geo.R.x, y: () => geo.R.y, scale: () => geo.R.s, ease: 'power2.inOut', duration: 0.8, immediateRender: false },
            0.05,
          )
          .fromTo(photo2, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'power2.inOut', duration: 0.4 }, 0.6)
          .fromTo(media2, { scale: 1.12 }, { scale: 1, ease: 'power2.out', duration: 0.5 }, 0.55)
          .to(fig, { autoAlpha: 0, duration: 0.12 }, 0.88)

        // Photo 2 — gentle parallax inside its frame while Experience is read.
        gsap.fromTo(
          photo2.querySelector('.photo-frame__img'),
          { yPercent: -3 },
          {
            yPercent: 3,
            ease: 'none',
            scrollTrigger: { trigger: '#experience', start: 'top 60%', end: 'bottom top', scrub: true },
          },
        )

        gsap.to('.js-hero-ghost', {
          xPercent: -14,
          ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
        })

        // Release: the stage dims slightly as it scrolls away with the end of the story.
        gsap.to('.stage__layers', {
          opacity: 0.5,
          yPercent: -3,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'bottom 85%', end: 'bottom top', scrub: true },
        })

        // Cursor parallax on Photo 1 (fine pointers; no idle animation).
        const float = fig.querySelector('.portrait__float')
        let onMove
        if (window.matchMedia('(pointer: fine)').matches) {
          const xTo = gsap.quickTo(float, 'x', { duration: 1.2, ease: 'power3.out' })
          const rTo = gsap.quickTo(float, 'rotation', { duration: 1.2, ease: 'power3.out' })
          onMove = (e) => {
            const nx = e.clientX / window.innerWidth - 0.5
            xTo(nx * 12)
            rTo(nx * 0.6)
          }
          window.addEventListener('pointermove', onMove, { passive: true })
        }

        return () => {
          ScrollTrigger.removeEventListener('refreshInit', measure)
          if (onMove) window.removeEventListener('pointermove', onMove)
          delete root.dataset.mode
        }
      },
    )

    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    const ro = new ResizeObserver(() => ScrollTrigger.refresh())
    ro.observe(slotRef.current)

    return () => {
      ro.disconnect()
      mm.revert()
    }
  }, [])

  return (
    <div ref={rootRef} className="story">
      <div className="stage">
        <div ref={stickyRef} className="stage__sticky">
          <div className="stage__layers">
            <Portrait ref={figRef} className="stage__portrait" decorative />
            <PhotoFrame variant="photo2" className="stage__photo2" sizes="440px" />
          </div>
          <div className="stage__grid container" aria-hidden="true">
            <span ref={leftRef} className="stage__anchor stage__anchor--left" />
            <span ref={rightRef} className="stage__anchor stage__anchor--right" />
          </div>
        </div>
      </div>

      <Hero ref={slotRef} />
      <About />
      <Experience />
    </div>
  )
}
