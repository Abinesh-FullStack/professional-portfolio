import { useEffect, useRef, useState } from 'react'
import { Command, Menu, X } from 'lucide-react'
import { profile } from '../data/profile'
import { scrollToId } from '../lib/gsap'
import { useActiveSection } from '../hooks/useActiveSection'
import { GithubIcon, LinkedinIcon } from './Icon'
import { NAV_ITEMS } from '../data/navigation'
import PullCordThemeSwitch from './PullCordThemeSwitch'
import ScrollProgress from './ScrollProgress'
import { shortcutLabel } from '../lib/platform'


export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const menuBtnRef = useRef(null)
  const panelRef = useRef(null)
  const active = useActiveSection(NAV_ITEMS.map((n) => n.id))

  // Scroll-aware styling: solid after the top, tucks away when scrolling down fast,
  // returns when scrolling up. Only flips state when it actually changes.
  useEffect(() => {
    let last = window.scrollY
    let raf = 0
    const update = () => {
      raf = 0
      const y = window.scrollY
      setScrolled(y > 24)
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > window.innerHeight * 0.9)
        last = y
      }
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  // Mobile menu: lock scroll, close on Escape, keep focus inside.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panelRef.current?.querySelector('a')?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        menuBtnRef.current?.focus()
      }
      if (e.key === 'Tab' && panelRef.current) {
        const f = [menuBtnRef.current, ...panelRef.current.querySelectorAll('a, button')]
        const i = f.indexOf(document.activeElement)
        if (e.shiftKey && i <= 0) {
          e.preventDefault()
          f[f.length - 1].focus()
        } else if (!e.shiftKey && i === f.length - 1) {
          e.preventDefault()
          f[0].focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const go = (e, id) => {
    e.preventDefault()
    setOpen(false)
    requestAnimationFrame(() => scrollToId(id))
  }

  const openPalette = () => window.dispatchEvent(new CustomEvent('palette:open'))

  return (
    <header
      className={`nav ${scrolled ? 'nav--scrolled' : ''} ${open ? 'nav--open' : ''} ${hidden && !open ? 'nav--hidden' : ''}`}
      onFocus={() => setHidden(false)}
    >
      <ScrollProgress />
      <div className="container nav__inner">
        <a href="#home" className="nav__brand" onClick={(e) => go(e, 'home')} aria-label={`${profile.name} — back to top`}>
          <span className="nav__mark" aria-hidden="true">AV</span>
          <span className="nav__brandtext">{profile.name}</span>
        </a>

        <nav aria-label="Primary" className="nav__links">
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => go(e, item.id)}
                  className={active === item.id ? 'is-active' : ''}
                  aria-current={active === item.id ? 'true' : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav__tools">
          <button type="button" className="nav__kbd" onClick={openPalette} aria-label={`Open command palette (${shortcutLabel})`}>
            <Command size={14} strokeWidth={2} aria-hidden="true" />
            <span aria-hidden="true">{shortcutLabel}</span>
          </button>
          <PullCordThemeSwitch />
          <button
            ref={menuBtnRef}
            type="button"
            className="nav__toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <div id="mobile-menu" ref={panelRef} className={`nav__panel ${open ? 'is-open' : ''}`} inert={open ? undefined : ''}>
        <nav aria-label="Mobile">
          <ol>
            {NAV_ITEMS.map((item, i) => (
              <li key={item.id} style={{ '--i': i }}>
                <a href={`#${item.id}`} onClick={(e) => go(e, item.id)} aria-current={active === item.id ? 'true' : undefined}>
                  <span className="nav__panel-idx">0{i + 1}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="nav__panel-foot">
          <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">
            <LinkedinIcon size={18} /> LinkedIn<span className="sr-only"> (opens in a new tab)</span>
          </a>
          <a href={profile.links.github} target="_blank" rel="noopener noreferrer">
            <GithubIcon size={18} /> GitHub<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </div>
    </header>
  )
}
