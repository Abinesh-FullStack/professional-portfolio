/**
 * Renders text as masked words so headings can rise into view word-by-word
 * (animated by useMotion via [data-split]). Without JS the words simply show.
 *
 * `parts` lets a heading mix plain and serif-accent runs:
 *   <RevealText as="h2" parts={['How I', { accent: 'work' }]} />
 */
export default function RevealText({ as: Tag = 'h2', parts, text, className = '', ...rest }) {
  const runs = parts || [text]
  let i = 0

  const words = (str, accent) =>
    str
      .split(/(\s+|\n)/)
      .filter((w) => w !== '')
      .map((w) => {
        if (w === '\n') return <br key={`br${i++}`} />
        if (/^\s+$/.test(w)) return ' '
        const k = i++
        return (
          <span className="rt-mask" key={k}>
            <span className={`rt-word ${accent ? 'serif-accent' : ''}`} style={{ '--i': k }}>
              {w}
            </span>
          </span>
        )
      })

  // Accessible name stays the plain sentence.
  const label = runs.map((r) => (typeof r === 'string' ? r : r.accent)).join(' ').replace(/\s+/g, ' ').trim()

  return (
    <Tag className={`rt ${className}`} data-split aria-label={label} {...rest}>
      <span aria-hidden="true">
        {runs.map((r) => (typeof r === 'string' ? words(r, false) : words(` ${r.accent}`, true)))}
      </span>
    </Tag>
  )
}
