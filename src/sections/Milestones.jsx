import { milestones, certifications } from '../data/profile'
import SectionHeading from '../components/SectionHeading'

/** Only verified items from src/data/profile.js are rendered. Empty lists are omitted. */
export default function Milestones() {
  if (!milestones.length && !certifications.length) return null
  const items = [
    ...milestones,
    ...certifications.map((c) => ({ date: c.year, title: c.name, text: c.issuer, type: 'Certification', url: c.url })),
  ]

  return (
    <section id="milestones" className="section section--tight milestones" aria-labelledby="milestones-title">
      <div className="container milestones__grid">
        <SectionHeading index="—" label="Milestones" title="Learning &" accent="growth" id="milestones-title" />
        <ul className="mlist">
          {items.map((m) => (
            <li key={m.title} data-reveal="left">
              <span className="mlist__date mono">{m.date}</span>
              <div>
                <h3>
                  {m.url ? (
                    <a href={m.url} target="_blank" rel="noopener noreferrer">
                      {m.title}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ) : (
                    m.title
                  )}
                </h3>
                <p>{m.text}</p>
              </div>
              <span className="mlist__type">{m.type}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
