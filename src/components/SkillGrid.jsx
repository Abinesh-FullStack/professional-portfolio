import { useState } from 'react'
import { skillGroups } from '../data/skills'
import { GroupIcon } from './Icon'

/**
 * Compact tech-stack grid. Every technology name is always visible (no hidden
 * tabs). Hovering or focusing a tool shows a one-line description in the
 * shared detail bar; the grid itself never depends on that interaction.
 */
export default function SkillGrid() {
  const first = skillGroups[0]
  const [active, setActive] = useState({ group: first.title, ...first.items[0] })

  return (
    <div className="stack">
      <div className="stack__grid">
        {skillGroups.map((g, gi) => (
          <article key={g.id} className="stack__group" data-reveal="rise" aria-labelledby={`sg-${g.id}`}>
            <header className="stack__head">
              <span className="stack__icon">
                <GroupIcon name={g.icon} size={18} />
              </span>
              <h3 id={`sg-${g.id}`}>{g.title}</h3>
              <span className="stack__idx mono" aria-hidden="true">
                {String(gi + 1).padStart(2, '0')}
              </span>
            </header>
            <ul className="stack__items">
              {g.items.map((t) => {
                const on = active.name === t.name
                return (
                  <li key={t.name}>
                    <button
                      type="button"
                      className={`stack__tool ${on ? 'is-active' : ''}`}
                      aria-pressed={on}
                      aria-describedby="stack-detail"
                      onMouseEnter={() => setActive({ group: g.title, ...t })}
                      onFocus={() => setActive({ group: g.title, ...t })}
                      onClick={() => setActive({ group: g.title, ...t })}
                    >
                      {t.name}
                    </button>
                  </li>
                )
              })}
            </ul>
          </article>
        ))}
      </div>

      <p className="stack__detail" id="stack-detail" aria-live="polite" data-reveal="fade">
        <span className="mono stack__detail-cat">{active.group}</span>
        <strong key={active.name}>{active.name}</strong>
        <span className="stack__detail-desc">{active.desc}</span>
      </p>
    </div>
  )
}
