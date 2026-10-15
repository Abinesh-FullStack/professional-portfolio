import RevealText from './RevealText'

/**
 * Editorial section heading: mono index + label, split-word title, optional lead.
 * `title` is a string; `accent` adds a serif italic run after it.
 */
export default function SectionHeading({ index, label, title, accent, id, as = 'h2', children, className = '', size }) {
  return (
    <header className={`sh ${size === 'lg' ? 'sh--lg' : ''} ${className}`}>
      <p className="eyebrow" data-reveal="fade">
        <span className="eyebrow__index">{index}</span>
        <span className="eyebrow__rule" data-reveal="line" aria-hidden="true" />
        <span>{label}</span>
      </p>
      <RevealText as={as} id={id} className="sh__title" parts={accent ? [title, { accent }] : [title]} />
      {children && (
        <div className="sh__lead" data-reveal>
          {children}
        </div>
      )}
    </header>
  )
}
