import { useEffect, useRef } from 'react'
export function useAmbientMusic(sound: boolean, music: boolean, blocked: boolean) {
  const audio = useRef<AudioContext | null>(null)
  useEffect(() => {
    if (!sound || !music || blocked) return
    let index = 0
    function note() {
      try {
        audio.current ??= new AudioContext()
        const ctx = audio.current
        void ctx.resume()
        const oscillator = ctx.createOscillator(),
          gain = ctx.createGain()
        oscillator.type = 'sine'
        oscillator.frequency.value = [261.63, 329.63, 392, 523.25, 392, 329.63][index++ % 6]
        oscillator.connect(gain)
        gain.connect(ctx.destination)
        gain.gain.setValueAtTime(0.05, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
        oscillator.start()
        oscillator.stop(ctx.currentTime + 0.5)
      } catch {
        /* Optional audio, movement always works. */
      }
    }
    note()
    const interval = setInterval(note, 600)
    return () => clearInterval(interval)
  }, [sound, music, blocked])
  useEffect(
    () => () => {
      void audio.current?.close()
    },
    [],
  )
}
