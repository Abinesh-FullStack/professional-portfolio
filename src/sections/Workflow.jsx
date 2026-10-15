import SectionHeading from '../components/SectionHeading'

const STEPS = [
  { title: 'Understand the Problem', text: 'Understand requirements, users, and expected outcomes.' },
  { title: 'Design the Solution', text: 'Plan the structure, workflows, data, and interface.' },
  { title: 'Build and Integrate', text: 'Develop responsive interfaces, application logic, APIs, and database integration.' },
  { title: 'Test and Refine', text: 'Validate functionality, resolve issues, and improve reliability.' },
  { title: 'Deliver and Improve', text: 'Prepare the solution for use and iterate based on feedback.' },
]

/**
 * Inverse-tone section. The connecting line is scrubbed by scroll; each step's
 * node lights up as the line reaches it (driven in useMotion).
 */
export default function Workflow() {
  return (
    <section id="process" className="section workflow inverse" aria-labelledby="process-title">
      <div className="container">
        <SectionHeading index="06" label="Process" title="How I" accent="work" id="process-title" />
        <div className="process">
          <span className="process__track" aria-hidden="true">
            <span className="process__fill" />
          </span>
          <ol className="process__list">
            {STEPS.map((s, i) => (
              <li key={s.title} className="process__step">
                <span className="process__node" aria-hidden="true" />
                <span className="process__num" data-reveal="rise">{String(i + 1).padStart(2, '0')}</span>
                <h3 data-reveal>{s.title}</h3>
                <p data-reveal="fade">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
