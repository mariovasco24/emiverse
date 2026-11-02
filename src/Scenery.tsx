import type { RoomId } from './domain/house'
import InteriorScenery from './features/house/InteriorScenery'
type SceneProps = { room: RoomId; height: number }
/** Responsive original room: SVG coordinates preserve each prop's proportions. */
export default function Scenery({ room, height: h }: SceneProps) {
  if (room === 'kitchen' || room === 'bedroom') return <InteriorScenery room={room} height={h} />
  const garden = room === 'garden'
  const portrait = h > 1200
  const s = portrait ? 1.55 : 1
  const wall = h * 0.49
  return (
    <svg
      className="scenery"
      viewBox={`0 0 1200 ${h}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <pattern id="game-wall" width="45" height="45" patternUnits="userSpaceOnUse">
          <rect width="45" height="45" fill="#ffdbbb" />
          <path d="m22 15 3 6 6 2-6 3-3 6-3-6-6-3 6-2Z" fill="#f5c4b4" opacity=".6" />
        </pattern>
        <pattern id="game-floor" width="180" height="105" patternUnits="userSpaceOnUse">
          <rect width="180" height="105" fill="#f2bd8e" />
          <path d="M0 104h180M179 0v105" stroke="#bd886a" strokeWidth="2" />
          <path d="M8 9h163" stroke="#ffd5a9" strokeWidth="5" />
          <path d="M20 70q45-8 95 0" stroke="#e2a67d" strokeWidth="2" fill="none" />
        </pattern>
        <pattern id="game-grass" width="90" height="75" patternUnits="userSpaceOnUse">
          <rect width="90" height="75" fill="#a5d786" />
          <path d="m15 24 3-7 4 7m43 29 4-8 4 8" fill="none" stroke="#7eb96d" strokeWidth="3" />
          <circle cx="45" cy="13" r="2" fill="#c3e99f" />
        </pattern>
        <linearGradient id="game-sky" x2="0" y2="1">
          <stop stopColor="#92dcec" />
          <stop offset="1" stopColor="#d4f2e3" />
        </linearGradient>
        <linearGradient id="game-glass" x2=".8" y2="1">
          <stop stopColor="#a1d8e0" />
          <stop offset="1" stopColor="#e0f6e5" />
        </linearGradient>
        <linearGradient id="game-wood" x2="0" y2="1">
          <stop stopColor="#f9d8ab" />
          <stop offset="1" stopColor="#da9e78" />
        </linearGradient>
      </defs>
      <g stroke="#79584f" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round">
        {garden ? (
          <>
            <rect x="-5" y="-5" width="1210" height={h + 10} fill="url(#game-sky)" stroke="none" />
            <g transform={`translate(940 ${wall * 0.22}) scale(${s})`}>
              <circle r="45" fill="#ffdb70" stroke="#dca960" />
              {Array.from({ length: 8 }, (_, i) => (
                <path
                  key={i}
                  d="M0-60v-12"
                  transform={`rotate(${i * 45})`}
                  stroke="#e6b45f"
                  strokeWidth="5"
                />
              ))}
              <path d="M-18 0q3-8 7 0m20 0q3-8 7 0M-7 14q7 7 14 0" stroke="#b18a50" fill="none" />
            </g>
            <g fill="#fffbee" stroke="#b8d9d7" strokeWidth="2">
              <path d={`M100 ${wall * 0.22}q-25-30 10-40 13-45 48-18 43-15 49 22 39 3 25 36Z`} />
              <path d={`M600 ${wall * 0.14}q-25-30 10-40 13-45 48-18 43-15 49 22 39 3 25 36Z`} />
            </g>
            <path
              d={`M0 ${wall - 70}Q200 ${wall - 230} 440 ${wall - 75}Q700 ${wall - 250} 1200 ${wall - 90}V${h}H0Z`}
              fill="#83ba82"
              stroke="#6b9d6d"
            />
            <rect
              x="0"
              y={wall}
              width="1200"
              height={h - wall}
              fill="url(#game-grass)"
              stroke="none"
            />
            <path d={`M0 ${wall + 45}H1200`} stroke="#ecdcaa" strokeWidth="18" />
            {Array.from({ length: 19 }, (_, i) => (
              <path
                key={i}
                d={`m${i * 70} ${wall + 75}v-100l16-18 16 18v100Z`}
                fill="#fff5d7"
                stroke="#c0ab83"
                strokeWidth="2"
              />
            ))}
            <path
              d={`M540 ${wall + 50}Q460 ${h * 0.75} 810 ${h}H400Q250 ${h * 0.75} 450 ${wall + 50}`}
              fill="#f9d7a1"
              stroke="#deba86"
            />
            <g transform={`translate(125 ${wall + 45}) scale(${s})`}>
              <path d="M-15 0v-190h30V0Z" fill="#c79877" />
              <path
                d="M-10-100q-125 5-95-100-33-66 46-85 38-58 83-17 97-3 85 77 47 100-64 124Z"
                fill="#78b78e"
                stroke="#548b73"
              />
              <path
                d="M-70-220q19-35 55-21m55 3q27 9 33 36"
                stroke="#add69a"
                strokeWidth="9"
                fill="none"
              />
              <circle cx="-40" cy="-161" r="13" fill="#f5a394" />
              <circle cx="59" cy="-205" r="13" fill="#f5a394" />
              <circle cx="20" cy="-262" r="13" fill="#f5a394" />
            </g>
            <g transform={`translate(1000 ${wall + 25}) scale(${s})`}>
              <path d="M0 0v-170" stroke="#9e8060" strokeWidth="23" />
              <path
                d="M0-100q-100-5-83-85-10-55 52-59 49-56 93-4 81 12 47 86 5 74-109 62Z"
                fill="#a6c981"
                stroke="#6b9d6c"
              />
            </g>

            {[60, 290, 880, 1130].map((x, i) => (
              <g key={x} transform={`translate(${x} ${h * (0.83 + (i % 2) * 0.08)}) scale(${s})`}>
                <path d="M0 0v35m0-9-12-10" stroke="#66996d" />
                <g fill={i % 2 ? '#f5a6b2' : '#ffd66d'}>
                  {[0, 72, 144, 216, 288].map((r) => (
                    <ellipse key={r} cy="-10" rx="8" ry="12" transform={`rotate(${r})`} />
                  ))}
                </g>
                <circle r="7" fill="#fff1c3" />
              </g>
            ))}
          </>
        ) : (
          <>
            <rect
              x="-5"
              y="-5"
              width="1210"
              height={wall + 10}
              fill="url(#game-wall)"
              stroke="none"
            />
            <rect
              x="-5"
              y={wall}
              width="1210"
              height={h - wall + 5}
              fill="url(#game-floor)"
              stroke="none"
            />
            <rect x="-5" y={wall - 22} width="1210" height="29" fill="#fce6bd" />
            <path d={`M0 ${wall - 12}h1200`} stroke="#fff3d4" strokeWidth="6" />
            <g transform={`translate(600 ${portrait ? wall * 0.52 : wall * 0.48}) scale(${s})`}>
              <rect x="-106" y="-118" width="212" height="245" rx="89" fill="#c8a0a5" />
              <rect x="-93" y="-104" width="186" height="215" rx="77" fill="url(#game-glass)" />
              <path d="M-91 60q42-49 95-18t87-15v83H-91Z" fill="#9dd198" stroke="none" />
              <path d="M0-104v214m-92-81H92" stroke="#fff5d4" strokeWidth="9" />
              <path d="M-66-74-36-91m-40 38 51-28" stroke="#f3ffea" strokeWidth="7" />
              <path
                d="M-125-122q-14 124 3 225l42-22q-30-71-10-184m215-19q14 124-3 225l-42-22q30-71 10-184"
                fill="#ed9aaa"
                stroke="#bb788e"
              />
              <path d="M-135-125h270" stroke="#8e6a77" strokeWidth="9" />
              <circle cx="-137" cy="-125" r="7" fill="#f4c57f" />
              <circle cx="137" cy="-125" r="7" fill="#f4c57f" />
              <rect x="-125" y="110" width="250" height="16" rx="6" fill="#f4d1a3" />
            </g>

            <g transform={`translate(600 ${h * 0.1}) scale(${s})`}>
              <path d="M0-180V-14" stroke="#83626c" strokeWidth="5" />
              <path d="m-44-18-18 53q62 29 124 0L44-18Z" fill="#f9cf7d" />
              <ellipse cy="35" rx="62" ry="13" fill="#ffe9a4" />
              <path d="M-30-8h60" stroke="#ffe5a1" strokeWidth="8" />
            </g>
            <ellipse
              cx="600"
              cy={h * 0.76}
              rx={portrait ? 480 : 330}
              ry={h * 0.125}
              fill="#d5a0ba"
              stroke="#a97491"
            />
            <ellipse
              cx="600"
              cy={h * 0.76}
              rx={portrait ? 445 : 302}
              ry={h * 0.105}
              fill="none"
              stroke="#f5c9ce"
              strokeWidth="5"
              strokeDasharray="6 12"
            />
          </>
        )}
      </g>
    </svg>
  )
}
