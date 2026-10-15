import { forwardRef, useEffect, useRef, useState } from 'react'
import { profile } from '../data/profile'
import Button from '../components/Button'
import Portrait from '../components/Portrait'
import { scrollToId } from '../lib/gsap'

/** Cycles which role is "lit" — slow, paused when the hero is off-screen or the tab is hidden. */
function useRoleCycle(count, rootRef) {
  const [active, setActive] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let visible = true
    let id = 0
    const start = () => {
      clearInterval(id)
      id = setInterval(() => {
        if (visible && !document.hidden) setActive((a) => (a + 1) % count)
      }, 2600)
    }
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    if (rootRef.current) io.observe(rootRef.current)
    start()
    return () => {
      clearInterval(id)
      io.disconnect()
    }
  }, [count, rootRef])
  return active
}

/**
 * Hero — text on the left, Photo 1 on the right. The inline portrait is the "slot": on mobile it is the visible
 * portrait; on desktop the floating stage portrait (ScrollStory) sits exactly
 * on top of it and this one is hidden, so the hand-off is seamless.
 */
const Hero = forwardRef(function Hero(_props, slotRef) {
  const sectionRef = useRef(null)
  const letters = profile.name.toUpperCase().split('')
  const activeRole = useRoleCycle(profile.roles.length, sectionRef)

  return (
    <section id="home" ref={sectionRef} className="hero" aria-labelledby="hero-name">
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__cols container">
          <span /><span /><span /><span />
        </div>
        <div className="hero__glow" />
        <p className="hero__ghost js-hero-ghost">DEVELOPER</p>
        <div className="hero__coords container">
          <span className="mono">N° 01 — Portfolio</span>
          <span className="mono">Full Stack · QA · Data</span>
        </div>
      </div>

      <div className="container hero__grid">
        <div className="hero__content js-hero-content">
          {profile.availability && (
            <p className="status js-intro-fade">
              <span className="status__dot" aria-hidden="true" />
              {profile.availability}
            </p>
          )}

          <h1 id="hero-name" className="hero__name" aria-label={profile.name}>
            {letters.map((ch, i) => (
              <span className="hero__char-mask" key={i} aria-hidden="true">
                <span className="hero__char js-intro-char">{ch === ' ' ? ' ' : ch}</span>
              </span>
            ))}
          </h1>

          <ul className="hero__roles" aria-label="Roles">
            {profile.roles.map((r, i) => (
              <li key={r} className={`js-intro-role ${i === activeRole ? 'is-active' : ''}`}>
                <span className="hero__role-idx" aria-hidden="true">0{i + 1}</span>
                {r}
                <span className="hero__role-bar" aria-hidden="true" />
              </li>
            ))}
          </ul>

          <p className="hero__headline">
            <span className="hero__line-mask"><span className="js-intro-line">{profile.headline[0]}</span></span>
            <span className="hero__line-mask"><em className="serif-accent js-intro-line">{profile.headline[1]}</em></span>
          </p>
          <p className="hero__intro js-intro-fade">{profile.intro}</p>

          <div className="hero__ctas js-intro-fade">
            <Button to="projects" variant="primary" magnetic>Explore Projects</Button>
            <Button to="about" variant="ghost" icon={false} magnetic>About Me</Button>
          </div>
        </div>

        <div className="hero__portrait-slot">
          <span className="hero__rim" aria-hidden="true" />
          <Portrait ref={slotRef} className="hero__portrait" />
        </div>
      </div>

      <div className="scroll-cue-wrap">
        <a
          href="#about"
          className="scroll-cue js-intro-cue"
          onClick={(e) => {
            e.preventDefault()
            scrollToId('about')
          }}
        >
          <span className="mono">Scroll</span>
          <span className="scroll-cue__line" aria-hidden="true" />
          <span className="sr-only">to the About section</span>
        </a>
      </div>
    </section>
  )
})

export default Hero
