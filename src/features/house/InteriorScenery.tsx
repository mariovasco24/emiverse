import type { RoomId } from '../../domain/house'
export default function InteriorScenery({
  room,
  height: h,
}: {
  room: Extract<RoomId, 'kitchen' | 'bedroom'>
  height: number
}) {
  const kitchen = room === 'kitchen',
    wall = h * 0.49,
    s = h > 1200 ? 1.5 : 1
  return (
    <svg
      className="scenery"
      viewBox={`0 0 1200 ${h}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <pattern id={`wall-${room}`} width="60" height="60" patternUnits="userSpaceOnUse">
          <rect width="60" height="60" fill={kitchen ? '#c8e8d8' : '#e5d1ee'} />
          {kitchen ? (
            <path d="M0 59h60M59 0v60" stroke="#a2cabd" strokeWidth="2" />
          ) : (
            <path d="m30 16 4 9 10 2-8 7 2 10-8-5-9 5 2-10-8-7 11-2Z" fill="#c7b1d8" opacity=".5" />
          )}
        </pattern>
        <pattern id={`floor-${room}`} width="180" height="100" patternUnits="userSpaceOnUse">
          <rect width="180" height="100" fill={kitchen ? '#f1d3ae' : '#e8bca7'} />
          <path d="M0 99h180M179 0v100" stroke="#bb9680" strokeWidth="2" />
          <path d="M7 8h164" stroke="#fbe4c4" strokeWidth="5" />
        </pattern>
      </defs>
      <g stroke="#795b6b" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round">
        <rect width="1200" height={wall} fill={`url(#wall-${room})`} stroke="none" />
        <rect y={wall} width="1200" height={h - wall} fill={`url(#floor-${room})`} stroke="none" />
        <rect x="-5" y={wall - 20} width="1210" height="26" fill="#fff0cd" />
        {kitchen ? (
          <>
            <g transform={`translate(540 ${wall * 0.43}) scale(${s})`}>
              <rect x="-110" y="-105" width="220" height="210" rx="15" fill="#f7e6c8" />
              <rect x="-98" y="-93" width="196" height="185" rx="9" fill="#a9dbde" />
              <path d="M-96 35q58-50 110-7t83-14v77H-96" fill="#a7cf97" stroke="none" />
              <path d="M0-93V92m-98-2h196" stroke="#fff4d5" strokeWidth="9" />
              <path d="M-115 104h230" stroke="#cda28f" strokeWidth="14" />
              <path d="m-73-61 35-18m-35 41 54-30" stroke="#e5faf1" strokeWidth="7" />
            </g>
            <g transform={`translate(830 ${wall * 0.23}) scale(${s * 0.8})`}>
              <rect x="-160" y="-45" width="320" height="90" rx="12" fill="#efc6a1" />
              <path d="M-153 0h306" stroke="#b78b7e" strokeWidth="8" />
              {[-110, -40, 30, 100].map((x, i) => (
                <g key={x} transform={`translate(${x} 0)`}>
                  <path d="M-20-30v-21h40v21" fill="#e7f1dc" />
                  <rect
                    x="-24"
                    y="-26"
                    width="48"
                    height="22"
                    rx="8"
                    fill={['#e9a5b3', '#a5d0c0', '#d6bee3', '#e8ca88'][i]}
                  />
                </g>
              ))}
            </g>
            <g transform={`translate(230 ${wall * 0.25}) scale(${s * 0.65})`}>
              <circle r="55" fill="#fff4d6" />
              <path d="M0-38v38l23 14" fill="none" stroke="#b78d95" strokeWidth="6" />
              <circle r="5" fill="#e8ab8d" />
              {[0, 90, 180, 270].map((a) => (
                <path key={a} d="M0-46v6" transform={`rotate(${a})`} />
              ))}
            </g>
            <g transform={`translate(650 ${h * 0.11}) scale(${s})`}>
              <path d="M0-170v147" />
              <path d="m-46-25-17 58q63 24 126 0L46-25Z" fill="#f5d47d" />
              <ellipse cy="33" rx="63" ry="11" fill="#fff0b4" />
            </g>
            <ellipse cx="570" cy={h * 0.8} rx="310" ry={h * 0.1} fill="#b2d6c4" stroke="#88b3a4" />
          </>
        ) : (
          <>
            <g transform={`translate(710 ${wall * 0.44}) scale(${s})`}>
              <path d="M-104 98V-35q0-80 104-80t104 80V98Z" fill="#efd3da" />
              <path d="M-91 84V-35q0-66 91-66t91 66V84Z" fill="#a6b8db" />
              <path d="M0-100V85m-90-8H90" stroke="#fff2d3" strokeWidth="8" />
              <path d="M-57-42q10-26 31-13 20 7 1 26-18 9-32-13" fill="#f8e5ac" stroke="none" />
              <path
                d="M-118-110q-15 118 0 207l36-27q-23-86-6-161m206-19q15 118 0 207l-36-27q23-86 6-161"
                fill="#b89aca"
                stroke="#977ba9"
              />
              <rect x="-120" y="97" width="240" height="14" rx="6" fill="#f3ccba" />
            </g>
            <g transform={`translate(210 ${wall * 0.35}) scale(${s * 0.7})`}>
              <rect x="-70" y="-85" width="140" height="170" rx="12" fill="#e0a7b5" />
              <rect x="-58" y="-73" width="116" height="146" rx="7" fill="#fff0c9" />
              <circle cy="-10" r="32" fill="#caafdb" />
              <ellipse
                cy="-10"
                rx="53"
                ry="12"
                transform="rotate(-25)"
                fill="none"
                stroke="#d4ae75"
                strokeWidth="9"
              />
              <path d="m-32 43 3 7 8 1-6 5 2 8-7-4-6 4 1-8-5-5 7-1Z" fill="#e8ba76" />
            </g>
            <g transform={`translate(955 ${wall * 0.18}) scale(${s * 0.6})`}>
              <path d="M-95 0q95 35 190 0" fill="none" />
              {[-70, -35, 0, 35, 70].map((x, i) => (
                <g key={x}>
                  <path d={`M${x} 10v${i % 2 ? 35 : 20}`} fill="none" />
                  <path
                    d="m0-13 4 8 9 1-7 6 2 10-8-5-8 5 2-10-7-6 9-1Z"
                    transform={`translate(${x} ${i % 2 ? 58 : 43})`}
                    fill="#f9dc8c"
                  />
                </g>
              ))}
            </g>
            <g transform={`translate(520 ${h * 0.1}) scale(${s})`}>
              <path d="M0-170v150" />
              <path d="m-45-23-15 53q60 20 120 0L45-23Z" fill="#ecc1d5" />
              <ellipse cy="30" rx="60" ry="12" fill="#ffebc7" />
            </g>
            <ellipse
              cx="600"
              cy={h * 0.81}
              rx="385"
              ry={h * 0.12}
              fill="#c8b1db"
              stroke="#a18ab6"
            />
            <ellipse
              cx="600"
              cy={h * 0.81}
              rx="350"
              ry={h * 0.1}
              fill="none"
              stroke="#e9d5ea"
              strokeWidth="5"
              strokeDasharray="6 12"
            />
          </>
        )}
      </g>
    </svg>
  )
}
