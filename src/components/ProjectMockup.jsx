/**
 * Locally drawn, illustrative interface previews (no stock imagery).
 * Each is pure HTML/CSS so it stays crisp at any size and weighs nothing.
 */

function Chrome({ title, children }) {
  return (
    <div className="mock">
      <div className="mock__bar">
        <span /><span /><span />
        <em>{title}</em>
      </div>
      <div className="mock__body">{children}</div>
    </div>
  )
}

function Hrms() {
  const rows = [
    ['EMP-1042', 'Present', 'ok'],
    ['EMP-1043', 'On leave', 'warn'],
    ['EMP-1044', 'Present', 'ok'],
    ['EMP-1045', 'Remote', 'info'],
    ['EMP-1046', 'Present', 'ok'],
  ]
  return (
    <Chrome title="hrms / attendance">
      <div className="mk-hrms">
        <aside className="mk-side">
          <b />
          {['Dashboard', 'Employees', 'Attendance', 'Leave', 'Reports'].map((l, i) => (
            <i key={l} className={i === 2 ? 'on' : ''}>{l}</i>
          ))}
        </aside>
        <div className="mk-main">
          <div className="mk-kpis">
            <div><small>Present</small><strong>—</strong></div>
            <div><small>On leave</small><strong>—</strong></div>
            <div><small>Requests</small><strong>—</strong></div>
          </div>
          <div className="mk-table">
            {rows.map(([id, st, tone]) => (
              <div key={id} className="mk-row">
                <span className="mk-avatar" />
                <span className="mk-line" />
                <code>{id}</code>
                <span className={`mk-badge mk-badge--${tone}`}>{st}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Chrome>
  )
}

function Analyst() {
  const bars = [38, 62, 48, 80, 56, 70, 44]
  return (
    <Chrome title="analyst / workspace">
      <div className="mk-analyst">
        <div className="mk-drop">
          <span className="mk-drop__icon">↑</span>
          <span>dataset.csv</span>
          <small>Upload · Clean · Explore</small>
        </div>
        <div className="mk-chart">
          {bars.map((h, i) => (
            <span key={i} style={{ height: `${h}%` }} />
          ))}
        </div>
        <div className="mk-prompt">
          <span>Ask about your data…</span>
          <em>planned</em>
        </div>
      </div>
    </Chrome>
  )
}

function Crud() {
  return (
    <Chrome title="records / new">
      <div className="mk-crud">
        <div className="mk-form">
          {['Name', 'Email', 'Department'].map((l) => (
            <label key={l}>
              <small>{l}</small>
              <span />
            </label>
          ))}
          <div className="mk-btns"><b>Save</b><i>Cancel</i></div>
        </div>
        <div className="mk-list">
          {['POST', 'GET', 'PUT', 'DELETE'].map((m) => (
            <div key={m} className="mk-list__row">
              <code className={`mk-method mk-method--${m.toLowerCase()}`}>{m}</code>
              <span className="mk-line" />
            </div>
          ))}
        </div>
      </div>
    </Chrome>
  )
}

function Attrition() {
  const pts = [
    [12, 70], [20, 62], [28, 74], [34, 50], [42, 58], [48, 40], [55, 46],
    [60, 30], [66, 36], [72, 24], [80, 28], [86, 16], [24, 40], [70, 60],
  ]
  return (
    <Chrome title="attrition / exploration">
      <div className="mk-attr">
        <svg viewBox="0 0 100 80" className="mk-scatter" aria-hidden="true">
          {[20, 40, 60].map((y) => <line key={y} x1="4" x2="96" y1={y} y2={y} />)}
          {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.2" />)}
          <path d="M8 72 Q 50 48 94 14" />
        </svg>
        <div className="mk-gauge">
          <small>Risk score</small>
          <div className="mk-gauge__bar"><span /></div>
          <em>concept</em>
        </div>
      </div>
    </Chrome>
  )
}

function Testing() {
  const cases = [
    ['TC-001', 'Login with valid credentials', 'pass'],
    ['TC-002', 'Login with invalid password', 'pass'],
    ['TC-003', 'Leave request — date range', 'fail'],
    ['TC-004', 'API: GET /employees', 'pass'],
    ['TC-005', 'Regression — attendance export', 'run'],
  ]
  return (
    <Chrome title="test-suite / run">
      <div className="mk-test">
        {cases.map(([id, name, st]) => (
          <div key={id} className="mk-test__row">
            <code>{id}</code>
            <span>{name}</span>
            <b className={`mk-st mk-st--${st}`}>{st}</b>
          </div>
        ))}
        <div className="mk-bug">
          <strong>BUG</strong> Leave end date accepts a past date · <em>severity: medium</em>
        </div>
      </div>
    </Chrome>
  )
}

const MAP = { hrms: Hrms, analyst: Analyst, crud: Crud, attrition: Attrition, testing: Testing }

export default function ProjectMockup({ type }) {
  const Cmp = MAP[type] || Hrms
  return <Cmp />
}
