import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Copy, Eye, RotateCcw } from 'lucide-react'
import { profile } from '../data/profile'
import { copyText, toast } from '../lib/clipboard'
import { useTheme } from '../context/themeContext'
import { LinkedinIcon } from './Icon'

const THRESHOLD = 0.45 // reveal once ~45% has been scratched
const BRUSH = 38 // CSS px

/** Deterministic pseudo-random so the foil texture looks the same on every redraw. */
const rng = (seed) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646

/**
 * Canvas scratch-to-reveal card.
 * - Pointer Events cover mouse, pen and touch. touch-action:none is set on the
 *   canvas only, so page scrolling outside the card is untouched.
 * - Progress is sampled (every 6th pixel, throttled) — cheap even on phones.
 * - Keyboard / assistive-tech fallback: the "Reveal" button.
 * Nothing about the visitor is stored or sent anywhere.
 */
export default function ScratchCard() {
  const { theme } = useTheme()
  const email = "abinesh-fullstack@gmail.com"
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const state = useRef({ drawing: false, last: null, mid: null, started: false, checkAt: 0, raf: 0 })
  const [progress, setProgress] = useState(0)
  const [revealed, setRevealed] = useState(false)

  const drawCover = useCallback(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = wrap.clientWidth
    const h = wrap.clientHeight
    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.globalCompositeOperation = 'source-over'

    const css = getComputedStyle(wrap)
    const c1 = css.getPropertyValue('--foil-1').trim() || '#8d9462'
    const c2 = css.getPropertyValue('--foil-2').trim() || '#b9bf8f'
    const c3 = css.getPropertyValue('--foil-3').trim() || '#6f764a'
    const ink = css.getPropertyValue('--foil-ink').trim() || '#10110f'

    // Brushed-metal foil: diagonal gradient + fine strokes + speckle.
    const g = ctx.createLinearGradient(0, 0, w, h)
    g.addColorStop(0, c3)
    g.addColorStop(0.35, c2)
    g.addColorStop(0.55, c1)
    g.addColorStop(0.8, c2)
    g.addColorStop(1, c3)
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)

    const rand = rng(42)
    ctx.globalAlpha = 0.08
    ctx.strokeStyle = ink
    ctx.lineWidth = 1
    for (let x = -h; x < w; x += 6) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x + h, h)
      ctx.stroke()
    }
    ctx.globalAlpha = 0.18
    ctx.fillStyle = '#ffffff'
    for (let i = 0; i < (w * h) / 140; i++) ctx.fillRect(rand() * w, rand() * h, 1, 1)
    ctx.globalAlpha = 1

    // Inset frame + label.
    ctx.strokeStyle = ink
    ctx.globalAlpha = 0.35
    ctx.setLineDash([2, 5])
    ctx.strokeRect(12.5, 12.5, w - 25, h - 25)
    ctx.setLineDash([])
    ctx.globalAlpha = 0.85
    ctx.fillStyle = ink
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const small = w < 360
    ctx.font = `600 ${small ? 11 : 12}px "JetBrains Mono", ui-monospace, monospace`
    ctx.fillText('SCRATCH TO DISCOVER', w / 2, h / 2 - 12)
    ctx.fillText('MY EMAIL', w / 2, h / 2 + 8)
    ctx.globalAlpha = 0.55
    ctx.font = `400 ${small ? 10 : 11}px "JetBrains Mono", ui-monospace, monospace`
    ctx.fillText('drag across the card ✦', w / 2, h / 2 + 34)
    ctx.globalAlpha = 1
    ctx.globalCompositeOperation = 'destination-out'
  }, [])

  // Draw (and redraw on resize / theme change) until the card has been touched.
  useLayoutEffect(() => {
    if (revealed) return
    const s = state.current
    if (!s.started) drawCover()
    const ro = new ResizeObserver(() => {
      if (!state.current.started) drawCover()
    })
    ro.observe(wrapRef.current)
    return () => ro.disconnect()
  }, [drawCover, revealed, theme])

  const measure = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return 0
    const ctx = canvas.getContext('2d')
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)
    let clear = 0
    let total = 0
    for (let i = 3; i < data.length; i += 4 * 6) {
      total++
      if (data[i] < 40) clear++
    }
    return total ? clear / total : 0
  }, [])

  const finish = useCallback(() => {
    setProgress(1)
    setRevealed(true)
  }, [])

  const check = useCallback(() => {
    const p = measure()
    setProgress(p)
    if (p >= THRESHOLD) finish()
  }, [measure, finish])

  const point = (e) => {
    const r = canvasRef.current.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }

  const onDown = (e) => {
    if (revealed) return
    const s = state.current
    s.drawing = true
    s.started = true
    s.last = point(e)
    s.mid = s.last
    canvasRef.current.setPointerCapture?.(e.pointerId)
    const ctx = canvasRef.current.getContext('2d')
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(s.last.x, s.last.y, BRUSH / 2, 0, Math.PI * 2)
    ctx.fill()
  }

  const onMove = (e) => {
    const s = state.current
    if (!s.drawing || revealed) return
    const p = point(e)
    const ctx = canvasRef.current.getContext('2d')
    // Smooth trail: quadratic curve through midpoints.
    const mid = { x: (s.last.x + p.x) / 2, y: (s.last.y + p.y) / 2 }
    ctx.globalCompositeOperation = 'destination-out'
    ctx.lineWidth = BRUSH
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.moveTo(s.mid.x, s.mid.y)
    ctx.quadraticCurveTo(s.last.x, s.last.y, mid.x, mid.y)
    ctx.stroke()
    s.last = p
    s.mid = mid

    const now = performance.now()
    if (now > s.checkAt && !s.raf) {
      s.checkAt = now + 220
      s.raf = requestAnimationFrame(() => {
        s.raf = 0
        check()
      })
    }
  }

  const onUp = () => {
    const s = state.current
    if (!s.drawing) return
    s.drawing = false
    check()
  }

  useEffect(() => () => cancelAnimationFrame(state.current.raf), [])

  const reset = () => {
    state.current.started = false
    setProgress(0)
    setRevealed(false)
  }

  const copy = async () => toast((await copyText(email)) ? 'Email copied' : 'Could not copy — try again')

  return (
    <div className="scratch" data-reveal="scale">
      <div ref={wrapRef} className={`scratch__card ${revealed ? 'is-revealed' : ''}`}>
        <div className="scratch__under" aria-hidden={!revealed}>
          {email ? (
            <>
              <span className="mono scratch__kicker">Email</span>
              <a className="scratch__email" href={`mailto:${email}`} tabIndex={revealed ? 0 : -1}>
                {email}
              </a>
            </>
          ) : import.meta.env.DEV ? (
            <>
              <span className="mono scratch__kicker">Setup needed</span>
              <span className="scratch__setup">
                Add your address to <code>profile.email</code> in <code>src/data/profile.js</code>.
              </span>
            </>
          ) : (
            <>
              <span className="mono scratch__kicker">Email coming soon</span>
              <a className="scratch__setup" href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" tabIndex={revealed ? 0 : -1}>
                <LinkedinIcon size={16} /> Message me on LinkedIn meanwhile
              </a>
            </>
          )}
        </div>

        {(
          <canvas
            ref={canvasRef}
            className="scratch__canvas"
            aria-hidden="true"
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            onLostPointerCapture={onUp}
          />
        )}
      </div>

      <div className="scratch__bar">
        <div className="scratch__meter" aria-hidden="true">
          <span style={{ transform: `scaleX(${Math.min(1, progress / THRESHOLD)})` }} />
        </div>
        <div className="scratch__actions">
          {!revealed ? (
            <button type="button" className="chipbtn" onClick={finish}>
              <Eye size={14} aria-hidden="true" /> Reveal
            </button>
          ) : (
            <>
              {email && (
                <button type="button" className="chipbtn chipbtn--accent" onClick={copy}>
                  <Copy size={14} aria-hidden="true" /> Copy email
                </button>
              )}
              <button type="button" className="chipbtn" onClick={reset}>
                <RotateCcw size={14} aria-hidden="true" /> Scratch again
              </button>
            </>
          )}
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {revealed ? (email ? `Email revealed: ${email}` : 'Email is not published yet.') : ''}
      </p>
    </div>
  )
}
