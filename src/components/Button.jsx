import { useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { scrollToId } from '../lib/gsap'
import { useMagnetic } from '../hooks/useMagnetic'

/**
 * One button component for every CTA.
 * - `to`       → scrolls to an in-page section id
 * - `href`     → regular link (external links open in a new tab)
 * - `onClick`  → plain button
 * - `magnetic` → subtle magnetic pull (major CTAs only)
 */
export default function Button({
  to,
  href,
  onClick,
  variant = 'primary',
  icon = true,
  magnetic = false,
  children,
  className = '',
  ...rest
}) {
  const ref = useRef(null)
  useMagnetic(magnetic ? ref : { current: null })

  const cls = `btn btn--${variant} ${className}`.trim()
  const inner = (
    <>
      <span className="btn__label">{children}</span>
      {icon && (
        <span className="btn__icon" aria-hidden="true">
          {icon === true ? <ArrowUpRight size={18} strokeWidth={1.75} /> : icon}
        </span>
      )}
    </>
  )

  if (to) {
    return (
      <a
        ref={ref}
        href={`#${to}`}
        className={cls}
        onClick={(e) => {
          e.preventDefault()
          scrollToId(to)
        }}
        {...rest}
      >
        {inner}
      </a>
    )
  }

  if (!href) {
    return (
      <button ref={ref} type="button" className={cls} onClick={onClick} {...rest}>
        {inner}
      </button>
    )
  }

  const external = /^https?:/.test(href)
  return (
    <a
      ref={ref}
      href={href}
      className={cls}
      onClick={onClick}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      {inner}
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  )
}
