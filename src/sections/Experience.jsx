import { experience } from '../data/profile'
import RevealText from '../components/RevealText'
import ExperienceTimeline from '../components/ExperienceTimeline'
import PhotoFrame from '../components/PhotoFrame'

/**
 * 02 — Experience. On desktop the text sits on the LEFT while Photo 2 is shown on
 * the RIGHT by the scroll-story stage. On mobile Photo 2 appears inline here.
 */
export default function Experience() {
  return (
    <section id="experience" className="chapter chapter--experience" aria-labelledby="experience-title">
      <div className="container chapter__grid">
        <div className="chapter__body">
          <p className="eyebrow" data-reveal="fade">
            <span className="eyebrow__index">02</span>
            <span className="eyebrow__rule" data-reveal="line" aria-hidden="true" />
            <span>Experience</span>
          </p>
          <RevealText
            as="h2"
            id="experience-title"
            className="display-xl display-lg"
            parts={['Building Experience', { accent: 'Through Real Work.' }]}
          />
          <p className="chapter__lead" data-reveal>
            One role so far, with a broad scope — from interfaces and APIs to databases, testing and data work.
          </p>
          {/* Mobile / tablet / no-JS: Photo 2 inline. On desktop it is revealed in the stage. */}
          <PhotoFrame variant="photo2" className="section-photo" data-reveal="clip" />
          <ExperienceTimeline items={experience} />
        </div>
      </div>
    </section>
  )
}
