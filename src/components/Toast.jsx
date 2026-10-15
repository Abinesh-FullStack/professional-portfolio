import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'

/** Tiny confirmation toast (e.g. "Email copied"). Polite live region. */
export default function Toast() {
  const [msg, setMsg] = useState('')
  const [key, setKey] = useState(0)

  useEffect(() => {
    let t = 0
    const on = (e) => {
      setMsg(e.detail)
      setKey((k) => k + 1)
      clearTimeout(t)
      t = setTimeout(() => setMsg(''), 2200)
    }
    window.addEventListener('toast', on)
    return () => {
      window.removeEventListener('toast', on)
      clearTimeout(t)
    }
  }, [])

  return (
    <div className="toast-region" role="status" aria-live="polite">
      {msg && (
        <div className="toast" key={key}>
          <Check size={16} aria-hidden="true" />
          {msg}
        </div>
      )}
    </div>
  )
}
