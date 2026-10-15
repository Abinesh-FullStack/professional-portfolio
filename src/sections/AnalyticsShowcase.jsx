import { useEffect, useMemo, useRef, useState } from 'react'
import { sampleKpis, sampleSeries, months, sampleDepartments, analyticsSteps } from '../data/analytics'
import SectionHeading from '../components/SectionHeading'
import Button from '../components/Button'
import { gsap } from '../lib/gsap'

/* ── Line chart: one series at a time, switchable, crosshair + tooltip ──── */
function TrendChart({ metric }) {
  const series = sampleSeries[metric]
  const [hover, setHover] = useState(null)
  const [vals, setVals] = useState(series.values)
  const [scale, setScale] = useState({ min: series.min, max: series.max })
  const tweenRef = useRef({ values: [...series.values], min: series.min, max: series.max })

  // Morph values + scale when the metric changes (instant under reduced motion).
  useEffect(() => {
    const t = tweenRef.current
    const to = { min: series.min, max: series.max }
    series.values.forEach((v, i) => (to[`v${i}`] = v))
    const obj = { min: t.min, max: t.max }
    t.values.forEach((v, i) => (obj[`v${i}`] = v))
    const commit = () => {
      t.values = series.values.map((_, i) => obj[`v${i}`])
      t.min = obj.min
      t.max = obj.max
      setVals(t.values)
      setScale({ min: t.min, max: t.max })
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      Object.assign(obj, to)
      commit()
      return
    }
    const tw = gsap.to(obj, { ...to, duration: 0.7, ease: 'power3.inOut', onUpdate: commit })
    return () => tw.kill()
  }, [series])

  const W = 560
  const H = 220
  const P = { l: 40, r: 16, t: 16, b: 28 }
  const xs = (i) => P.l + (i * (W - P.l - P.r)) / (vals.length - 1)
  const ys = (v) => P.t + ((scale.max - v) * (H - P.t - P.b)) / (scale.max - scale.min)
  const d = vals.map((v, i) => `${i ? 'L' : 'M'}${xs(i).toFixed(1)},${ys(v).toFixed(1)}`).join(' ')
  const area = `${d} L${xs(vals.length - 1)},${H - P.b} L${xs(0)},${H - P.b} Z`

  const onMove = (e) => {
    const box = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - box.left) / box.width) * W
    const i = Math.round(((x - P.l) / (W - P.l - P.r)) * (vals.length - 1))
    setHover(Math.max(0, Math.min(vals.length - 1, i)))
  }
  const hv = hover != null ? series.values[hover] : null

  return (
    <div className="chart__wrap">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="chart__svg"
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
        role="img"
        aria-label={`Line chart of sample monthly ${series.label.toLowerCase()} in ${series.unit}.`}
      >
        <defs>
          <linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {series.ticks.map((t) => (
          <g key={t}>
            <line className="chart__grid" x1={P.l} x2={W - P.r} y1={ys(t)} y2={ys(t)} />
            <text className="chart__axis" x={P.l - 8} y={ys(t) + 4} textAnchor="end">{t}</text>
          </g>
        ))}
        {months.map((m, i) =>
          i % 2 === 0 ? (
            <text key={m} className="chart__axis" x={xs(i)} y={H - 8} textAnchor="middle">{m}</text>
          ) : null,
        )}
        <path d={area} fill="url(#areaFill)" />
        <path d={d} className="chart__line" />
        {hv != null && (
          <g>
            <line className="chart__cross" x1={xs(hover)} x2={xs(hover)} y1={P.t} y2={H - P.b} />
            <circle className="chart__dot" cx={xs(hover)} cy={ys(vals[hover])} r="5" />
          </g>
        )}
      </svg>
      {hv != null && (
        <div className="chart__tip" style={{ left: `${(xs(hover) / W) * 100}%`, top: `${(ys(vals[hover]) / H) * 100}%` }}>
          <span className="mono">{months[hover]} · sample</span>
          <strong>
            {hv.toFixed(series.decimals)} {series.unit}
          </strong>
        </div>
      )}
    </div>
  )
}

/* ── Horizontal bars: single series, per-bar hover ─────────────────────── */
function DepartmentChart() {
  const [hover, setHover] = useState(null)
  const max = useMemo(() => Math.max(...sampleDepartments.map((d) => d.v)), [])
  return (
    <ul className="hbars">
      {sampleDepartments.map((d, i) => (
        <li
          key={d.d}
          className={hover === i ? 'is-hover' : hover != null ? 'is-dim' : ''}
          onPointerEnter={() => setHover(i)}
          onPointerLeave={() => setHover(null)}
        >
          <span className="hbars__label">{d.d}</span>
          <span className="hbars__track">
            <span className="hbars__bar" style={{ '--w': `${(d.v / max) * 100}%` }} />
          </span>
          <span className="hbars__value mono">{d.v}</span>
        </li>
      ))}
    </ul>
  )
}

export default function AnalyticsShowcase() {
  const [metric, setMetric] = useState('attendance')

  return (
    <section id="analytics" className="section analytics" aria-labelledby="analytics-title">
      <div className="container analytics__grid">
        <div className="analytics__copy">
          <SectionHeading index="05" label="Data Analytics" title="Data," accent="made useful." id="analytics-title">
            <p>
              Analytics is part of how I work, not an add-on: clean data, honest analysis, and a clear story that helps
              someone decide. The dashboard is a live demo built with sample data.
            </p>
          </SectionHeading>

          <ol className="steps">
            {analyticsSteps.map((s, i) => (
              <li key={s.title} data-reveal="left">
                <span className="steps__idx mono">0{i + 1}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div data-reveal>
            <Button to="project-ai-data-analyst" variant="ghost">View the AI Data Analyst project</Button>
          </div>
        </div>

        <div className="dash">
          <div className="dash__bar" data-reveal="fade">
            <span className="dash__dots" aria-hidden="true"><i /><i /><i /></span>
            <span className="mono">hr-overview · sample-dataset.csv</span>
            <span className="sample-badge">Sample data</span>
          </div>

          <div className="dash__kpis">
            {sampleKpis.map((k) => (
              <div className="kpi" key={k.label} data-reveal="panel">
                <span className="kpi__label">{k.label}</span>
                <strong className="kpi__value">
                  <span data-count={k.value} data-decimals={k.decimals}>
                    {k.value.toFixed(k.decimals)}
                  </span>
                  {k.suffix}
                </strong>
                <span className="kpi__note mono">{k.note}</span>
              </div>
            ))}
          </div>

          <div className="dash__charts">
            <figure className="chart" data-reveal="panel">
              <figcaption className="chart__title">
                <span>Monthly trend</span>
                <span className="seg" role="group" aria-label="Choose sample metric">
                  {Object.entries(sampleSeries).map(([key, s]) => (
                    <button
                      key={key}
                      type="button"
                      className={metric === key ? 'is-active' : ''}
                      aria-pressed={metric === key}
                      onClick={() => setMetric(key)}
                    >
                      {s.label}
                    </button>
                  ))}
                </span>
              </figcaption>
              <TrendChart metric={metric} />
            </figure>
            <figure className="chart" data-reveal="panel">
              <figcaption className="chart__title">
                <span>Headcount by department</span>
                <span className="mono chart__unit">people</span>
              </figcaption>
              <DepartmentChart />
            </figure>
          </div>

          <p className="dash__disclaimer mono">Illustrative demonstration data — not real business results.</p>

          <div className="sr-only">
          <table>
            <caption>Sample monthly values</caption>
            <thead>
              <tr>
                <th scope="col">Month</th>
                {Object.values(sampleSeries).map((s) => (
                  <th scope="col" key={s.label}>{s.label} ({s.unit})</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {months.map((m, i) => (
                <tr key={m}>
                  <td>{m}</td>
                  {Object.values(sampleSeries).map((s) => (
                    <td key={s.label}>{s.values[i]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </section>
  )
}
