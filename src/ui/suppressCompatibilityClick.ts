let removePrevious: (() => void) | undefined
/** A handled pointer release must not click through into a newly opened/closed menu. */
export function suppressCompatibilityClick() {
  removePrevious?.()
  const clear = () => {
    document.removeEventListener('click', ignore, true)
    document.removeEventListener('pointerdown', clear, true)
    window.clearTimeout(timer)
    removePrevious = undefined
  }
  const ignore = (event: MouseEvent) => {
    // Keyboard and assistive-technology activation do not belong to the pointer gesture.
    if (event.detail === 0 && (event as PointerEvent).pointerType !== 'touch') return
    event.preventDefault()
    event.stopImmediatePropagation()
    clear()
  }
  const timer = window.setTimeout(clear, 500)
  removePrevious = clear
  document.addEventListener('click', ignore, true)
  // The next genuine press starts a new gesture and must always remain usable.
  document.addEventListener('pointerdown', clear, { once: true, capture: true })
}
