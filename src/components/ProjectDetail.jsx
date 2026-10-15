import { useEffect, useRef } from 'react'
import { ArrowUpRight, CircleCheck, CircleDashed, LoaderCircle, X } from 'lucide-react'
import { categories } from '../data/projects'
import ScaledMockup from './ScaledMockup'
import { GithubIcon } from './Icon'

const STATE = {
  done: { Icon: CircleCheck, label: 'Implemented' },
  'in-progress': { Icon: LoaderCircle, label: 'In progress' },
  planned: { Icon: CircleDashed, label: 'Planned' },
}

/**
 * Side drawer with the full project story (objective, role, feature status,
 * full stack, links). Native <dialog> gives focus trapping, Escape and inert
 * background for free; focus returns to the card that opened it.
 */
export default function ProjectDetail({ project, onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    const dlg = ref.current
    if (!dlg) return
    if (project && !dlg.open) {
      dlg.showModal()
      document.documentElement.classList.add('has-dialog')
    }
    if (!project && dlg.open) dlg.close()
  }, [project])

  useEffect(() => {
    const dlg = ref.current
    const onCloseEvt = () => {
      document.documentElement.classList.remove('has-dialog')
      onClose()
    }
    dlg.addEventListener('close', onCloseEvt)
    return () => dlg.removeEventListener('close', onCloseEvt)
  }, [onClose])

  const cat = project ? categories[project.category] : null

  return (
    <dialog
      ref={ref}
      className={`drawer ${cat ? `pcard--${cat.tone}` : ''}`}
      aria-labelledby="drawer-title"
      onClick={(e) => {
        if (e.target === ref.current) ref.current.close() // backdrop click
      }}
    >
      {project && (
        <div className="drawer__inner">
          <div className="drawer__top">
            <span className="mono drawer__cat">
              <span className="pcard__dot" aria-hidden="true" /> {cat.label} · {project.status}
            </span>
            <button type="button" className="drawer__close" onClick={() => ref.current.close()} aria-label="Close project details">
              <X size={20} />
            </button>
          </div>

          <h2 id="drawer-title" className="drawer__title">{project.title}</h2>

          <div className="drawer__preview">
            {project.image ? (
              <img src={project.image} alt={`Screenshot of ${project.title}`} />
            ) : (
              <div className="pcard__mock" role="img" aria-label={`Illustrative interface mockup for ${project.title}`}>
                <ScaledMockup type={project.mockup} />
              </div>
            )}
            {!project.image && <span className="drawer__label mono">Illustrative mockup</span>}
          </div>

          <h3 className="drawer__h mono">Objective</h3>
          <p>{project.objective}</p>

          <h3 className="drawer__h mono">My role</h3>
          <p>{project.contribution}</p>

          <h3 className="drawer__h mono">Features</h3>
          <ul className="drawer__features">
            {project.features.map((f) => {
              const s = STATE[f.state] || STATE.planned
              return (
                <li key={f.label} className={`feat feat--${f.state}`}>
                  <s.Icon size={15} strokeWidth={1.75} aria-hidden="true" />
                  <span>{f.label}</span>
                  <span className="feat__state mono">{s.label}</span>
                </li>
              )
            })}
          </ul>

          <h3 className="drawer__h mono">Stack</h3>
          <ul className="pcard__tags">
            {project.stack.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>

          <div className="drawer__actions">
            {project.github && (
              <a className="btn btn--primary" href={project.github} target="_blank" rel="noopener noreferrer">
                <span className="btn__label">View code</span>
                <span className="btn__icon" aria-hidden="true"><GithubIcon size={16} /></span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
            {project.demo && (
              <a className="btn btn--ghost" href={project.demo} target="_blank" rel="noopener noreferrer">
                <span className="btn__label">Live demo</span>
                <span className="btn__icon" aria-hidden="true"><ArrowUpRight size={16} /></span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
            {!project.github && !project.demo && (
              <p className="drawer__note mono">Repository and demo links will be added here.</p>
            )}
          </div>
        </div>
      )}
    </dialog>
  )
}
