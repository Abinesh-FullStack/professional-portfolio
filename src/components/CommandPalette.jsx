import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { ArrowRight, Copy, FileText, Moon, Search, Sun, SquareTerminal } from 'lucide-react'
import { profile } from '../data/profile'
import { ALL_SECTIONS } from '../data/navigation'
import { scrollToId } from '../lib/gsap'
import { copyText, toast } from '../lib/clipboard'
import { shortcutLabel } from '../lib/platform'
import { useTheme } from '../context/themeContext'
import { GithubIcon, LinkedinIcon } from './Icon'

/**
 * Ctrl/⌘ + K command palette. Combobox + listbox pattern:
 * type to filter, ↑/↓ to move, Enter to run, Esc to close.
 */
export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState(0)
  const { theme, toggle } = useTheme()
  const dlgRef = useRef(null)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const uid = useId()

  const commands = useMemo(() => {
    const go = ALL_SECTIONS.map((s) => ({
      id: `go-${s.id}`,
      group: 'Navigate',
      label: `Go to ${s.label}`,
      keywords: s.id,
      Icon: ArrowRight,
      run: () => scrollToId(s.id),
    }))
    const actions = [
      {
        id: 'theme',
        group: 'Actions',
        label: theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme',
        keywords: 'theme toggle dark light mode',
        Icon: theme === 'light' ? Moon : Sun,
        run: toggle,
      },
      {
        id: 'terminal',
        group: 'Actions',
        label: 'Open the developer terminal',
        keywords: 'terminal console cli shell',
        Icon: SquareTerminal,
        run: () => {
          window.dispatchEvent(new CustomEvent('terminal:open'))
          scrollToId('terminal')
        },
      },
      profile.email && {
        id: 'copy-email',
        group: 'Actions',
        label: 'Copy email address',
        keywords: 'email mail contact copy',
        Icon: Copy,
        run: async () => toast((await copyText(profile.email)) ? 'Email copied' : 'Could not copy — try again'),
      },
      {
        id: 'github',
        group: 'Links',
        label: 'Open GitHub',
        keywords: 'github code repositories',
        Icon: GithubIcon,
        run: () => window.open(profile.links.github, '_blank', 'noopener,noreferrer'),
      },
      {
        id: 'linkedin',
        group: 'Links',
        label: 'Open LinkedIn',
        keywords: 'linkedin profile connect',
        Icon: LinkedinIcon,
        run: () => window.open(profile.links.linkedin, '_blank', 'noopener,noreferrer'),
      },
      profile.links.resume && {
        id: 'resume',
        group: 'Links',
        label: 'Open resume',
        keywords: 'resume cv pdf',
        Icon: FileText,
        run: () => window.open(profile.links.resume, '_blank', 'noopener,noreferrer'),
      },
    ].filter(Boolean)
    return [...go, ...actions]
  }, [theme, toggle])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    const terms = q.split(/\s+/)
    return commands.filter((c) => {
      const hay = `${c.label} ${c.keywords} ${c.group}`.toLowerCase()
      return terms.every((t) => hay.includes(t))
    })
  }, [commands, query])

  // Global shortcut + programmatic open.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    const onOpen = () => setOpen(true)
    window.addEventListener('keydown', onKey)
    window.addEventListener('palette:open', onOpen)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('palette:open', onOpen)
    }
  }, [])

  // Sync the native dialog with state; reset the query each time it opens.
  useEffect(() => {
    const dlg = dlgRef.current
    if (open && !dlg.open) {
      setQuery('')
      setIndex(0)
      dlg.showModal()
      requestAnimationFrame(() => inputRef.current?.focus())
    } else if (!open && dlg.open) {
      dlg.close()
    }
  }, [open])

  useEffect(() => {
    const dlg = dlgRef.current
    const onClose = () => setOpen(false)
    dlg.addEventListener('close', onClose)
    return () => dlg.removeEventListener('close', onClose)
  }, [])

  // Keep the active option in view.
  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${index}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [index])

  const run = (cmd) => {
    if (!cmd) return
    setOpen(false)
    // Let the dialog close (and restore focus) before scrolling or switching.
    requestAnimationFrame(() => cmd.run())
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setIndex((i) => (results.length ? (i + 1) % results.length : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setIndex((i) => (results.length ? (i - 1 + results.length) % results.length : 0))
    } else if (e.key === 'Home') {
      e.preventDefault()
      setIndex(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      setIndex(Math.max(0, results.length - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      run(results[index])
    }
  }

  let lastGroup = null

  return (
    <dialog
      ref={dlgRef}
      className="palette"
      aria-label="Command palette"
      onClick={(e) => e.target === dlgRef.current && setOpen(false)}
    >
      <div className="palette__box">
        <div className="palette__search">
          <Search size={18} aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls={`${uid}-list`}
            aria-activedescendant={results[index] ? `${uid}-${results[index].id}` : undefined}
            aria-autocomplete="list"
            placeholder="Type a command or search…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setIndex(0)
            }}
            onKeyDown={onKeyDown}
            spellCheck="false"
            autoComplete="off"
          />
          <kbd>Esc</kbd>
        </div>

        <ul ref={listRef} id={`${uid}-list`} role="listbox" aria-label="Commands" className="palette__list">
          {results.length === 0 && <li className="palette__empty">No commands match “{query}”.</li>}
          {results.map((c, i) => {
            const header = c.group !== lastGroup ? c.group : null
            lastGroup = c.group
            return (
              <li key={c.id} role="presentation">
                {header && (
                  <span className="palette__group mono" aria-hidden="true">
                    {header}
                  </span>
                )}
                <div
                  id={`${uid}-${c.id}`}
                  role="option"
                  aria-selected={i === index}
                  data-index={i}
                  className={`palette__item ${i === index ? 'is-active' : ''}`}
                  onMouseMove={() => i !== index && setIndex(i)}
                  onClick={() => run(c)}
                >
                  <span className="palette__icon">
                    <c.Icon size={16} />
                  </span>
                  {c.label}
                  {i === index && <kbd className="palette__enter">↵</kbd>}
                </div>
              </li>
            )
          })}
        </ul>

        <div className="palette__foot mono">
          <span><kbd>↑</kbd><kbd>↓</kbd> move</span>
          <span><kbd>↵</kbd> run</span>
          <span><kbd>{shortcutLabel}</kbd> toggle</span>
        </div>
      </div>
    </dialog>
  )
}
