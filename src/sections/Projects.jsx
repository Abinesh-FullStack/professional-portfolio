import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Flip } from 'gsap/Flip'
import { projects, projectFilters } from '../data/projects'
import ProjectCard from '../components/ProjectCard'
import ProjectFilter from '../components/ProjectFilter'
import ProjectDetail from '../components/ProjectDetail'
import SectionHeading from '../components/SectionHeading'
import { gsap, ScrollTrigger } from '../lib/gsap'

gsap.registerPlugin(Flip)

const matches = (p, f) => f === 'all' || p.category === f

export default function Projects() {
  const [filter, setFilter] = useState('all')
  const [open, setOpen] = useState(null)
  const gridRef = useRef(null)
  const flipState = useRef(null)

  const counts = useMemo(
    () => Object.fromEntries(projectFilters.map((f) => [f.id, projects.filter((p) => matches(p, f.id)).length])),
    [],
  )

  // Capture positions BEFORE React re-renders, then animate from them after.
  const changeFilter = (next) => {
    if (next === filter) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    flipState.current = reduce ? null : Flip.getState(gridRef.current.querySelectorAll('.pcard'))
    setFilter(next)
  }

  useLayoutEffect(() => {
    const state = flipState.current
    flipState.current = null
    if (state) {
      // Revealed-on-scroll cards may still be mid-entrance; settle them first.
      const cards = gridRef.current.querySelectorAll('.pcard')
      gsap.set(cards, { clearProps: 'opacity,transform' })
      Flip.from(state, {
        targets: cards,
        duration: 0.6,
        ease: 'power3.inOut',
        absolute: true,
        nested: true,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.45, delay: 0.15 }),
        onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.94, duration: 0.3 }),
        onComplete: () => ScrollTrigger.refresh(),
      })
    } else {
      ScrollTrigger.refresh()
    }
  }, [filter])

  const close = useCallback(() => setOpen(null), [])
  const visible = projects.filter((p) => matches(p, filter)).length

  return (
    <section id="projects" className="section projects" aria-labelledby="projects-title">
      <div className="container">
        <div className="projects__head">
          <SectionHeading size="lg" index="04" label="Projects" title="Selected Work." accent="Practical Solutions." id="projects-title">
            <p>
              Work across full-stack development, analytics and testing — statuses kept honest. Open a card for the full
              story.
            </p>
          </SectionHeading>
          <ProjectFilter filters={projectFilters} value={filter} counts={counts} onChange={changeFilter} />
        </div>

        <p className="sr-only" aria-live="polite">
          {visible} project{visible === 1 ? '' : 's'} shown
        </p>

        <div ref={gridRef} className="projects__grid">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} hidden={!matches(p, filter)} onOpen={setOpen} />
          ))}
        </div>
      </div>

      <ProjectDetail project={open} onClose={close} />
    </section>
  )
}
