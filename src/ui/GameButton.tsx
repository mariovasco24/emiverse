import { suppressCompatibilityClick } from './suppressCompatibilityClick'
import { useRef, type ButtonHTMLAttributes } from 'react'
type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> & { onPress: () => void }
/** Activates touch controls directly, with a click/keyboard fallback and no double action. */
export default function GameButton({ onPress, disabled, ...props }: Props) {
  const start = useRef<{ id: number; x: number; y: number } | null>(null)
  const handled = useRef(false)
  return (
    <button
      {...props}
      disabled={disabled}
      onPointerDown={(e) => {
        handled.current = false
        if (e.isPrimary && !disabled)
          start.current = { id: e.pointerId, x: e.clientX, y: e.clientY }
      }}
      onPointerUp={(e) => {
        const press = start.current
        start.current = null
        if (e.pointerType !== 'touch' || !press || press.id !== e.pointerId || disabled) return
        handled.current = true
        if (Math.hypot(e.clientX - press.x, e.clientY - press.y) > 10) return
        e.preventDefault()
        suppressCompatibilityClick()
        onPress()
      }}
      onPointerCancel={() => {
        start.current = null
        handled.current = true
      }}
      onClick={(e) => {
        if (e.detail === 0 || !handled.current) {
          handled.current = false
          onPress()
        }
      }}
    />
  )
}
