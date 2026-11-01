import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, BookOpen, Check, ChevronRight, CircleHelp, Compass, Heart, Home, LockKeyhole, Maximize2, Pause, Play, RotateCcw, Sparkles, Star, Timer, Trophy, Volume2, VolumeX, X } from 'lucide-react'
import { clock, makeDeck, rating, readProgress, worlds } from './game'

type Page = 'explore' | 'achievements' | 'about'
type Modal = 'help' | 'reset' | null
export default function App() {
  const [page, setPage] = useState<Page>('explore')
  const [progress, setProgress] = useState(readProgress)
  const [level, setLevel] = useState(0)
  const [deck, setDeck] = useState(() => makeDeck(6))
  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [started, setStarted] = useState(false)
  const [paused, setPaused] = useState(false)
  const [sound, setSound] = useState(false)
  const [modal, setModal] = useState<Modal>(null)
  const [storageError, setStorageError] = useState(false)
  const board = useRef<HTMLDivElement>(null)
  const audio = useRef<AudioContext | null>(null)
  const world = worlds[level]
  const won = matched.length === deck.length
  const totalStars = progress.stars.reduce((a, b) => a + b, 0)
  useEffect(() => {
    try { localStorage.setItem('emiverse-progress', JSON.stringify(progress)) } catch { setStorageError(true) }
  }, [progress])
  useEffect(() => {
    if (!started || paused || won || modal || page !== 'explore') return
    const timer = window.setInterval(() => setSeconds(n => n + 1), 1000)
    return () => clearInterval(timer)
  }, [started, paused, won, modal, page])
  useEffect(() => {
    if (flipped.length !== 2) return
    const [a, b] = flipped
    const same = deck.find(c => c.id === a)!.symbol === deck.find(c => c.id === b)!.symbol
    const timer = window.setTimeout(() => {
      if (same) setMatched(m => [...m, a, b])
      setFlipped([])
    }, same ? 350 : 900)
    return () => clearTimeout(timer)
  }, [flipped, deck])
  useEffect(() => {
    if (!won) return
    const stars = rating(moves, world.pairs)
    setProgress(p => {
      const scores = [...p.stars]; scores[level] = Math.max(scores[level], stars)
      return { unlocked: Math.max(p.unlocked, Math.min(2, level + 1)), stars: scores, games: p.games + 1, best: Math.max(p.best, Math.max(100, world.pairs * 200 - moves * 25)) }
    })
  }, [won]) // A completed board is recorded exactly once.
  useEffect(() => () => { void audio.current?.close() }, [])
  function tone() {
    if (!sound) return
    try {
      audio.current ??= new AudioContext()
      const context = audio.current
      void context.resume()
      const oscillator = context.createOscillator(); const gain = context.createGain()
      oscillator.connect(gain); gain.connect(context.destination)
      oscillator.frequency.value = 520 + flipped.length * 160
      gain.gain.setValueAtTime(0.06, context.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.16)
      oscillator.start(); oscillator.stop(context.currentTime + 0.17)
    } catch { /* Sound is optional. */ }
  }
  function flip(id: number) {
    if (paused || won || modal || flipped.length === 2 || flipped.includes(id) || matched.includes(id)) return
    tone(); setStarted(true); setFlipped(f => [...f, id]); if (flipped.length === 1) setMoves(m => m + 1)
  }
  function newGame(next = level) {
    setLevel(next); setDeck(makeDeck(worlds[next].pairs)); setFlipped([]); setMatched([]); setMoves(0); setSeconds(0); setStarted(false); setPaused(false); setModal(null)
  }
  function selectLevel(next: number) {
    if (next > progress.unlocked || next === level) return
    newGame(next)
  }
  const navigate = (next: Page) => { setPage(next) }
  return <div className="app-shell">
    <aside className="sidebar">
      <a className="brand" href="#" onClick={e => { e.preventDefault(); navigate('explore') }} aria-label="EmiVerse, inicio"><span className="brand-icon">✦</span><span>Emi<span className="brand-light">Verse</span><small>UN UNIVERSO POR DESCUBRIR</small></span></a>
      <div className="side-label">TU PEQUEÑO UNIVERSO</div>
      <nav aria-label="Principal">
        <button className={page === 'explore' ? 'nav-item active' : 'nav-item'} onClick={() => navigate('explore')}><Compass size={20}/>Explorar <span className="nav-dot"/></button>
        <button className={page === 'achievements' ? 'nav-item active' : 'nav-item'} onClick={() => navigate('achievements')}><Trophy size={20}/>Mis logros {totalStars > 0 && <span className="count">{totalStars}</span>}</button>
        <button className={page === 'about' ? 'nav-item active' : 'nav-item'} onClick={() => navigate('about')}><Heart size={20}/>El mundo de Emily</button>
      </nav>
      <div className="side-note"><span className="note-spark">✧</span><p>Las grandes aventuras<br/>empiezan con curiosidad.</p><span className="note-orbit">◌</span></div>
      <div className="sidebar-bottom"><button className="nav-item" onClick={() => setModal('help')}><CircleHelp size={19}/>¿Cómo se juega?</button><div className="creator"><span className="avatar">E<span>✦</span></span><div>Hecho con imaginación<small>Creado por <b>Emily</b> <Heart size={11}/></small></div></div></div>
    </aside>
    <main>
      <header className="topbar"><div><Home size={16}/><span>Mi universo</span><ChevronRight size={13}/><strong>{page === 'explore' ? 'Explorar' : page === 'achievements' ? 'Mis logros' : 'El mundo de Emily'}</strong></div><span className="version"><i/> La aventura apenas comienza <span>v0.1</span></span></header>
      <div className="content">
        <section className="welcome"><div><span className="eyebrow">UN POQUITO DE MAGIA, MUCHA IMAGINACIÓN</span><h1>{page === 'explore' ? <>Tu próxima aventura<br className="mobile-break"/> está aquí<span className="title-spark">✳</span></> : page === 'achievements' ? 'Pequeños pasos, grandes logros.' : 'Todo empieza con una idea.'}</h1><p>{page === 'explore' ? 'Explora, conecta y deja que tu curiosidad te lleve más lejos.' : page === 'achievements' ? 'Cada estrella cuenta una historia. Esta es la tuya.' : 'Bienvenido al pequeño universo de Emily. Aquí, imaginar es el primer paso.'}</p></div><div className="welcome-badge"><Sparkles size={18}/><span>Hecho para imaginar</span></div></section>
        {page === 'explore' ? <>
          <section className="hero"><div className="hero-copy"><span className="pill"><span/> TU MISIÓN DE HOY</span><h2>Un universo de parejas.<br/>Una mente brillante.</h2><p>Encuentra las parejas escondidas entre las estrellas.<br/>Cada conexión te acerca a una nueva galaxia.</p><button className="primary" onClick={() => { board.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); board.current?.querySelector('button')?.focus({ preventScroll: true }) }}>¡Vamos a explorar! <ArrowRight size={17}/></button><span className="hero-caption"><span>✧</span> Sin prisa. A tu ritmo. A tu manera.</span></div><Cosmos/><span className="hero-coordinate">EMI–001 / SECTOR DE LOS SUEÑOS</span></section>
          <div className="section-heading"><div><span className="mini-icon"><Compass size={19}/></span><h2>Elige tu mundo</h2><span className="subtle">Tu viaje, paso a paso</span></div><span className="world-count">0{progress.unlocked + 1} <span>/ 03 mundos</span></span></div>
          <section className="worlds" aria-label="Mundos">
            {worlds.map((w, i) => <button key={w.name} onClick={() => selectLevel(i)} disabled={i > progress.unlocked} className={`world-card ${w.color} ${level === i ? 'selected' : ''}`} aria-pressed={level === i}><span className="world-illustration">{w.icon}</span><div><span className="world-level">MUNDO 0{i + 1}</span><h3>{w.name}</h3><p>{w.pairs} parejas · {i === 0 ? 'Primeros pasos' : i === 1 ? 'Un nuevo reto' : 'Para soñadores'}</p></div><span className="world-status">{i > progress.unlocked ? <LockKeyhole size={17}/> : level === i ? <Check size={17}/> : <ArrowRight size={17}/>}</span>{progress.stars[i] > 0 && <span className="world-stars">{'★'.repeat(progress.stars[i])}</span>}</button>)}
          </section>
          <section className="game-section" aria-label="Juego de memoria"><div className="game-header"><div><span className="eyebrow">MUNDO 0{level + 1} <span className="little-dot">•</span> MEMORIA CÓSMICA</span><h2>{world.name}</h2><p>{world.subtitle}</p></div><div className="game-actions"><button className="icon-button" onClick={() => setModal('help')} aria-label="¿Cómo se juega?"><CircleHelp size={18}/></button><button className="icon-button" onClick={() => navigate('achievements')} aria-label="Mis logros"><Trophy size={18}/></button><button className="icon-button" onClick={() => setSound(s => !s)} aria-label={sound ? 'Desactivar sonido' : 'Activar sonido'} aria-pressed={sound}>{sound ? <Volume2 size={19}/> : <VolumeX size={19}/>}</button><button className="icon-button" onClick={() => setModal('reset')} aria-label="Reiniciar partida"><RotateCcw size={18}/></button><button className="icon-button expand" onClick={() => { if (document.fullscreenElement) void document.exitFullscreen(); else void board.current?.requestFullscreen?.().catch(() => {}) }} aria-label="Pantalla completa"><Maximize2 size={17}/></button></div></div>
            <div className="game-layout"><div className="play-area" ref={board}>
              <div className="board-top"><span><i/> {won ? '¡Misión completada!' : paused ? 'Una pequeña pausa' : started ? 'Sigue tu intuición' : 'Tu aventura empieza con una carta'}</span><button onClick={() => setPaused(p => !p)} disabled={won || !started} aria-label={paused ? 'Continuar partida' : 'Pausar partida'}>{paused ? <Play size={15}/> : <Pause size={15}/>}</button></div>
              <div className={`card-grid pairs-${world.pairs} ${paused ? 'is-paused' : ''}`}>
                {deck.map((card, index) => { const revealed = flipped.includes(card.id) || matched.includes(card.id); const found = matched.includes(card.id); return <button key={`${level}-${card.id}`} className={`memory-card ${revealed ? 'revealed' : ''} ${found ? 'matched' : ''}`} onClick={() => flip(card.id)} disabled={paused || won || found || flipped.includes(card.id) || flipped.length === 2} aria-label={revealed ? `${card.symbol}${found ? ', pareja encontrada' : ''}` : `Revelar carta ${index + 1}`}><span className="card-back"><span>✦</span><i className="star-a">·</i><i className="star-b">+</i><i className="star-c">·</i><i className="orbit"/></span><span className="card-front">{revealed ? card.symbol : ''}{found && <span className="matched-check"><Check size={11}/></span>}</span></button> })}
              </div>
              {paused && <div className="board-overlay"><span>☾</span><h3>Hasta las estrellas descansan.</h3><p>Tu universo te espera.</p><button className="primary" onClick={() => setPaused(false)}><Play size={16}/> Continuar</button></div>}
              {won && <div className="board-overlay win" role="status"><span className="win-stars">{'★'.repeat(rating(moves, world.pairs))}</span><h3>¡Brillas con luz propia!</h3><p>Encontraste las {world.pairs} parejas en {moves} movimientos.</p><button className="primary" onClick={() => newGame(level < 2 ? level + 1 : 0)}>{level < 2 ? 'Explorar el siguiente mundo' : 'Volver al primer mundo'}<ArrowRight size={16}/></button><button className="text-button" onClick={() => newGame()}>Jugar de nuevo</button></div>}
              <div className="board-footer"><Sparkles size={13}/><span>{matched.length ? '¡Cada pareja es un pequeño descubrimiento!' : 'Dale la vuelta a dos cartas y encuentra su conexión.'}</span></div>
            </div><aside className="mission-panel"><span className="eyebrow">TU EXPEDICIÓN</span><div className="stat"><span className="stat-icon peach"><Sparkles size={19}/></span><div><span>Parejas encontradas</span><strong>{matched.length / 2}<small> / {world.pairs}</small></strong></div></div><div className="progress-track"><span style={{ width: `${matched.length / deck.length * 100}%` }}/></div><div className="stat"><span className="stat-icon lavender"><RotateCcw size={18}/></span><div><span>Movimientos</span><strong>{String(moves).padStart(2, '0')}</strong></div></div><div className="stat"><span className="stat-icon mint"><Timer size={19}/></span><div><span>Tiempo de exploración</span><strong>{clock(seconds)}</strong></div></div><div className="tip"><span>✧ UN CONSEJO ESTELAR</span><p>Observa con calma. A veces, recordar dónde miraste es la mejor pista.</p></div><div className="rating"><span>{[1, 2, 3].map(n => <Star key={n} size={19} fill={n <= rating(moves, world.pairs) ? 'currentColor' : 'none'}/>)}</span><small>Lo importante es disfrutar el viaje.</small></div></aside></div>
          </section>
          <div className="bottom-note"><Heart size={15}/><p>No hay límites cuando juegas con imaginación.</p><span>Sigue brillando, explorador. ✦</span></div>
        </> : page === 'achievements' ? <section className="extra-page"><div className="summary-cards"><div><Trophy/><strong>{progress.games}</strong><span>Expediciones completadas</span></div><div><Star/><strong>{totalStars} / 9</strong><span>Estrellas conseguidas</span></div><div><Sparkles/><strong>{progress.best}</strong><span>Mejor puntuación</span></div></div><h2>Tu mapa de descubrimientos</h2><div className="achievement-list">{worlds.map((w, i) => <div key={w.name}><span className={`achievement-icon ${w.color}`}>{w.icon}</span><div><h3>{w.name}</h3><p>{progress.stars[i] ? 'Un nuevo rincón del universo descubierto.' : 'Completa este mundo para conseguir tus estrellas.'}</p></div><span className="achievement-stars">{progress.stars[i] ? '★'.repeat(progress.stars[i]) : <LockKeyhole size={20}/>}</span></div>)}</div><button className="primary" onClick={() => navigate('explore')}>Seguir explorando <ArrowRight size={17}/></button></section> : <section className="about-page"><div className="about-art">✦<span>✧</span></div><span className="eyebrow">CREADO POR EMILY, PARA MENTES CURIOSAS</span><h2>Un pequeño universo.<br/>Infinitas posibilidades.</h2><p>EmiVerse nace de una idea sencilla: convertir la curiosidad en una aventura. Un lugar para jugar, descubrir y celebrar cada pequeño logro.</p><p>Esta primera aventura te invita a entrenar la memoria entre planetas y estrellas. Sin cuentas, sin prisas y con toda la imaginación del mundo.</p><div className="signature">Con cariño, <span>Emily ♡</span></div><button className="primary" onClick={() => navigate('explore')}>Entrar a mi universo <ArrowRight size={17}/></button></section>}
        {storageError && <p role="status" className="storage-warning">Tu navegador no permite guardar el progreso. Puedes seguir jugando durante esta sesión.</p>}
        <footer><span className="footer-brand">✦ EmiVerse <span>© {new Date().getFullYear()}</span></span><span>Un universo creado por Emily <Heart size={11}/></span><button onClick={() => setModal('help')}>Guía de exploración <BookOpen size={13}/></button></footer>
      </div>
    </main>
    {modal && <Dialog onClose={() => setModal(null)}>{modal === 'help' ? <><span className="dialog-symbol">✧</span><h2>Tu guía de exploración</h2><p>Una aventura de memoria, a tu ritmo.</p><ol><li>Elige dos cartas para descubrir qué esconden.</li><li>Si son iguales, la pareja queda descubierta. Si no, recuerda su lugar e inténtalo de nuevo.</li><li>Encuentra todas las parejas para desbloquear el siguiente mundo.</li></ol><p>Gana 3 estrellas con hasta 3 movimientos extra, 2 con hasta el doble de parejas, y 1 al completar. Tu progreso se guarda en este navegador.</p><button className="primary" onClick={() => setModal(null)}>¡Entendido! <ArrowRight size={17}/></button></> : <><span className="dialog-symbol">↻</span><h2>¿Empezamos de nuevo?</h2><p>Se reiniciará esta partida. Tus estrellas y mundos desbloqueados se conservan.</p><div className="dialog-actions"><button className="secondary" onClick={() => setModal(null)}><ArrowLeft size={15}/> Seguir jugando</button><button className="primary" onClick={() => newGame()}>Reiniciar <RotateCcw size={15}/></button></div></>}</Dialog>}
  </div>
}
function Dialog({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => { const dialog = ref.current!; dialog.showModal(); return () => dialog.close() }, [])
  return <dialog ref={ref} onCancel={onClose} onClick={e => { if (e.target === ref.current) onClose() }} aria-label="Guía y opciones de partida"><button className="dialog-close icon-button" onClick={onClose} aria-label="Cerrar"><X size={20}/></button>{children}</dialog>
}
function Cosmos() {
  return <div className="cosmos" aria-hidden="true"><div className="cosmic-orbit orbit-one"/><div className="cosmic-orbit orbit-two"/><div className="planet-main"><span/><i/><b/></div><div className="planet-ring"/><div className="small-planet"><span/></div><span className="cosmic-star s1">✦</span><span className="cosmic-star s2">✧</span><span className="cosmic-star s3">✦</span><span className="cosmic-star s4">+</span><span className="cosmic-star s5">·</span><div className="floating-note"><span>✦</span> Aquí empieza algo bonito</div><div className="planet-moon"/><span className="cosmic-dot d1"/><span className="cosmic-dot d2"/><span className="cosmic-dot d3"/></div>
}
