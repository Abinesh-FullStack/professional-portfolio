import { ArrowUp } from 'lucide-react'
import { profile } from '../data/profile'
import { NAV_ITEMS } from '../data/navigation'
import { scrollToId } from '../lib/gsap'
import { shortcutLabel } from '../lib/platform'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="container">
        <p className="footer__giant" aria-hidden="true">
          {profile.name.toUpperCase()}
        </p>
        <div className="footer__row" data-reveal="fade">
          <p>
            © {year} {profile.name}. Designed &amp; built with React and GSAP.
          </p>
          <nav aria-label="Footer">
            <ul>
              {NAV_ITEMS.map((n) => (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToId(n.id)
                    }}
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="footer__end">
            <span className="mono footer__hint">
              Press <kbd>{shortcutLabel}</kbd>
            </span>
            <button type="button" className="footer__top" onClick={() => scrollToId('home')}>
              Back to top <ArrowUp size={14} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
