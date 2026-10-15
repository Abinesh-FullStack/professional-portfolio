import SectionHeading from '../components/SectionHeading'
import SkillGrid from '../components/SkillGrid'

/** 03 — Tech Stack. A normal (non-pinned) section, so it can never be hidden behind the photo stage. */
export default function Skills() {
  return (
    <section id="skills" className="section skills" aria-labelledby="skills-title">
      <div className="container">
        <SectionHeading size="lg" index="03" label="Tech Stack" title="Tools I Use to" accent="Build and Improve." id="skills-title">
          <p>Grouped by where each tool fits in the work. Hover or focus a tool to see how I use it — no percentages.</p>
        </SectionHeading>
        <SkillGrid />
      </div>
    </section>
  )
}
