import type { CargoKind } from '../../domain/inventory'
export default function CargoArt({ kind }: { kind: CargoKind }) {
  const drawing = (() => {
    switch (kind) {
      case 'apple':
        return (
          <>
            <path
              d="M50 29q-28-20-36 13-7 40 24 52 12 5 15-3 33 9 35-34 2-36-31-28Z"
              fill="#f18c97"
            />
            <path d="m50 31 5-18m1 9q20-20 24-4-13 16-24 4" fill="#97c88a" />
            <path d="M28 44q-8 11-6 20" stroke="#ffd5cc" strokeWidth="6" />
          </>
        )
      case 'banana':
        return (
          <>
            <path d="M19 24q3 49 47 49 17 0 21-7-16 37-48 22Q5 72 13 28Z" fill="#f9d777" />
            <path d="M23 33q4 41 42 47" fill="none" stroke="#e8ba69" />
            <path d="m15 27 1-11 10 3-4 10m64 35 7-5 1 10" fill="#ac8c68" />
          </>
        )
      case 'carrot':
        return (
          <>
            <path d="m35 38 38 9-42 52q-9 11-8-4Z" fill="#f3ac6e" />
            <path d="m41 38-9-25 17 16 3-23 9 25 19-14-10 30" fill="#9dcc91" />
            <path d="m34 56 14 5m-18 13 10 4" stroke="#cf895e" />
          </>
        )
      case 'milk':
        return (
          <>
            <path d="M23 32 35 13h35l10 19v65H23Z" fill="#fdf3d9" />
            <path d="M23 32h57v24H23Z" fill="#b5dace" />
            <path d="m35 13 10 19v65m0-65h35" fill="none" />
            <path d="M52 65h19v22H52Z" fill="#e6c2d5" />
            <path d="M39 19h24" stroke="#9ec7bb" strokeWidth="5" />
          </>
        )
      case 'juice':
        return (
          <>
            <path d="M29 31h45v64H29Z" fill="#f1c57b" />
            <path d="m29 31 9-15h27l9 15" fill="#f7e8c4" />
            <path d="M46 32V8h22" fill="none" stroke="#bf92c3" strokeWidth="5" />
            <rect x="35" y="48" width="33" height="31" rx="9" fill="#fff0ca" />
            <circle cx="51" cy="64" r="10" fill="#efa977" />
          </>
        )
      case 'cheese':
        return (
          <>
            <path d="m15 63 59-32 14 30v28H15Z" fill="#f7d779" />
            <path d="M15 63h73" />
            <circle cx="39" cy="76" r="6" fill="#e8b965" />
            <circle cx="73" cy="79" r="4" fill="#e8b965" />
            <ellipse cx="61" cy="50" rx="8" ry="4" fill="#e8b965" />
          </>
        )
      case 'bread':
        return (
          <>
            <path d="M15 63q-3-34 23-35 9-20 28-4 30 1 22 38v27H15Z" fill="#ddb18a" />
            <path d="M24 62q0-24 18-24 11-17 21-5 21-1 17 29v17H24Z" fill="#f5d7a5" />
            <path d="m39 47-6 11m24-18-6 13m23-9-6 11" stroke="#dbb985" strokeWidth="4" />
          </>
        )
      case 'cupcake':
        return (
          <>
            <path d="m24 59 9 36h39l9-36" fill="#b5d5cf" />
            <path d="M21 60q-9-19 10-24 4-22 21-15 21-7 21 15 21 6 10 24Z" fill="#edacc7" />
            <path d="m38 65 4 22m21-22-4 22" stroke="#edf4df" strokeWidth="4" />
            <circle cx="52" cy="20" r="8" fill="#e28c91" />
          </>
        )
      case 'flower':
      case 'plant':
        return (
          <>
            <path
              d="M51 76V43m0 20q-28-15-24-3 5 15 24 9m1-7q24-20 24-4-3 12-24 11"
              fill="#9dcc94"
            />
            {[0, 72, 144, 216, 288].map((a) => (
              <ellipse
                key={a}
                cx="51"
                cy="27"
                rx="10"
                ry="17"
                transform={`rotate(${a} 51 42)`}
                fill="#eeb2c8"
              />
            ))}
            <circle cx="51" cy="42" r="11" fill="#f7db88" />
            <path d="m26 77 8 22h34l8-22Z" fill="#c6b6dd" />
          </>
        )
      case 'toy':
      case 'pet':
        return (
          <>
            <circle cx="27" cy="26" r="15" fill="#cfa684" />
            <circle cx="74" cy="26" r="15" fill="#cfa684" />
            <ellipse cx="50" cy="74" rx="27" ry="27" fill="#cfa684" />
            <circle cx="50" cy="43" r="32" fill={kind === 'pet' ? '#fff0d2' : '#e4bf9b'} />
            <ellipse cx="50" cy="56" rx="16" ry="12" fill="#fff0d2" />
            <circle cx="38" cy="42" r="3" fill="#78586a" />
            <circle cx="64" cy="42" r="3" fill="#78586a" />
            <path d="m45 52 5 5 6-5m-6 5v5" fill="#a87982" />
            <path d="m33 77 17-9 18 9-18 8Z" fill="#dfadc7" />
          </>
        )
      case 'music':
        return (
          <>
            <rect x="10" y="30" width="80" height="65" rx="10" fill="#e6b1c1" />
            <circle cx="43" cy="61" r="24" fill="#7c667b" />
            <circle cx="43" cy="61" r="10" fill="#b6d6c8" />
            <path d="M75 39v28l-9 8" fill="none" stroke="#f9e7be" strokeWidth="6" />
          </>
        )
      case 'art':
        return (
          <>
            <path d="m29 100 12-89m30 89L59 11" fill="none" strokeWidth="7" />
            <rect x="18" y="22" width="65" height="61" rx="5" fill="#fff0cf" />
            <path d="M27 67q13-40 26-5 15-30 23 5" fill="#d5b2d6" />
            <circle cx="64" cy="39" r="9" fill="#f4d486" />
          </>
        )
      case 'gift':
        return (
          <>
            <rect x="15" y="40" width="72" height="54" rx="6" fill="#c9b1dc" />
            <path d="M11 35h80v16H11Z" fill="#edb6c5" />
            <path d="M46 40v54h14V40Z" fill="#ffe4ad" />
            <path d="M52 35Q15-6 21 25q4 12 31 10Q89-6 81 25q-3 12-29 10Z" fill="#ffe4ad" />
          </>
        )
    }
  })()
  return (
    <svg className="cargo-art" viewBox="0 0 100 110" aria-hidden="true">
      <g stroke="#826375" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
        {drawing}
      </g>
    </svg>
  )
}
