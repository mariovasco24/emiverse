export default function ShopScenery({ height: h }: { height: number }) {
  const wall = h * 0.49
  return (
    <svg
      className="scenery"
      viewBox={`0 0 1200 ${h}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <pattern id="shop-floor" width="120" height="100" patternUnits="userSpaceOnUse">
          <rect width="120" height="100" fill="#f5debd" />
          <path d="M0 99h120M119 0v100" stroke="#d5b3a0" strokeWidth="2" />
        </pattern>
      </defs>
      <g stroke="#986b7b" strokeWidth="4" strokeLinejoin="round">
        <rect width="1200" height={wall} fill="#f5c9d8" stroke="none" />
        <rect y={wall} width="1200" height={h - wall} fill="url(#shop-floor)" stroke="none" />
        <path d={`M0 ${wall}h1200`} stroke="#fff1cd" strokeWidth="18" />
        <rect x="74" y={h * 0.205} width="1052" height={h * 0.35} rx="25" fill="#dbad96" />
        {[0.35, 0.52, 0.55].map((y) => (
          <path key={y} d={`M65 ${h * y}h1070`} stroke="#a97d80" strokeWidth="18" />
        ))}
        <path d={`M42 ${h * 0.205}V${h * 0.15}h1116v${h * 0.055}Z`} fill="#fff0cc" />
        {Array.from({ length: 12 }, (_, i) => (
          <path
            key={i}
            d={`M${42 + i * 93} ${h * 0.15}v${h * 0.055}q46 38 93 0V${h * 0.15}`}
            fill={i % 2 ? '#fff0cc' : '#e497b6'}
          />
        ))}
        <ellipse cx="600" cy={h * 0.81} rx="370" ry={h * 0.1} fill="#bad8cd" stroke="#94baab" />
        <g transform={`translate(900 ${h * 0.74})`}>
          <rect x="-125" y="-40" width="250" height="105" rx="14" fill="#e8adc2" />
          <path d="M-145-40h290" stroke="#fff0ce" strokeWidth="17" />
          <rect x="-42" y="-110" width="100" height="65" rx="8" fill="#b9cfd8" />
          <rect x="-30" y="-98" width="76" height="40" rx="4" fill="#f7f1d6" />
          <path d="M-15-42v-17m41 17v-17" />
        </g>
        <text
          x="600"
          y={h * 0.132}
          textAnchor="middle"
          fill="#b16d8d"
          stroke="none"
          fontFamily="Trebuchet MS, sans-serif"
          fontWeight="900"
          fontSize="42"
        >
          La tiendita de Emily
        </text>
      </g>
    </svg>
  )
}
