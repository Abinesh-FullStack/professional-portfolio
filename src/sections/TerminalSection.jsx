import DeveloperTerminal from '../components/DeveloperTerminal'
import { shortcutLabel } from '../lib/platform'

export default function TerminalSection() {
  return (
    <section id="terminal" className="section section--tight terminal-section" aria-labelledby="terminal-title">
      <div className="container terminal-section__grid">
        <div>
          <p className="eyebrow" data-reveal="fade">
            <span className="eyebrow__index">07</span>
            <span className="eyebrow__rule" data-reveal="line" aria-hidden="true" />
            <span>Explore</span>
          </p>
          <h2 id="terminal-title" className="terminal-section__title" data-reveal>
            For the <em className="serif-accent">curious</em>
          </h2>
          <p className="terminal-section__text" data-reveal>
            Optional extras for exploring: a local terminal, and a command palette — press <kbd>{shortcutLabel}</kbd> anywhere.
          </p>
        </div>
        <DeveloperTerminal />
      </div>
    </section>
  )
}
