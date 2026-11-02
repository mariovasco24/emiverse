import { useEffect, useRef, type ReactNode } from 'react'
import GameButton from './GameButton'
import { X } from 'lucide-react'
export default function WorldDialog({
  title,
  onClose,
  children,
  className = '',
}: {
  title: string
  onClose: () => void
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const backdropPress = useRef(false)
  useEffect(() => {
    const d = ref.current!
    d.showModal()
    return () => d.close()
  }, [])
  return (
    <dialog
      className={`world-dialog ${className}`}
      ref={ref}
      aria-label={title}
      onCancel={onClose}
      onPointerDown={(e) => {
        backdropPress.current = e.target === ref.current
      }}
      onPointerUp={(e) => {
        if (backdropPress.current && e.target === ref.current) onClose()
        backdropPress.current = false
      }}
    >
      <GameButton className="world-dialog-close" onPress={onClose} aria-label="Cerrar">
        <X size={20} />
      </GameButton>
      <span className="world-eyebrow">HECHO PARA IMAGINAR</span>
      <h2>{title}</h2>
      {children}
    </dialog>
  )
}
