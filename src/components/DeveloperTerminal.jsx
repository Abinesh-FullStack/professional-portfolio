import { useEffect, useRef, useState } from 'react'
import { Minus, SquareTerminal, X } from 'lucide-react'
import { profile, experience } from '../data/profile'
import { skillGroups } from '../data/skills'
import { projects, categories } from '../data/projects'

const COMMANDS = ['help', 'about', 'experience', 'skills', 'projects', 'contact', 'clear']

/** Responses are built from the same data files the site uses — nothing simulated. */
function respond(cmd) {
  switch (cmd) {
    case 'help':
      return [
        'Available commands:',
        ...[
          ['about', 'who I am'],
          ['experience', 'where I work'],
          ['skills', 'tools, grouped by area'],
          ['projects', 'selected work and status'],
          ['contact', 'how to reach me'],
          ['clear', 'clear the screen'],
        ].map(([c, d]) => `  ${c.padEnd(12)}${d}`),
        'Tip: ↑ / ↓ recall history, Tab completes.',
      ]
    case 'about':
      return [
        `${profile.name} — ${profile.roles.join(' · ')}`,
        `${profile.currentRole} at ${profile.company}, ~${profile.experienceYears} years of experience.`,
        '',
        profile.about.paragraphs[0],
      ]
    case 'experience':
      return experience.flatMap((j) => [
        `${j.role} @ ${j.company}   [${j.start} — ${j.end || 'Present'}]`,
        ...j.groups.flatMap((g) => [`  ${g.title}`, ...g.items.map((i) => `    • ${i}`)]),
      ])
    case 'skills':
      return skillGroups.map((g) => `${(g.title + ':').padEnd(17)}${g.items.map((i) => i.name).join(', ')}`)
    case 'projects':
      return projects.map(
        (p, i) => `${String(i + 1).padStart(2, '0')}  ${p.title.padEnd(30)}${categories[p.category].label} · ${p.status}`,
      )
    case 'contact':
      return [
        profile.email ? `email      ${profile.email}` : 'email      (not published yet — use LinkedIn)',
        `linkedin   ${profile.links.linkedin}`,
        `github     ${profile.links.github}`,
      ]
    default:
      return null
  }
}

const WELCOME = [
  `abinesh.dev — interactive profile (local, no network)`,
  `Type "help" or pick a command below.`,
]

export default function DeveloperTerminal() {
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [lines, setLines] = useState(() => WELCOME.map((t) => ({ kind: 'sys', text: t })))
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])
  const [hIndex, setHIndex] = useState(-1)
  const inputRef = useRef(null)
  const screenRef = useRef(null)
  const launcherRef = useRef(null)

  useEffect(() => {
    const onOpen = () => {
      setOpen(true)
      setMinimized(false)
    }
    window.addEventListener('terminal:open', onOpen)
    return () => window.removeEventListener('terminal:open', onOpen)
  }, [])

  useEffect(() => {
    if (open && !minimized) inputRef.current?.focus({ preventScroll: true })
  }, [open, minimized])

  useEffect(() => {
    const s = screenRef.current
    if (s) s.scrollTop = s.scrollHeight
  }, [lines])

  const exec = (raw) => {
    const cmd = raw.trim().toLowerCase()
    if (!cmd) return
    setHistory((h) => [...h, cmd])
    setHIndex(-1)
    if (cmd === 'clear') {
      setLines([])
      return
    }
    const out = respond(cmd)
    setLines((l) => [
      ...l,
      { kind: 'in', text: cmd },
      ...(out
        ? out.map((t) => ({ kind: 'out', text: t }))
        : [{ kind: 'err', text: `command not found: ${cmd} — type "help" to see what's available.` }]),
    ])
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      exec(input)
      setInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!history.length) return
      const i = hIndex === -1 ? history.length - 1 : Math.max(0, hIndex - 1)
      setHIndex(i)
      setInput(history[i])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (hIndex === -1) return
      const i = hIndex + 1
      if (i >= history.length) {
        setHIndex(-1)
        setInput('')
      } else {
        setHIndex(i)
        setInput(history[i])
      }
    } else if (e.key === 'Tab') {
      const match = COMMANDS.filter((c) => c.startsWith(input.trim().toLowerCase()))
      if (input && match.length === 1) {
        e.preventDefault()
        setInput(match[0])
      }
    } else if (e.key === 'Escape') {
      setMinimized(true)
    }
  }

  const close = () => {
    setOpen(false)
    requestAnimationFrame(() => launcherRef.current?.focus())
  }

  if (!open) {
    return (
      <div className="term-launch" data-reveal>
        <div>
          <p className="term-launch__title">Prefer the command line?</p>
          <p className="term-launch__text">
            Explore this profile through a small local terminal — <code>about</code>, <code>skills</code>,{' '}
            <code>projects</code> and more.
          </p>
        </div>
        <button ref={launcherRef} type="button" className="btn btn--ghost" onClick={() => setOpen(true)} data-cursor>
          <span className="btn__label">Open terminal</span>
          <span className="btn__icon" aria-hidden="true">
            <SquareTerminal size={16} />
          </span>
        </button>
      </div>
    )
  }

  return (
    <div className={`term ${minimized ? 'is-min' : ''}`} role="region" aria-label="Developer terminal">
      <div className="term__bar">
        <span className="term__title mono">
          <SquareTerminal size={14} aria-hidden="true" /> visitor@abinesh: ~
        </span>
        <div className="term__ctrls">
          <button type="button" onClick={() => setMinimized((m) => !m)} aria-label={minimized ? 'Restore terminal' : 'Minimise terminal'} aria-expanded={!minimized}>
            <Minus size={14} />
          </button>
          <button type="button" onClick={close} aria-label="Close terminal">
            <X size={14} />
          </button>
        </div>
      </div>

      {!minimized && (
        <>
          <div
            ref={screenRef}
            className="term__screen"
            onClick={() => window.getSelection()?.isCollapsed && inputRef.current?.focus()}
            role="log"
            aria-live="polite"
            aria-label="Terminal output"
          >
            {lines.map((l, i) => (
              <div key={i} className={`term__line term__line--${l.kind}`}>
                {l.kind === 'in' && <span className="term__prompt" aria-hidden="true">❯ </span>}
                {l.text || ' '}
              </div>
            ))}
            <label className="term__input">
              <span className="term__prompt" aria-hidden="true">❯</span>
              <span className="sr-only">Command</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                spellCheck="false"
                autoComplete="off"
                autoCapitalize="off"
                enterKeyHint="send"
              />
            </label>
          </div>
          <div className="term__chips" aria-label="Quick commands">
            {COMMANDS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  exec(c)
                  inputRef.current?.focus({ preventScroll: true })
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
