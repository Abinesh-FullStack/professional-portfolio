import { useLayoutEffect, useRef } from 'react'
import ProjectMockup from './ProjectMockup'

const DESIGN_WIDTH = 560

/**
 * Renders a mockup at a fixed design width and scales it to the container,
 * so previews stay crisp and proportional at any card size.
 */
export default function ScaledMockup({ type }) {
  const boxRef = useRef(null)

  useLayoutEffect(() => {
    const box = boxRef.current
    if (!box) return
    const apply = () => box.style.setProperty('--mock-scale', String(box.clientWidth / DESIGN_WIDTH))
    apply()
    const ro = new ResizeObserver(apply)
    ro.observe(box)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={boxRef} className="mock-scale">
      <div className="mock-scale__inner" style={{ width: DESIGN_WIDTH }}>
        <ProjectMockup type={type} />
      </div>
    </div>
  )
}
