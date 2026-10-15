import { useCallback, useMemo, useState } from 'react'
import { ThemeContext, THEME_KEY } from './themeContext'

const readInitial = () => {
  const attr = document.documentElement.dataset.theme
  return attr === 'light' ? 'light' : 'dark'
}

/**
 * Theme lives on <html data-theme>. CSS variables do the rest, so switching
 * never re-renders sections, restarts GSAP timelines or moves the scroll position.
 * Only components that read useTheme() (lamp, palette, scratch card) re-render.
 * The first visit is always dark; afterwards the visitor's choice is remembered.
 */
export default function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(readInitial)

  const setTheme = useCallback((next) => {
    const root = document.documentElement
    // Brief, global colour cross-fade — only while switching.
    const animate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (animate) root.classList.add('theme-anim')
    root.dataset.theme = next
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'light' ? '#F4F1E8' : '#10110F')
    try {
      localStorage.setItem(THEME_KEY, next)
    } catch {
      /* storage unavailable — theme still applies for this visit */
    }
    if (animate) window.setTimeout(() => root.classList.remove('theme-anim'), 650)
    setThemeState(next)
  }, [])

  const toggle = useCallback(() => setTheme(theme === 'light' ? 'dark' : 'light'), [theme, setTheme])

  const value = useMemo(() => ({ theme, toggle, setTheme }), [theme, toggle, setTheme])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
