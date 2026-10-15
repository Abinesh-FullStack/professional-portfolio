import { useEffect, useRef, useState } from 'react'
import { useTheme } from '../context/themeContext'

const MAX_PULL = 46 // px the cord can stretch while dragging
const TRIGGER = 18 // px pulled before release counts as a "pull"
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Hanging pendant lamp with a pull cord. LAMP ON = light theme, LAMP OFF = dark theme.
 *
 * - Drag the handle down (mouse, pen or touch via Pointer Events) and let go past the
 *   threshold, or simply click / tap it. Enter and Space work because it is a real
 *   <button role="switch">.
 * - The cord stretches with resistance while dragged and springs back on release.
 * - A small visible "Light / Dark" label backs up the lamp so the state never relies
 *   on the illustration alone.
 * - Plain CSS + SVG; no animation library. Reduced motion → no tug, instant switch.
 */
export default function PullCordThemeSwitch() {
  const { theme, toggle } = useTheme()
  const on = theme === 'light'
  const btnRef = useRef(null)
  const drag = useRef({ active: false, startY: 0, moved: false, suppressClick: false })
  const timer = useRef(0)
  const [pull, setPull] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [tug, setTug] = useState(false)

  useEffect(() => () => clearTimeout(timer.current), [])

  // Click, tap, Enter, Space: a short tug, with the switch flipping as the cord bottoms out.
  const tugAndToggle = () => {
    if (reduceMotion()) {
      toggle()
      return
    }
    setTug(false)
    requestAnimationFrame(() => setTug(true))
    clearTimeout(timer.current)
    timer.current = setTimeout(toggle, 140)
  }

  const onPointerDown = (e) => {
    if (e.button !== 0) return
    drag.current = { active: true, startY: e.clientY, moved: false, suppressClick: false }
    btnRef.current.setPointerCapture?.(e.pointerId)
  }

  const onPointerMove = (e) => {
    const d = drag.current
    if (!d.active) return
    const dy = Math.max(0, e.clientY - d.startY)
    if (dy > 4 && !d.moved) {
      d.moved = true
      setDragging(true)
    }
    if (d.moved) {
      // Rubber-band resistance: easy at first, firmer as it stretches.
      setPull(MAX_PULL * (1 - Math.exp(-dy / MAX_PULL)))
    }
  }

  const endDrag = () => {
    const d = drag.current
    if (!d.active) return
    d.active = false
    if (d.moved) {
      d.suppressClick = true // the browser still fires "click" after a drag
      if (pull >= TRIGGER) toggle()
      setDragging(false)
      setPull(0) // springs back via CSS transition
    }
  }

  const onClick = () => {
    if (drag.current.suppressClick) {
      drag.current.suppressClick = false
      return
    }
    tugAndToggle()
  }

  const label = on ? 'Lamp on — light theme. Pull to switch to dark theme' : 'Lamp off — dark theme. Pull to switch to light theme'

  return (
    <div
      className={`lamp ${on ? 'is-on' : ''} ${dragging ? 'is-dragging' : ''} ${tug ? 'is-tug' : ''}`}
      style={{ '--pull': `${pull}px` }}
      onAnimationEnd={(e) => e.animationName === 'lamp-tug' && setTug(false)}
    >
      <span className="lamp__wire" aria-hidden="true" />
      <svg className="lamp__shade" viewBox="0 0 40 30" aria-hidden="true">
        <defs>
          <linearGradient id="lampShade" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#3a3d33" />
            <stop offset="1" stopColor="#1f211c" />
          </linearGradient>
          <radialGradient id="lampBulb" cx="0.5" cy="0.4" r="0.6">
            <stop offset="0" stopColor="#fffaf0" />
            <stop offset="1" stopColor="#f3dfae" />
          </radialGradient>
        </defs>
        <rect x="17" y="0" width="6" height="5" rx="1.2" fill="#2b2d27" />
        <path d="M20 4 C 9 4, 4 13, 2 24 L 38 24 C 36 13, 31 4, 20 4 Z" fill="url(#lampShade)" />
        <path d="M2.6 23 L 37.4 23" stroke="#a5ad78" strokeWidth="1.2" strokeLinecap="round" />
        <ellipse className="lamp__bulb" cx="20" cy="25.2" rx="6.4" ry="3.6" />
      </svg>
      <span className="lamp__glow" aria-hidden="true" />

      <button
        ref={btnRef}
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        title={on ? 'Pull to turn the lamp off (dark theme)' : 'Pull to turn the lamp on (light theme)'}
        className="lamp__pull"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onLostPointerCapture={endDrag}
        onClick={onClick}
        data-cursor
      >
        <span className="lamp__cord" aria-hidden="true" />
        <span className="lamp__handle" aria-hidden="true" />
      </button>

      <span className="lamp__state mono" aria-hidden="true">
        {on ? 'Light' : 'Dark'}
      </span>
    </div>
  )
}
