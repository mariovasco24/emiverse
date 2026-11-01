import type { Character } from './world'
export default function Avatar({ character, walking = false }: { character: Character; walking?: boolean }) {
  const { skin, shirt, hair, accessory } = character
  return <svg className={`original-character ${walking ? 'walking' : ''}`} viewBox="0 0 100 150" role="img" aria-label={`Personaje de ${character.name}`}>
    <ellipse cx="50" cy="141" rx="26" ry="6" fill="#6b5162" opacity=".15"/>
    {hair === 'long' && <path d="M20 40Q17 10 50 10Q85 10 81 48L85 91Q49 108 16 88Z" fill="#70473f"/>}
    <g className="leg leg-left"><path d="M36 113v19" stroke={skin} strokeWidth="11" strokeLinecap="round"/><path d="M36 135h-9" stroke="#fff8e8" strokeWidth="12" strokeLinecap="round"/></g>
    <g className="leg leg-right"><path d="M63 113v19" stroke={skin} strokeWidth="11" strokeLinecap="round"/><path d="M63 135h9" stroke="#fff8e8" strokeWidth="12" strokeLinecap="round"/></g>
    <path d="m25 84-9 19M75 84l9 19" stroke={skin} strokeWidth="12" strokeLinecap="round"/>
    <path d="M33 75Q50 66 67 75L76 112Q50 124 24 112Z" fill={shirt}/><path d="M42 76q8 13 16 0" fill="none" stroke="#fff4e7" strokeWidth="4"/>
    <path d="m50 92 2 5 6 1-5 4 1 6-4-3-5 3 1-6-4-4 6-1Z" fill="#fff4d3"/>
    <circle cx="20" cy="48" r="7" fill={skin}/><circle cx="80" cy="48" r="7" fill={skin}/><rect x="22" y="18" width="56" height="56" rx="25" fill={skin}/>
    <path d="M20 40Q15 8 49 9Q83 8 80 39Q60 35 48 23Q36 37 20 40Z" fill="#70473f"/>
    {hair === 'buns' && <><circle cx="23" cy="19" r="14" fill="#70473f"/><circle cx="77" cy="19" r="14" fill="#70473f"/><path d="m18 28 9 2m43-1 10-3" stroke={shirt} strokeWidth="4" strokeLinecap="round"/></>}
    <ellipse cx="37" cy="48" rx="3" ry="4" fill="#513c3b"/><ellipse cx="63" cy="48" rx="3" ry="4" fill="#513c3b"/><circle cx="36" cy="47" r="1" fill="white"/><circle cx="62" cy="47" r="1" fill="white"/>
    <ellipse cx="30" cy="56" rx="6" ry="3" fill="#e8918b" opacity=".65"/><ellipse cx="70" cy="56" rx="6" ry="3" fill="#e8918b" opacity=".65"/><path d="M44 59q6 7 12 0" stroke="#a25f54" strokeWidth="2.3" fill="none" strokeLinecap="round"/>
    {accessory === 'bow' && <g fill="#ee8c9f" stroke="#fff0db" strokeWidth="1.5"><path d="M60 16q-10-16-13-2 0 11 13 2M62 16q14-15 17-2-1 11-17 2"/><circle cx="61" cy="16" r="4"/></g>}
    {accessory === 'crown' && <path d="m34 13-4-16 13 9 8-13 8 13 13-9-5 16Z" fill="#f3cc67" stroke="#fff3ba" strokeWidth="2"/>}
  </svg>
}
