import type { Character } from './world'

/** Original EmiVerse doll, drawn with scalable outlined shapes. */
export default function Avatar({
  character,
  walking = false,
}: {
  character: Character
  walking?: boolean
}) {
  const { skin, shirt, hair, accessory } = character
  return (
    <svg
      className={`original-character ${walking ? 'walking' : ''}`}
      viewBox="0 0 120 180"
      role="img"
      aria-label={`Personaje de ${character.name}`}
    >
      <ellipse cx="60" cy="172" rx="31" ry="6" fill="#6d4250" opacity=".2" />
      <g stroke="#503849" strokeWidth="2.3" strokeLinejoin="round" strokeLinecap="round">
        {hair === 'long' && (
          <path
            d="M21 42Q17 10 60 10Q105 10 101 46L105 113Q92 126 60 118Q29 126 15 111Z"
            fill="#75424d"
          />
        )}
        <g className="leg leg-left">
          <path d="M43 141v20" stroke="#503849" strokeWidth="15" />
          <path d="M43 141v19" stroke={skin} strokeWidth="10" />
          <path d="M35 158h16v12H29q-3-8 6-12Z" fill="#fff9ed" />
          <path d="M30 168h20" stroke="#bdc9dd" strokeWidth="3" />
        </g>
        <g className="leg leg-right">
          <path d="M76 141v20" stroke="#503849" strokeWidth="15" />
          <path d="M76 141v19" stroke={skin} strokeWidth="10" />
          <path d="M68 158h16q10 4 7 12H68Z" fill="#fff9ed" />
          <path d="M70 168h20" stroke="#bdc9dd" strokeWidth="3" />
        </g>
        <path
          d="m33 111-13 20q-3 7 3 10 7 1 10-7l10-16m44-7 13 20q3 7-3 10-7 1-10-7l-10-16"
          fill={skin}
        />
        <path d="M38 107q22-11 44 0l10 31q-32 15-64 0Z" fill={shirt} />
        <path d="m35 138-2 10 23 4 4-10 4 10 23-4-3-10" fill="#a6c7e1" />
        <path d="M48 106q12 16 24 0" fill="#ffedc6" />
        <path d="m60 118 3 6 7 1-5 5 1 6-6-3-6 3 1-6-5-5 7-1Z" fill="#fff3a8" strokeWidth="1.2" />
        <circle cx="23" cy="71" r="9" fill={skin} />
        <circle cx="97" cy="71" r="9" fill={skin} />
        <path d="M24 55q0-35 36-35t36 35v19q0 33-36 34T24 74Z" fill={skin} />
        <path
          d="M22 61Q8 13 57 12q44-4 43 44l-9 9-4-23q-10-1-28-17-4 16-30 21l-1 18Z"
          fill="#75424d"
        />
        <path d="M30 34q5-14 21-15M64 19q15 1 23 13" stroke="#a36364" strokeWidth="4" />
        {hair === 'buns' && (
          <>
            <circle cx="25" cy="27" r="18" fill="#75424d" />
            <circle cx="96" cy="27" r="18" fill="#75424d" />
            <path d="M13 22q2-9 11-9m61 8q2-9 11-9" stroke="#a36364" strokeWidth="3" />
            <path d="m18 43 14-1m56 0 14 1" stroke={shirt} strokeWidth="5" />
          </>
        )}
        {hair === 'short' && <path d="M48 16q19-17 29 3l-13 9" fill="#75424d" />}
        <ellipse cx="41" cy="71" rx="12" ry="15" fill="white" />
        <ellipse cx="80" cy="71" rx="12" ry="15" fill="white" />
        <ellipse cx="44" cy="73" rx="8" ry="11" fill="#6b8397" />
        <ellipse cx="77" cy="73" rx="8" ry="11" fill="#6b8397" />
        <ellipse cx="45" cy="73" rx="4.5" ry="8" fill="#443648" stroke="none" />
        <ellipse cx="76" cy="73" rx="4.5" ry="8" fill="#443648" stroke="none" />
        <path d="m29 62-3-4m65 4 3-4" fill="none" />
        <circle cx="41" cy="66" r="4" fill="white" stroke="none" />
        <circle cx="73" cy="66" r="4" fill="white" stroke="none" />
        <circle cx="48" cy="77" r="2" fill="white" stroke="none" />
        <circle cx="80" cy="77" r="2" fill="white" stroke="none" />
        <ellipse cx="30" cy="89" rx="8" ry="4" fill="#ee9a98" stroke="none" opacity=".8" />
        <ellipse cx="90" cy="89" rx="8" ry="4" fill="#ee9a98" stroke="none" opacity=".8" />
        <path d="m58 82 2 2 3-2" stroke="#c38678" strokeWidth="1.5" fill="none" />
        <path d="M53 92q8 9 15-1" fill="#c9717f" strokeWidth="1.7" />
        {accessory === 'bow' && (
          <g fill="#ef92b1">
            <path d="M77 24q-18-20-19-3 2 16 19 6 16 14 21 0 7-18-17-3Z" />
            <circle cx="79" cy="26" r="5" fill="#ffe2b8" />
          </g>
        )}
        {accessory === 'crown' && (
          <g>
            <path d="m40 22-4-22 16 11L61-4l9 15L87 0l-6 22Z" fill="#ffd56c" />
            <circle cx="61" cy="15" r="3" fill="#f2a1b0" stroke="none" />
          </g>
        )}
      </g>
    </svg>
  )
}
