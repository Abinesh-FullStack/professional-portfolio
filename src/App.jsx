import ThemeProvider from './context/ThemeProvider'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Cursor from './components/Cursor'
import BackToTop from './components/BackToTop'
import Marquee from './components/Marquee'
import CommandPalette from './components/CommandPalette'
import Toast from './components/Toast'
import ScrollStory from './sections/ScrollStory'
import Skills from './sections/Skills'
import Projects from './sections/Projects'
import AnalyticsShowcase from './sections/AnalyticsShowcase'
import Workflow from './sections/Workflow'
import Milestones from './sections/Milestones'
import TerminalSection from './sections/TerminalSection'
import Contact from './sections/Contact'
import { useEffect } from 'react'
import { useMotion } from './hooks/useMotion'
import { ScrollTrigger } from './lib/gsap'

/** Honour #section deep links once the page has rendered and measured itself. */
function useHashLanding() {
  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1))
    if (!id) return
    const t = setTimeout(() => {
      const el = document.getElementById(id)
      if (!el) return
      ScrollTrigger.refresh()
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 8, behavior: 'instant' })
    }, 80)
    return () => clearTimeout(t)
  }, [])
}

function Site() {
  useMotion()
  useHashLanding()
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <ScrollStory />
        <Skills />
        <Marquee />
        <Projects />
        <AnalyticsShowcase />
        <Workflow />
        <Milestones />
        <TerminalSection />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
      <CommandPalette />
      <Toast />
      <Cursor />
      <div className="grain" aria-hidden="true" />
    </>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <Site />
    </ThemeProvider>
  )
}
