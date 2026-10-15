import { useLayoutEffect, useRef } from 'react'

/** Segmented filter with a sliding indicator. Buttons use aria-pressed. */
export default function ProjectFilter({ filters, value, counts, onChange }) {
  const wrapRef = useRef(null)

  useLayoutEffect(() => {
    const wrap = wrapRef.current
    const place = () => {
      const btn = wrap?.querySelector('.is-active')
      if (!btn) return
      wrap.style.setProperty('--ind-x', `${btn.offsetLeft}px`)
      wrap.style.setProperty('--ind-y', `${btn.offsetTop}px`)
      wrap.style.setProperty('--ind-w', `${btn.offsetWidth}px`)
      wrap.style.setProperty('--ind-h', `${btn.offsetHeight}px`)
    }
    place()
    const ro = new ResizeObserver(place)
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [value])

  return (
    <div ref={wrapRef} className="filters" role="group" aria-label="Filter projects by category" data-reveal="fade">
      <span className="filters__ind" aria-hidden="true" />
      {filters.map((f) => (
        <button
          key={f.id}
          type="button"
          className={`filter ${value === f.id ? 'is-active' : ''}`}
          aria-pressed={value === f.id}
          onClick={() => onChange(f.id)}
        >
          {f.label}
          <span className="filter__count">{counts[f.id]}</span>
        </button>
      ))}
    </div>
  )
}
