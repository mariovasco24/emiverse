export function Plant({ bloomed }: { bloomed: boolean }) {
  return (
    <svg className="original-plant" viewBox="0 0 100 130" aria-hidden="true">
      <g stroke="#77534f" strokeWidth="3" strokeLinejoin="round">
        <path d="M50 84V34" stroke="#71916b" strokeWidth="5" />
        <path d="M49 62Q8 64 14 28q37 1 35 34m3-12Q91 45 83 16 48 21 52 50" fill="#8bc49b" />
        {bloomed && (
          <g transform="translate(50 23)">
            {[0, 72, 144, 216, 288].map((r) => (
              <ellipse key={r} cy="-12" rx="11" ry="17" fill="#f6a2bd" transform={`rotate(${r})`} />
            ))}
            <circle r="9" fill="#ffda6d" />
          </g>
        )}
        <path d="m20 83 9 36q22 12 44 0l8-36" fill="#eeac8c" />
        <rect x="15" y="76" width="72" height="14" rx="5" fill="#f6c59e" />
        <path d="m42 102 9 8 10-9" fill="none" stroke="#bc7f70" />
      </g>
    </svg>
  )
}
export function Pet({ fed }: { fed: boolean }) {
  return (
    <svg
      viewBox="0 0 120 90"
      className="nubi"
      role="img"
      aria-label="Nubi, mascota original de EmiVerse"
    >
      <ellipse cx="60" cy="81" rx="38" ry="6" fill="#a87c74" opacity=".15" />
      <path
        d="M20 50Q-1 6 29 13l13 21m38 0q13-40 29-22 12 10-8 40"
        fill="#f6eddd"
        stroke="#795461"
        strokeWidth="3"
      />
      <path d="M22 24q3 16 9 17m63 0 7-18" stroke="#efb7b7" strokeWidth="6" strokeLinecap="round" />
      <rect
        x="22"
        y="30"
        width="79"
        height="50"
        rx="25"
        fill="#fff5e5"
        stroke="#795461"
        strokeWidth="3"
      />
      <ellipse cx="35" cy="77" rx="12" ry="7" fill="#fff5e5" />
      <ellipse cx="86" cy="77" rx="12" ry="7" fill="#fff5e5" />
      <circle cx="44" cy="51" r="4" fill="#76534c" />
      <circle cx="79" cy="51" r="4" fill="#76534c" />
      <path d="m57 61 5 4 5-4" stroke="#c48c80" strokeWidth="3" fill="none" strokeLinecap="round" />
      <ellipse cx="32" cy="61" rx="8" ry="4" fill="#eeb3ad" />
      <ellipse cx="90" cy="61" rx="8" ry="4" fill="#eeb3ad" />
      {fed && <path d="m58 32 4-9 4 9 10 2-9 6 2 10-7-6-8 6 2-10-8-6Z" fill="#e9bd6b" />}
    </svg>
  )
}
