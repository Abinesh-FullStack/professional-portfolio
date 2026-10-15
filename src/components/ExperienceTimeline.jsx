import { ArrowRight } from 'lucide-react'

/**
 * Vertical timeline. The track fill is scrubbed by scroll (ScrollStory), nodes
 * pop in sequence, groups slide in from alternating sides (useMotion).
 */
export default function ExperienceTimeline({ items }) {
  return (
    <div className="timeline">
      <span className="timeline__track" aria-hidden="true">
        <span className="timeline__fill js-timeline-fill" />
      </span>
      <ol className="timeline__list">
        {items.map((job) => (
          <li className="timeline__item" key={job.company + job.start}>
            <span className="timeline__node" data-reveal="pop" aria-hidden="true" />
            <div className="timeline__date mono" data-reveal="fade">
              {job.start} — {job.end || <span className="timeline__present">Present</span>}
            </div>
            <h3 className="timeline__role" data-reveal="left">
              {job.role}
            </h3>
            <p className="timeline__company" data-reveal="left">
              {job.company}
            </p>
            <p className="timeline__summary" data-reveal>
              {job.summary}
            </p>

            <div className="tgroups">
              {job.groups.map((g, gi) => (
                <div key={g.title} className="tgroup">
                  <span className="timeline__node timeline__node--sub" data-reveal="pop" aria-hidden="true" />
                  <h4 className="tgroup__title mono" data-reveal="fade">
                    {g.title}
                  </h4>
                  <ul>
                    {g.items.map((r) => (
                      <li key={r} data-reveal={gi % 2 ? 'right' : 'left'}>
                        <ArrowRight className="tgroup__arrow" size={14} aria-hidden="true" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
