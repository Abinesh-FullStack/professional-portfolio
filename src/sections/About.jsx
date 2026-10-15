import { profile } from '../data/profile'
import { GithubIcon, LinkedinIcon } from '../components/Icon'
import RevealText from '../components/RevealText'

/**
 * 01 — About Me. On desktop the text sits on the RIGHT while Photo 1 is held on
 * the LEFT by the scroll-story stage. On mobile it is a normal stacked section.
 */
export default function About() {
  const info = [
    ['Name', profile.name],
    ['Role', profile.currentRole],
    ['Company', profile.company],
    ['Since', profile.experienceStart],
    ['Focus', profile.roles.join(' · ')],
    ['Location', profile.location],
  ].filter(([, v]) => v)

  return (
    <section id="about" className="chapter chapter--about" aria-labelledby="about-title">
      <div className="container chapter__grid">
        <div className="chapter__body chapter__body--right">
          <p className="eyebrow" data-reveal="fade">
            <span className="eyebrow__index">01</span>
            <span className="eyebrow__rule" data-reveal="line" aria-hidden="true" />
            <span>About Me</span>
          </p>
          <RevealText
            as="h2"
            id="about-title"
            className="display-xl"
            parts={[profile.about.title, { accent: profile.about.titleAccent }]}
          />

          <div className="about__copy">
            {profile.about.paragraphs.map((p, i) => (
              <p key={i} data-reveal>
                <span className="about__num mono" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                {p}
              </p>
            ))}
          </div>

          <ul className="chips" aria-label="Focus areas">
            {profile.about.labels.map((l) => (
              <li className="chip" key={l} data-reveal="rise">
                {l}
              </li>
            ))}
          </ul>

          <aside className="info-panel" aria-label="Professional profile" data-reveal>
            <div className="info-panel__head">
              <span className="mono">Profile</span>
              <span className="info-panel__live">
                <span className="status__dot" aria-hidden="true" /> {profile.availability || `At ${profile.companyShort}`}
              </span>
            </div>
            <dl className="info-panel__list">
              {info.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <div className="info-panel__links">
              <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">
                <LinkedinIcon size={16} /> LinkedIn<span className="sr-only"> (opens in a new tab)</span>
              </a>
              <a href={profile.links.github} target="_blank" rel="noopener noreferrer">
                <GithubIcon size={16} /> GitHub<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
