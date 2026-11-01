import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, CircleHelp, Heart, Home, Maximize, Map, Gamepad2, Palette, Plus, Sparkles, Sprout, Star, Volume2, VolumeX, X } from 'lucide-react'
import Avatar from './Character'
import Scenery from './Scenery'
import MemoryGame from './MemoryGame'
import { clampPosition, loadWorld, shirtColors, skinColors, type Character } from './world'
import './world.css'
type ObjectId = 'plant' | 'pet' | 'music' | 'art' | 'gift'
const objects: { id: ObjectId; label: string; emoji: string; x: number; y: number; garden: boolean }[] = [
  { id: 'plant', label: 'Arcoflor', emoji: '🪴', x: 25, y: 62, garden: true },
  { id: 'pet', label: 'Nubi', emoji: '🐾', x: 72, y: 76, garden: false },
  { id: 'music', label: 'Música', emoji: '🎵', x: 33, y: 69, garden: false },
  { id: 'art', label: 'Pintar', emoji: '🎨', x: 75, y: 58, garden: true },
  { id: 'gift', label: 'Sorpresa', emoji: '🎁', x: 86, y: 67, garden: false },
]
export default function App() {
  const [save, setSave] = useState(loadWorld)
  const [garden, setGarden] = useState(false)
  const [position, setPosition] = useState({ x: 48, y: 76 })
  const [walking, setWalking] = useState(false)
  const [editor, setEditor] = useState(false)
  const [draft, setDraft] = useState<Character | null>(null)
  const [help, setHelp] = useState(false)
  const [memory, setMemory] = useState(false)
  const [interaction, setInteraction] = useState<ObjectId | null>(null)
  const [toast, setToast] = useState('')
  const [sound, setSound] = useState(false)
  const [music, setMusic] = useState(false)
  const [painting, setPainting] = useState(0)
  const [storageBlocked, setStorageBlocked] = useState(false)
  const [mapOpen, setMapOpen] = useState(false)
  const [hint, setHint] = useState(true)
  const [sceneHeight, setSceneHeight] = useState(760)
  const [playerInset, setPlayerInset] = useState(15)
  const sceneRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return
    const player = scene.querySelector<HTMLElement>('.world-player')
    const observer = new ResizeObserver(() => {
      const { width, height } = scene.getBoundingClientRect()
      if (width) {
        setSceneHeight(height / width * 1200)
        setPlayerInset(Math.min(35, ((player?.getBoundingClientRect().width || 100) / 2 + 8) / width * 100))
      }
    })
    observer.observe(scene)
    if (player) observer.observe(player)
    return () => observer.disconnect()
  }, [memory])
  useEffect(() => { const timer = setTimeout(() => setHint(false), 7000); return () => clearTimeout(timer) }, [])
  const keys = useRef(new Set<string>())
  const direction = useRef({ x: 0, y: 0 })
  const destination = useRef<{ x: number; y: number } | null>(null)
  const audio = useRef<AudioContext | null>(null)
  const character = save.characters.find(c => c.id === save.selected)!
  const blocked = editor || help || interaction !== null || memory || mapOpen
  useEffect(() => { try { localStorage.setItem('emiverse-world-v1', JSON.stringify(save)) } catch { setStorageBlocked(true) } }, [save])
  useEffect(() => { if (!toast) return; const id = setTimeout(() => setToast(''), 3800); return () => clearTimeout(id) }, [toast])
  useEffect(() => {
    if (blocked) { keys.current.clear(); direction.current = { x: 0, y: 0 }; destination.current = null; setWalking(false); return }
    const keydown = (e: KeyboardEvent) => { if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) { e.preventDefault(); keys.current.add(e.key); destination.current = null } }
    const keyup = (e: KeyboardEvent) => keys.current.delete(e.key)
    const clear = () => { keys.current.clear(); direction.current = { x: 0, y: 0 }; destination.current = null; setWalking(false) }
    window.addEventListener('keydown', keydown); window.addEventListener('keyup', keyup); window.addEventListener('blur', clear)
    const visibility = () => { if (document.hidden) clear() }
    document.addEventListener('visibilitychange', visibility)
    let frame: number; let last = 0
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, .04); last = now
      const k = keys.current
      let dx = direction.current.x + (k.has('ArrowRight') || k.has('d') ? 1 : 0) - (k.has('ArrowLeft') || k.has('a') ? 1 : 0)
      let dy = direction.current.y + (k.has('ArrowDown') || k.has('s') ? 1 : 0) - (k.has('ArrowUp') || k.has('w') ? 1 : 0)
      if (dx || dy) destination.current = null
      setPosition(p => {
        if (destination.current && !dx && !dy) {
          const tx = destination.current.x - p.x, ty = destination.current.y - p.y
          if (Math.hypot(tx, ty) < 1) destination.current = null
          else { dx = tx; dy = ty }
        }
        const length = Math.hypot(dx, dy)
        setWalking(length > 0)
        return length ? clampPosition(p.x + dx / length * dt * 22, p.y + dy / length * dt * 22) : p
      })
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('keydown', keydown); window.removeEventListener('keyup', keyup); window.removeEventListener('blur', clear); document.removeEventListener('visibilitychange', visibility); clear() }
  }, [blocked])
  useEffect(() => {
    if (!sound || !music || blocked) return
    let index = 0
    function note() {
      try {
        audio.current ??= new AudioContext(); const ctx = audio.current; void ctx.resume()
        const oscillator = ctx.createOscillator(), gain = ctx.createGain()
        oscillator.type = 'sine'; oscillator.frequency.value = [261.63, 329.63, 392, 523.25, 392, 329.63][index++ % 6]
        oscillator.connect(gain); gain.connect(ctx.destination); gain.gain.setValueAtTime(.05, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .5); oscillator.start(); oscillator.stop(ctx.currentTime + .5)
      } catch { /* Optional audio, movement always works. */ }
    }
    note(); const interval = setInterval(note, 600); return () => clearInterval(interval)
  }, [sound, music, blocked])
  useEffect(() => () => { void audio.current?.close() }, [])
  function edit(newCharacter = false) {
    if (newCharacter && save.characters.length >= 5) { setToast('Tu familia ya tiene 5 personajes. ¡Puedes personalizarlos!'); return }
    setDraft(newCharacter ? { id: crypto.randomUUID(), name: 'Mi personaje', skin: skinColors[1], shirt: shirtColors[2], hair: 'short', accessory: 'none' } : { ...character }); setEditor(true)
  }
  function commitCharacter() {
    if (!draft || !draft.name.trim()) return
    const next = { ...draft, name: draft.name.trim() }
    setSave(s => ({ ...s, selected: next.id, characters: s.characters.some(c => c.id === next.id) ? s.characters.map(c => c.id === next.id ? next : c) : [...s.characters, next] }))
    setEditor(false); setToast(`¡${next.name} está listo para explorar!`)
  }
  function discover(id: ObjectId) {
    setSave(s => ({ ...s, collected: [...new Set([...s.collected, id])], watered: id === 'plant' ? true : s.watered, fed: id === 'pet' ? true : s.fed }))
    if (id === 'music') { setMusic(m => !m); setSound(true) }
    if (id === 'art') setPainting(p => (p + 1) % 3)
    setInteraction(null)
    setToast(id === 'plant' ? '¡Arcoflor floreció gracias a ti! +1 recuerdo' : id === 'pet' ? '¡Nubi está feliz! Gracias por cuidarlo. +1 recuerdo' : id === 'music' ? music ? 'La música descansa por un ratito.' : '¡Tu casa se llena de música!' : id === 'art' ? '¡Una nueva obra de arte, hecha por ti!' : '¡Encontraste una corona! Ya puedes ponértela en el vestidor.')
  }
  function changeScene(next: boolean) { setGarden(next); setPosition({ x: 48, y: 76 }); destination.current = null; setInteraction(null) }
  async function fullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen()
      else setToast('Tu navegador ya usa el espacio disponible. Puedes añadir EmiVerse a tu pantalla de inicio.')
    } catch { setToast('No se pudo activar la pantalla completa en este navegador.') }
  }
  if (memory) return <div className="memory-mode"><div className="memory-return"><button onClick={() => setMemory(false)}><ArrowLeft size={18}/> Volver a mi mundo</button><span>EmiVerse — Created by Emily</span></div><MemoryGame/></div>
  return <div className="world-app game-screen">
    <main className="game-viewport" aria-label="EmiVerse, mundo de juego">
      <div ref={sceneRef} className={`world-scene ${garden ? 'garden-scene' : ''}`} role="region" aria-label={garden ? 'Escenario del jardín' : 'Escenario de la casita'} onPointerDown={e => {
        if (blocked || e.target !== e.currentTarget) return
        setHint(false)
        const r = e.currentTarget.getBoundingClientRect()
        destination.current = clampPosition(((e.clientX - r.left) / r.width * 100 - playerInset) / (1 - playerInset / 50), (e.clientY - r.top) / r.height * 100)
      }}>
        <Scenery garden={garden} height={sceneHeight}/>
        {objects.filter(o => o.garden === garden).map(o => <button key={o.id} className={`scene-object object-${o.id} ${save.collected.includes(o.id) ? 'discovered' : ''}`} style={{ left: `${o.x}%`, top: `${o.y}%`, zIndex: Math.round(o.y) }} onClick={() => { setHint(false); setInteraction(o.id) }} aria-label={`Interactuar con ${o.label}`}><span className="object-art">{o.id === 'pet' ? <Pet fed={save.fed}/> : o.id === 'plant' ? <Plant bloomed={save.watered}/> : o.id === 'art' ? <span className="easel">{['🌈', '🌻', '🦋'][painting]}</span> : o.id === 'music' ? <span className={`record-player ${music ? 'playing' : ''}`}><i/><b>♪</b></span> : <span className="gift-box">✦</span>}</span><span className="object-label">{o.label}<span>{save.collected.includes(o.id) ? '♥' : '+'}</span></span></button>)}
        {!garden && <button className="game-neighbor" style={{ zIndex: 72 }} aria-label="Saludar a Leo" onClick={() => setToast('Leo: ¡Hola! ¿Me ayudas a cuidar a Nubi? ♡')}><Avatar character={{ id: 'leo', name: 'Leo', skin: skinColors[2], shirt: shirtColors[2], hair: 'short', accessory: 'none' }}/><span>Leo</span></button>}
        <div className="world-player" style={{ left: `${playerInset + position.x * (1 - playerInset / 50)}%`, top: `${position.y}%`, zIndex: Math.round(position.y) }} data-x={position.x.toFixed(1)} data-y={position.y.toFixed(1)}><span className="player-name">{character.name}<Heart size={10} fill="currentColor"/></span><Avatar character={character} walking={walking}/></div>
      </div>
    </main>
    <header className="game-hud-top"><div className="game-logo"><span>✦</span><div>EmiVerse<small>Created by Emily</small></div></div><div className="game-status"><button className="memory-count" onClick={() => setMapOpen(true)} aria-label="Mis recuerdos"><Star size={21} fill="currentColor"/>{save.collected.length}<span>/ 5</span></button><button className="round-tool" onClick={() => setSound(s => !s)} aria-label={sound ? 'Desactivar sonido' : 'Activar sonido'}>{sound ? <Volume2/> : <VolumeX/>}</button><button className="round-tool fullscreen-tool" onClick={() => void fullscreen()} aria-label="Pantalla completa"><Maximize/></button><button className="round-tool" onClick={() => setHelp(true)} aria-label="Cómo jugar"><CircleHelp/></button></div></header>
    <nav className="scene-tabs" aria-label="Escenarios"><button className={!garden ? 'chosen' : ''} onClick={() => changeScene(false)}><Home/><span>Casita</span></button><button className={garden ? 'chosen' : ''} onClick={() => changeScene(true)}><Sprout/><span>Jardín</span></button></nav>
    {hint && <div className="game-hint" role="status"><span>☝</span> ¡Toca el suelo para caminar!<button onClick={() => setHint(false)} aria-label="Cerrar pista"><X size={14}/></button></div>}
    <div className="game-controls">
      <div className="direction-pad" aria-label="Controles de movimiento">{[{ key: 'up', x: 0, y: -1, icon: <ChevronUp/>, label: 'Mover arriba' }, { key: 'left', x: -1, y: 0, icon: <ChevronLeft/>, label: 'Mover izquierda' }, { key: 'down', x: 0, y: 1, icon: <ChevronDown/>, label: 'Mover abajo' }, { key: 'right', x: 1, y: 0, icon: <ChevronRight/>, label: 'Mover derecha' }].map(d => <button key={d.key} className={`pad-${d.key}`} aria-label={d.label} disabled={blocked} onPointerDown={e => { e.preventDefault(); setHint(false); e.currentTarget.setPointerCapture(e.pointerId); destination.current = null; direction.current = { x: d.x, y: d.y } }} onPointerUp={() => { direction.current = { x: 0, y: 0 } }} onPointerCancel={() => { direction.current = { x: 0, y: 0 } }} onLostPointerCapture={() => { direction.current = { x: 0, y: 0 } }} onClick={e => { if (e.detail === 0) setPosition(p => clampPosition(p.x + d.x * 4, p.y + d.y * 4)) }}>{d.icon}</button>)}<span className="pad-center">✦</span></div>
      <div className="game-family" aria-label="Mis personajes">{save.characters.map(c => <button key={c.id} className={c.id === save.selected ? 'selected-character' : ''} onClick={() => setSave(s => ({ ...s, selected: c.id }))} aria-label={`Jugar con ${c.name}`} aria-pressed={c.id === save.selected}><Avatar character={c}/></button>)}<button className="create-character" onClick={() => edit(true)} aria-label="Crear personaje"><Plus/></button></div>
      <div className="game-tools"><button className="map-button" onClick={() => setMapOpen(true)} aria-label="Abrir mapa de aventuras"><Map/><span>Aventuras</span></button><button className="memory-button" onClick={() => setMemory(true)} aria-label="¡Vamos a jugar!"><Gamepad2/><span>Memoria</span></button><button className="dress-button" onClick={() => edit()} aria-label="Mi vestidor"><Palette/><span>Vestidor</span></button></div>
    </div>
    <span className="game-signature">EmiVerse — Created by Emily</span>
    {storageBlocked && <p className="world-storage" role="status">Tu navegador bloquea el guardado. Puedes jugar durante esta sesión.</p>}
    {mapOpen && <WorldDialog title="Mi mapa de aventuras" onClose={() => setMapOpen(false)}><p className="map-intro">¡Cinco pequeños descubrimientos te esperan!</p><div className="adventure-list">{objects.map(o => <button key={o.id} onClick={() => { changeScene(o.garden); setMapOpen(false); setInteraction(o.id) }}><span>{o.emoji}</span><div><strong>{o.label}</strong><small>{o.garden ? 'En el jardín' : 'En la casita'}</small></div><b>{save.collected.includes(o.id) ? '★' : <ArrowRight/>}</b></button>)}</div></WorldDialog>}
    {toast && <div className="world-toast" role="status"><Sparkles size={18}/>{toast}<button onClick={() => setToast('')} aria-label="Cerrar aviso"><X size={15}/></button></div>}
    {editor && draft && <WorldDialog title="Un personaje tan único como tú" onClose={() => setEditor(false)}><div className="editor-layout"><div className="editor-avatar"><Avatar character={draft}/><span>¡Hola, soy {draft.name || 'tu personaje'}!</span></div><div className="editor-form"><label className="field-title" htmlFor="character-name">¿Cómo te llamas?</label><input id="character-name" maxLength={16} value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })}/><fieldset><legend>Tono de piel</legend><div className="swatches">{skinColors.map((color, i) => <button key={color} style={{ background: color }} aria-label={`Piel ${i + 1}`} aria-pressed={draft.skin === color} onClick={() => setDraft({ ...draft, skin: color })}>{draft.skin === color ? '✓' : ''}</button>)}</div></fieldset><fieldset><legend>Tu color favorito</legend><div className="swatches">{shirtColors.map((color, i) => <button key={color} style={{ background: color }} aria-label={`Ropa ${i + 1}`} aria-pressed={draft.shirt === color} onClick={() => setDraft({ ...draft, shirt: color })}>{draft.shirt === color ? '✓' : ''}</button>)}</div></fieldset><fieldset><legend>Un peinado con personalidad</legend><div className="option-row">{(['short', 'long', 'buns'] as const).map((hair, i) => <button key={hair} aria-pressed={draft.hair === hair} onClick={() => setDraft({ ...draft, hair })}>{['Cortito', 'Melena', 'Moñitos'][i]}</button>)}</div></fieldset><fieldset><legend>El toque final</legend><div className="option-row">{(['none', 'bow', 'crown'] as const).map((accessory, i) => <button key={accessory} disabled={accessory === 'crown' && !save.collected.includes('gift')} aria-pressed={draft.accessory === accessory} onClick={() => setDraft({ ...draft, accessory })}>{['Natural', 'Lacito', save.collected.includes('gift') ? 'Corona' : 'Corona 🔒'][i]}</button>)}</div></fieldset></div></div><button className="world-primary wide" disabled={!draft.name.trim()} onClick={commitCharacter}>¡A vivir aventuras! <ArrowRight size={17}/></button></WorldDialog>}
    {help && <WorldDialog title="Tu universo cabe en tus manos" onClose={() => setHelp(false)}><div className="help-steps"><p><b>01 · Crea tu protagonista</b>Elige su nombre, colores y peinado en «Mi vestidor». Puedes crear hasta 5 personajes.</p><p><b>02 · Explora a tu manera</b>Toca el suelo o mantén pulsadas las flechas para caminar. También funciona con teclado (flechas o WASD).</p><p><b>03 · Dale vida a tu mundo</b>Toca los objetos con una etiqueta: cuida a Nubi, riega una flor, pinta y encuentra una sorpresa. Cambia entre Casita y Jardín.</p><p><b>04 · Vuelve cuando quieras</b>Tus personajes y recuerdos se guardan en este navegador. No necesitas una cuenta. El sonido es opcional.</p></div><button className="world-primary wide" onClick={() => setHelp(false)}>¡Vamos a imaginar! <Sparkles size={17}/></button></WorldDialog>}
    {interaction && <WorldDialog title={{ plant: 'Una flor con mucha sed', pet: '¡Hola! Soy Nubi', music: 'Ponle ritmo a tu historia', art: 'Todos llevamos un artista dentro', gift: 'Una sorpresa para ti' }[interaction]} onClose={() => setInteraction(null)}><div className="interaction-art">{interaction === 'pet' ? <Pet fed={save.fed}/> : { plant: save.watered ? '🌸' : '🪴', music: '🎶', art: ['🌈', '🌻', '🦋'][painting], gift: '🎁' }[interaction]}</div><p className="interaction-copy">{{ plant: save.watered ? 'Arcoflor ya está feliz. ¡Un poquito de cariño nunca sobra!' : 'Dicen que las arcoflores florecen cuando alguien las cuida. ¿Lo intentamos?', pet: save.fed ? '¡Qué rico! Nubi quiere otro mimo de su persona favorita.' : 'Soy una nubita con patitas. ¿Me das un bocadito y un poco de cariño?', music: 'Una melodía original para bailar por toda la casita. Activa el sonido para escucharla.', art: 'Toca para pintar. Cada vez aparece una nueva creación llena de color.', gift: save.collected.includes('gift') ? 'Tu corona ya está en el vestidor. ¡Póntela y brilla!' : 'Dentro hay una corona de imaginación. ¡Es para ti!' }[interaction]}</p><button className="world-primary wide" onClick={() => discover(interaction)}>{{ plant: 'Regar con cariño 💧', pet: save.fed ? 'Darle un mimo ♡' : 'Darle un bocadito ♡', music: music ? 'Pausar la música' : '¡Que suene la música!', art: 'Pintar mi obra ✦', gift: save.collected.includes('gift') ? '¡Qué bonito!' : 'Abrir mi sorpresa ✦' }[interaction]}<Sparkles size={17}/></button></WorldDialog>}
  </div>
}
function Plant({ bloomed }: { bloomed: boolean }) {
  return <svg className="original-plant" viewBox="0 0 100 130" aria-hidden="true"><g stroke="#77534f" strokeWidth="3" strokeLinejoin="round"><path d="M50 84V34" stroke="#71916b" strokeWidth="5"/><path d="M49 62Q8 64 14 28q37 1 35 34m3-12Q91 45 83 16 48 21 52 50" fill="#8bc49b"/>{bloomed && <g transform="translate(50 23)">{[0, 72, 144, 216, 288].map(r => <ellipse key={r} cy="-12" rx="11" ry="17" fill="#f6a2bd" transform={`rotate(${r})`}/>)}<circle r="9" fill="#ffda6d"/></g>}<path d="m20 83 9 36q22 12 44 0l8-36" fill="#eeac8c"/><rect x="15" y="76" width="72" height="14" rx="5" fill="#f6c59e"/><path d="m42 102 9 8 10-9" fill="none" stroke="#bc7f70"/></g></svg>
}
function Pet({ fed }: { fed: boolean }) {
  return <svg viewBox="0 0 120 90" className="nubi" role="img" aria-label="Nubi, mascota original de EmiVerse"><ellipse cx="60" cy="81" rx="38" ry="6" fill="#a87c74" opacity=".15"/><path d="M20 50Q-1 6 29 13l13 21m38 0q13-40 29-22 12 10-8 40" fill="#f6eddd" stroke="#795461" strokeWidth="3"/><path d="M22 24q3 16 9 17m63 0 7-18" stroke="#efb7b7" strokeWidth="6" strokeLinecap="round"/><rect x="22" y="30" width="79" height="50" rx="25" fill="#fff5e5" stroke="#795461" strokeWidth="3"/><ellipse cx="35" cy="77" rx="12" ry="7" fill="#fff5e5"/><ellipse cx="86" cy="77" rx="12" ry="7" fill="#fff5e5"/><circle cx="44" cy="51" r="4" fill="#76534c"/><circle cx="79" cy="51" r="4" fill="#76534c"/><path d="m57 61 5 4 5-4" stroke="#c48c80" strokeWidth="3" fill="none" strokeLinecap="round"/><ellipse cx="32" cy="61" rx="8" ry="4" fill="#eeb3ad"/><ellipse cx="90" cy="61" rx="8" ry="4" fill="#eeb3ad"/>{fed && <path d="m58 32 4-9 4 9 10 2-9 6 2 10-7-6-8 6 2-10-8-6Z" fill="#e9bd6b"/>}</svg>
}
function WorldDialog({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => { const d = ref.current!; d.showModal(); return () => d.close() }, [])
  return <dialog className="world-dialog" ref={ref} aria-label={title} onCancel={onClose} onClick={e => { if (e.target === ref.current) onClose() }}><button className="world-dialog-close" onClick={onClose} aria-label="Cerrar"><X size={20}/></button><span className="world-eyebrow">HECHO PARA IMAGINAR</span><h2>{title}</h2>{children}</dialog>
}
