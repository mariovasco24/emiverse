type SceneProps = { garden: boolean; height: number }
/** Responsive original room: SVG coordinates preserve each prop's proportions. */
export default function Scenery({ garden, height: h }: SceneProps) {
  const portrait = h > 1200
  const s = portrait ? 1.55 : 1
  const wall = h * .49
  return <svg className="scenery" viewBox={`0 0 1200 ${h}`} preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <pattern id="game-wall" width="45" height="45" patternUnits="userSpaceOnUse"><rect width="45" height="45" fill="#ffdbbb"/><path d="m22 15 3 6 6 2-6 3-3 6-3-6-6-3 6-2Z" fill="#f5c4b4" opacity=".6"/></pattern>
      <pattern id="game-floor" width="180" height="105" patternUnits="userSpaceOnUse"><rect width="180" height="105" fill="#f2bd8e"/><path d="M0 104h180M179 0v105" stroke="#bd886a" strokeWidth="2"/><path d="M8 9h163" stroke="#ffd5a9" strokeWidth="5"/><path d="M20 70q45-8 95 0" stroke="#e2a67d" strokeWidth="2" fill="none"/></pattern>
      <pattern id="game-grass" width="90" height="75" patternUnits="userSpaceOnUse"><rect width="90" height="75" fill="#a5d786"/><path d="m15 24 3-7 4 7m43 29 4-8 4 8" fill="none" stroke="#7eb96d" strokeWidth="3"/><circle cx="45" cy="13" r="2" fill="#c3e99f"/></pattern>
      <linearGradient id="game-sky" x2="0" y2="1"><stop stopColor="#92dcec"/><stop offset="1" stopColor="#d4f2e3"/></linearGradient>
      <linearGradient id="game-glass" x2=".8" y2="1"><stop stopColor="#a1d8e0"/><stop offset="1" stopColor="#e0f6e5"/></linearGradient>
      <linearGradient id="game-wood" x2="0" y2="1"><stop stopColor="#f9d8ab"/><stop offset="1" stopColor="#da9e78"/></linearGradient>
    </defs>
    <g stroke="#79584f" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round">
    {garden ? <>
      <rect x="-5" y="-5" width="1210" height={h + 10} fill="url(#game-sky)" stroke="none"/>
      <g transform={`translate(940 ${wall * .22}) scale(${s})`}><circle r="45" fill="#ffdb70" stroke="#dca960"/>{Array.from({ length: 8 }, (_, i) => <path key={i} d="M0-60v-12" transform={`rotate(${i * 45})`} stroke="#e6b45f" strokeWidth="5"/>)}<path d="M-18 0q3-8 7 0m20 0q3-8 7 0M-7 14q7 7 14 0" stroke="#b18a50" fill="none"/></g>
      <g fill="#fffbee" stroke="#b8d9d7" strokeWidth="2"><path d={`M100 ${wall * .22}q-25-30 10-40 13-45 48-18 43-15 49 22 39 3 25 36Z`}/><path d={`M600 ${wall * .14}q-25-30 10-40 13-45 48-18 43-15 49 22 39 3 25 36Z`}/></g>
      <path d={`M0 ${wall - 70}Q200 ${wall - 230} 440 ${wall - 75}Q700 ${wall - 250} 1200 ${wall - 90}V${h}H0Z`} fill="#83ba82" stroke="#6b9d6d"/>
      <rect x="0" y={wall} width="1200" height={h - wall} fill="url(#game-grass)" stroke="none"/>
      <path d={`M0 ${wall + 45}H1200`} stroke="#ecdcaa" strokeWidth="18"/>
      {Array.from({ length: 19 }, (_, i) => <path key={i} d={`m${i * 70} ${wall + 75}v-100l16-18 16 18v100Z`} fill="#fff5d7" stroke="#c0ab83" strokeWidth="2"/>)}
      <path d={`M540 ${wall + 50}Q460 ${h * .75} 810 ${h}H400Q250 ${h * .75} 450 ${wall + 50}`} fill="#f9d7a1" stroke="#deba86"/>
      <g transform={`translate(125 ${wall + 45}) scale(${s})`}><path d="M-15 0v-190h30V0Z" fill="#c79877"/><path d="M-10-100q-125 5-95-100-33-66 46-85 38-58 83-17 97-3 85 77 47 100-64 124Z" fill="#78b78e" stroke="#548b73"/><path d="M-70-220q19-35 55-21m55 3q27 9 33 36" stroke="#add69a" strokeWidth="9" fill="none"/><circle cx="-40" cy="-161" r="13" fill="#f5a394"/><circle cx="59" cy="-205" r="13" fill="#f5a394"/><circle cx="20" cy="-262" r="13" fill="#f5a394"/></g>
      <g transform={`translate(1000 ${wall + 25}) scale(${s})`}><path d="M0 0v-170" stroke="#9e8060" strokeWidth="23"/><path d="M0-100q-100-5-83-85-10-55 52-59 49-56 93-4 81 12 47 86 5 74-109 62Z" fill="#a6c981" stroke="#6b9d6c"/></g>
      <g transform={`translate(${portrait ? 720 : 785} ${wall + 110}) scale(${s * .75})`}><path d="M0 0v60m160-60v60" stroke="#8c6b67" strokeWidth="12"/><rect x="-14" y="-80" width="188" height="78" rx="10" fill="#e9a7b1"/><path d="M-12-52h184m-184 26h184" stroke="#ba7f99"/><rect x="-20" y="-5" width="200" height="21" rx="6" fill="#f8c3bb"/></g>
      {[60, 290, 880, 1130].map((x, i) => <g key={x} transform={`translate(${x} ${h * (.83 + i % 2 * .08)}) scale(${s})`}><path d="M0 0v35m0-9-12-10" stroke="#66996d"/><g fill={i % 2 ? '#f5a6b2' : '#ffd66d'}>{[0, 72, 144, 216, 288].map(r => <ellipse key={r} cy="-10" rx="8" ry="12" transform={`rotate(${r})`}/>)}</g><circle r="7" fill="#fff1c3"/></g>)}
    </> : <>
      <rect x="-5" y="-5" width="1210" height={wall + 10} fill="url(#game-wall)" stroke="none"/>
      <rect x="-5" y={wall} width="1210" height={h - wall + 5} fill="url(#game-floor)" stroke="none"/>
      <rect x="-5" y={wall - 22} width="1210" height="29" fill="#fce6bd"/><path d={`M0 ${wall - 12}h1200`} stroke="#fff3d4" strokeWidth="6"/>
      <g transform={`translate(600 ${portrait ? wall * .52 : wall * .48}) scale(${s})`}>
        <rect x="-106" y="-118" width="212" height="245" rx="89" fill="#c8a0a5"/><rect x="-93" y="-104" width="186" height="215" rx="77" fill="url(#game-glass)"/>
        <path d="M-91 60q42-49 95-18t87-15v83H-91Z" fill="#9dd198" stroke="none"/><path d="M0-104v214m-92-81H92" stroke="#fff5d4" strokeWidth="9"/><path d="M-66-74-36-91m-40 38 51-28" stroke="#f3ffea" strokeWidth="7"/>
        <path d="M-125-122q-14 124 3 225l42-22q-30-71-10-184m215-19q14 124-3 225l-42-22q30-71 10-184" fill="#ed9aaa" stroke="#bb788e"/>
        <path d="M-135-125h270" stroke="#8e6a77" strokeWidth="9"/><circle cx="-137" cy="-125" r="7" fill="#f4c57f"/><circle cx="137" cy="-125" r="7" fill="#f4c57f"/>
        <rect x="-125" y="110" width="250" height="16" rx="6" fill="#f4d1a3"/>
      </g>
      <g transform={`translate(${portrait ? 30 : 72} ${wall + 30}) scale(${s})`}>
        <path d="M17-20v40m246-40v40" stroke="#956b63" strokeWidth="12"/><rect x="0" y="-155" width="280" height="154" rx="35" fill="#89bbaa"/><path d="M14-150q116-15 248 0" stroke="#b2dac1" strokeWidth="10"/>
        <rect x="-12" y="-83" width="45" height="90" rx="17" fill="#b5d6b5"/><rect x="247" y="-83" width="45" height="90" rx="17" fill="#b5d6b5"/><rect x="29" y="-70" width="219" height="66" rx="17" fill="#98c6b1"/><path d="M140-67v59" stroke="#709a92"/>
        <rect x="50" y="-125" width="59" height="61" rx="12" fill="#ffdc8a" transform="rotate(-12 50 -125)"/><path d="m70-99 10 9 10-12" stroke="#d7a76a" fill="none"/><rect x="185" y="-134" width="50" height="67" rx="14" fill="#f4b8bc" transform="rotate(13 185 -134)"/>
      </g>
      <g transform={`translate(${portrait ? 890 : 970} ${wall - 5}) scale(${portrait ? 1.1 : 1})`}>
        <rect x="-96" y="-290" width="192" height="290" rx="9" fill="#b78477"/><rect x="-81" y="-276" width="162" height="78" rx="4" fill="#dac3ab"/><rect x="-81" y="-183" width="162" height="78" rx="4" fill="#dac3ab"/><rect x="-81" y="-91" width="162" height="78" rx="4" fill="#dac3ab"/>
        <g fill="#b9a5cb"><rect x="-66" y="-246" width="21" height="46" rx="4"/><rect x="-39" y="-258" width="20" height="58" rx="4" fill="#9bbfb5"/><rect x="-12" y="-242" width="20" height="42" rx="4" fill="#f1ab9e"/><rect x="18" y="-251" width="18" height="51" rx="4" fill="#e9cc82" transform="rotate(-10 18 -251)"/></g>
        <path d="M-50-120v-34q0-17 17-17t17 17v34Z" fill="#e8c9e0"/><path d="M-44-153h21" stroke="#b088ac"/><rect x="3" y="-145" width="60" height="35" rx="8" fill="#92c7bc"/><path d="M13-133h40" stroke="#d9f0cd" strokeWidth="5"/>
        <rect x="-58" y="-67" width="112" height="47" rx="9" fill="#f0baa5"/><path d="M-58-50H54" stroke="#ce977c"/><circle cx="-2" cy="-46" r="5" fill="#ffe3ad"/>
      </g>
      <g transform={`translate(${portrait ? 230 : 205} ${wall * .39}) scale(${s}) rotate(-4)`}><rect x="-61" y="-70" width="122" height="140" rx="10" fill="#bd8c80"/><rect x="-51" y="-60" width="102" height="120" rx="5" fill="#fff3d2"/><path d="M-40 50 0-19l42 69Z" fill="#9bcaa6"/><circle cx="22" cy="-29" r="18" fill="#f7ca72"/><path d="M-23 12q23-20 43 0" fill="none" stroke="#f3a2aa" strokeWidth="8"/></g>
      <g transform={`translate(${portrait ? 960 : 1060} ${wall * .28}) scale(${s * .7})`}><path d="M0-54v-27" stroke="#8b6c73" strokeWidth="4"/><path d="M-63-49Q0-90 63-49v69H-63Z" fill="#b3c4b3"/><path d="M-57 20v15H57V20" fill="#e7b99c"/><path d="M-39-47q2 34 22 45-11-44 17-61Q15-34 2-1q33-1 31-40 30 24 12 59" fill="#81ad8d" stroke="#638b76"/></g>
      <g transform={`translate(600 ${h * .10}) scale(${s})`}><path d="M0-180V-14" stroke="#83626c" strokeWidth="5"/><path d="m-44-18-18 53q62 29 124 0L44-18Z" fill="#f9cf7d"/><ellipse cy="35" rx="62" ry="13" fill="#ffe9a4"/><path d="M-30-8h60" stroke="#ffe5a1" strokeWidth="8"/></g>
      <ellipse cx="600" cy={h * .76} rx={portrait ? 480 : 330} ry={h * .125} fill="#d5a0ba" stroke="#a97491"/>
      <ellipse cx="600" cy={h * .76} rx={portrait ? 445 : 302} ry={h * .105} fill="none" stroke="#f5c9ce" strokeWidth="5" strokeDasharray="6 12"/>
      <g transform={`translate(${portrait ? 610 : 640} ${wall + 60}) scale(${s * .7})`}><path d="M-55-7-63 35m118-42 8 42" stroke="#a07468" strokeWidth="9"/><ellipse rx="84" ry="25" fill="url(#game-wood)"/><rect x="-31" y="-16" width="61" height="14" rx="4" fill="#9dbcc1"/><path d="M-26-10h50" stroke="#dff0dc"/></g>
      <g transform={`translate(${portrait ? 1120 : 1150} ${wall + 15}) scale(${s})`}><rect x="-32" y="-100" width="64" height="100" rx="12" fill="#ecae91"/><path d="M-33-78h66" stroke="#b78070"/><path d="M0-101v-93" stroke="#75a47c" strokeWidth="7"/><path d="M-1-145q-72-17-48-65 44 6 48 65m3-16q16-63 56-46-1 45-56 46" fill="#a2c78d" stroke="#719c79"/></g>
    </>}
    </g>
  </svg>
}
