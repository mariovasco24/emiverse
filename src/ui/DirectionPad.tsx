import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react'
import type { Point } from '../domain/layout'
type Props = {
  disabled: boolean
  onStart: (direction: Point) => void
  onStop: () => void
  onStep: (direction: Point) => void
}
export default function DirectionPad({ disabled, onStart, onStop, onStep }: Props) {
  return (
    <div className="direction-pad" aria-label="Controles de movimiento">
      {[
        { key: 'up', x: 0, y: -1, icon: <ChevronUp />, label: 'Mover arriba' },
        { key: 'left', x: -1, y: 0, icon: <ChevronLeft />, label: 'Mover izquierda' },
        { key: 'down', x: 0, y: 1, icon: <ChevronDown />, label: 'Mover abajo' },
        { key: 'right', x: 1, y: 0, icon: <ChevronRight />, label: 'Mover derecha' },
      ].map((d) => (
        <button
          key={d.key}
          className={`pad-${d.key}`}
          aria-label={d.label}
          disabled={disabled}
          onPointerDown={(e) => {
            if (!e.isPrimary || e.button !== 0) return
            e.preventDefault()
            e.currentTarget.setPointerCapture(e.pointerId)
            onStart({ x: d.x, y: d.y })
          }}
          onPointerUp={onStop}
          onPointerCancel={onStop}
          onLostPointerCapture={onStop}
          onClick={(e) => {
            if (e.detail === 0) onStep(d)
          }}
        >
          {d.icon}
        </button>
      ))}
      <span className="pad-center">✦</span>
    </div>
  )
}
