import { forwardRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { categories } from '../data/projects'
import ScaledMockup from './ScaledMockup'
import { GithubIcon } from './Icon'

const MAX_TAGS = 4

/** Medium-sized project card. The whole card opens the detail drawer. */
const ProjectCard = forwardRef(function ProjectCard({ project, index, hidden, onOpen }, ref) {
  const cat = categories[project.category]
  const extra = project.stack.length - MAX_TAGS

  return (
    <article
      ref={ref}
      id={`project-${project.id}`}
      className={`pcard pcard--${cat.tone} ${hidden ? 'is-hidden' : ''}`}
      aria-labelledby={`pt-${project.id}`}
      data-cursor="card"
      data-flip-id={project.id}
    >
      <div className="pcard__preview" data-reveal="clip">
        {project.image ? (
          <img src={project.image} alt={`Screenshot of ${project.title}`} loading="lazy" decoding="async" />
        ) : (
          <div className="pcard__mock" role="img" aria-label={`Illustrative interface mockup for ${project.title}`}>
            <ScaledMockup type={project.mockup} />
          </div>
        )}
        <span className="pcard__status">{project.status}</span>
      </div>

      <div className="pcard__body">
        <div className="pcard__meta mono">
          <span>{String(index + 1).padStart(2, '0')}</span>
          <span className="pcard__cat">
            <span className="pcard__dot" aria-hidden="true" />
            {cat.label}
          </span>
        </div>

        <h3 id={`pt-${project.id}`} className="pcard__title">
          <button type="button" className="pcard__open" onClick={() => onOpen(project)} aria-haspopup="dialog">
            {project.title}
            <span className="sr-only"> — view details</span>
          </button>
          <ArrowUpRight className="pcard__arrow" size={20} strokeWidth={1.5} aria-hidden="true" />
        </h3>

        <p className="pcard__summary">{project.summary}</p>

        <ul className="pcard__tags" aria-label="Technology stack">
          {project.stack.slice(0, MAX_TAGS).map((t) => (
            <li key={t}>{t}</li>
          ))}
          {extra > 0 && <li aria-label={`and ${extra} more`}>+{extra}</li>}
        </ul>

        <div className="pcard__actions">
          {project.github && (
            <a className="pcard__link" href={project.github} target="_blank" rel="noopener noreferrer">
              <GithubIcon size={14} /> Code<span className="sr-only"> for {project.title} (opens in a new tab)</span>
            </a>
          )}
          {project.demo && (
            <a className="pcard__link" href={project.demo} target="_blank" rel="noopener noreferrer">
              Live demo<span className="sr-only"> of {project.title} (opens in a new tab)</span>
            </a>
          )}
          {!project.github && !project.demo && <span className="pcard__pending mono">Links coming soon</span>}
          <span className="pcard__more mono" aria-hidden="true">Details</span>
        </div>
      </div>
    </article>
  )
})

export default ProjectCard
