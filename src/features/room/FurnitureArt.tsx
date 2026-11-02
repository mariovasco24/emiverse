import type { FurnitureId } from '../../domain/layout'
import type { CargoKind } from '../../domain/inventory'
import CargoArt from '../inventory/CargoArt'
export default function FurnitureArt({
  id,
  open = false,
  contents = [],
}: {
  id: FurnitureId
  open?: boolean
  contents?: CargoKind[]
}) {
  switch (id) {
    case 'bed':
      return (
        <svg viewBox="0 0 460 300" aria-hidden="true">
          <g stroke="#79566a" strokeWidth="4" strokeLinejoin="round">
            <path d="M24 270v23m412-23v23" strokeWidth="13" />
            <rect x="7" y="9" width="445" height="264" rx="35" fill="#d5a5bb" />
            <rect x="20" y="23" width="419" height="235" rx="26" fill="#f5e1cb" />
            <rect x="42" y="38" width="165" height="80" rx="23" fill="#fff0d2" />
            <rect x="250" y="38" width="165" height="80" rx="23" fill="#fff0d2" />
            <path d="M20 126h419v105q0 27-27 27H47q-27 0-27-27Z" fill="#bca5d3" />
            <path d="M24 139h411" stroke="#e5d3ec" strokeWidth="12" />
            {[85, 180, 275, 370].map((x) => (
              <path
                key={x}
                d="m0-13 4 8 10 2-8 6 2 10-8-5-8 5 2-10-8-6 10-2Z"
                transform={`translate(${x} 195)`}
                fill="#ffdfa2"
                strokeWidth="2"
              />
            ))}
          </g>
        </svg>
      )
    case 'nightstand':
      return (
        <svg viewBox="0 0 115 145" aria-hidden="true">
          <g stroke="#79566a" strokeWidth="3">
            <path d="M14 131v11m87-11v11" strokeWidth="7" />
            <rect x="5" y="62" width="105" height="70" rx="8" fill="#edb4b7" />
            <path d="M8 97h99" />
            {open && <rect x="9" y="66" width="97" height="28" rx="4" fill="#79566a" />}
            <circle cx="57" cy="84" r="4" fill="#ffdea0" />
            <circle cx="57" cy="113" r="4" fill="#ffdea0" />
            <path d="M40 61h38l-8-7H49Z" fill="#e9ce9c" />
            <path d="M59 53V25" />
            <path d="m39 4-7 25q27 12 54 0L77 4Z" fill="#e4b7d3" />
          </g>
        </svg>
      )
    case 'desk':
      return (
        <svg viewBox="0 0 245 210" aria-hidden="true">
          <g stroke="#79566a" strokeWidth="3.5" strokeLinejoin="round">
            <path d="M20 113v88m206-88v88" strokeWidth="12" />
            <rect x="3" y="94" width="238" height="23" rx="8" fill="#f3c8ab" />
            <rect x="150" y="117" width="74" height="65" rx="7" fill="#b3cbd2" />
            <circle cx="188" cy="146" r="4" fill="#ffe4a6" />
            <path d="M32 82h70v12H32Z" fill="#c8b6df" />
            <path d="m39 75 25 8 25-8-25-7Z" fill="#fff2d6" />
            <path d="M194 93V48l-30-24" fill="none" strokeWidth="6" />
            <path d="m149 18 18-12 28 22-30 17Z" fill="#e6b5c5" />
            <rect x="114" y="67" width="18" height="27" rx="3" fill="#e5c187" />
            <path d="m119 66-5-19m12 19 5-21" stroke="#a28bc4" strokeWidth="4" />
          </g>
        </svg>
      )
    case 'fridge':
      return (
        <svg viewBox="0 0 170 305" aria-hidden="true">
          <g stroke="#6c756e" strokeWidth="4" strokeLinejoin="round">
            <rect x="5" y="5" width="160" height="290" rx="22" fill="#b6d4ca" />
            <rect x="14" y="16" width="142" height="91" rx="13" fill="#d2e8d7" />
            <rect x="14" y="114" width="142" height="170" rx="13" fill="#d2e8d7" />
            <path d="M31 41v39m0 59v50" strokeWidth="7" strokeLinecap="round" />
            <rect
              x="76"
              y="143"
              width="56"
              height="68"
              rx="5"
              fill="#fff2c6"
              transform="rotate(8 76 143)"
            />
            <path d="m92 179 10-17 14 23" fill="none" stroke="#c8a4ba" />
            <circle cx="103" cy="139" r="7" fill="#e6a4b5" />
            {open && (
              <g data-open="true">
                <rect x="18" y="118" width="134" height="162" rx="8" fill="#f7f2d7" />
                <path d="M20 173h130m-130 54h130" stroke="#b6d4ca" strokeWidth="7" />
                {contents.slice(0, 6).map((kind, i) => (
                  <svg
                    key={i}
                    x={25 + (i % 3) * 38}
                    y={125 + Math.floor(i / 3) * 55}
                    width="34"
                    height="40"
                  >
                    <CargoArt kind={kind} />
                  </svg>
                ))}
                <path d="M13 114 2 131v145l11 9Z" fill="#b6d4ca" />
              </g>
            )}
          </g>
        </svg>
      )
    case 'counter':
      return (
        <svg viewBox="0 0 355 245" aria-hidden="true">
          <g stroke="#6e766c" strokeWidth="3.5" strokeLinejoin="round">
            <rect x="5" y="85" width="345" height="150" rx="9" fill="#a5cebe" />
            <path d="M125 102v131m110-131v131" />
            <path
              d="M25 124h75m45 0h65m46 0h70"
              stroke="#7cae9d"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <rect x="1" y="66" width="353" height="30" rx="7" fill="#f4dcc1" />
            <rect x="18" y="71" width="109" height="13" rx="5" fill="#bacbd0" />
            <path d="M73 67V24q0-23 21-18t16 28" fill="none" strokeWidth="7" />
            <rect x="218" y="68" width="116" height="17" rx="8" fill="#9c9c9d" />
            <ellipse cx="275" cy="44" rx="35" ry="26" fill="#e5b1bd" />
            <path d="M241 38h68m-41-21h17" />
            <rect x="255" y="154" width="70" height="62" rx="9" fill="#b8dce0" />
            <path d="m267 167 44 33" stroke="#e4f3df" strokeWidth="5" />
          </g>
        </svg>
      )
    case 'dining-table':
      return (
        <svg viewBox="0 0 250 185" aria-hidden="true">
          <g stroke="#826070" strokeWidth="4" strokeLinejoin="round">
            <path d="m51 72-16 101m164-101 16 101" strokeWidth="13" />
            <ellipse cx="125" cy="68" rx="119" ry="59" fill="#f2c99d" />
            <ellipse cx="125" cy="60" rx="112" ry="51" fill="#ffe1b1" />
            <ellipse cx="127" cy="63" rx="39" ry="24" fill="#f5ead3" />
            <ellipse cx="127" cy="61" rx="26" ry="15" fill="#edb69b" />
            <circle cx="117" cy="59" r="3" fill="#a17b68" />
            <circle cx="137" cy="61" r="3" fill="#a17b68" />
            <path d="M48 41v-23h30v23q-15 12-30 0" fill="#c9ddd5" />
            <path d="M78 23q23-5 15 13-3 7-15 4" fill="none" />
          </g>
        </svg>
      )

    case 'sofa':
      return (
        <svg viewBox="-20 -165 330 205" aria-hidden="true">
          <g stroke="#79584f" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round">
            <path d="M17-20v40m246-40v40" stroke="#956b63" strokeWidth="12" />
            <rect x="0" y="-155" width="280" height="154" rx="35" fill="#89bbaa" />
            <path d="M14-150q116-15 248 0" stroke="#b2dac1" strokeWidth="10" />
            <rect x="-12" y="-83" width="45" height="90" rx="17" fill="#b5d6b5" />
            <rect x="247" y="-83" width="45" height="90" rx="17" fill="#b5d6b5" />
            <rect x="29" y="-70" width="219" height="66" rx="17" fill="#98c6b1" />
            <path d="M140-67v59" stroke="#709a92" />
            <rect
              x="50"
              y="-125"
              width="59"
              height="61"
              rx="12"
              fill="#ffdc8a"
              transform="rotate(-12 50 -125)"
            />
            <path d="m70-99 10 9 10-12" stroke="#d7a76a" fill="none" />
            <rect
              x="185"
              y="-134"
              width="50"
              height="67"
              rx="14"
              fill="#f4b8bc"
              transform="rotate(13 185 -134)"
            />
          </g>
        </svg>
      )
    case 'table':
      return (
        <svg viewBox="-90 -30 180 75" aria-hidden="true">
          <g stroke="#79584f" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round">
            <path d="M-55-7-63 35m118-42 8 42" stroke="#a07468" strokeWidth="9" />
            <ellipse rx="84" ry="25" fill="#edbf94" />
            <rect x="-31" y="-16" width="61" height="14" rx="4" fill="#9dbcc1" />
            <path d="M-26-10h50" stroke="#dff0dc" />
          </g>
        </svg>
      )
    case 'picture':
      return (
        <svg viewBox="-65 -75 130 150" aria-hidden="true">
          <g stroke="#79584f" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round">
            <rect x="-61" y="-70" width="122" height="140" rx="10" fill="#bd8c80" />
            <rect x="-51" y="-60" width="102" height="120" rx="5" fill="#fff3d2" />
            <path d="M-40 50 0-19l42 69Z" fill="#9bcaa6" />
            <circle cx="22" cy="-29" r="18" fill="#f7ca72" />
            <path d="M-23 12q23-20 43 0" fill="none" stroke="#f3a2aa" strokeWidth="8" />
          </g>
        </svg>
      )
    case 'hanging-plant':
      return (
        <svg viewBox="-70 -90 140 135" aria-hidden="true">
          <g stroke="#79584f" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round">
            <path d="M0-54v-27" stroke="#8b6c73" strokeWidth="4" />
            <path d="M-63-49Q0-90 63-49v69H-63Z" fill="#b3c4b3" />
            <path d="M-57 20v15H57V20" fill="#e7b99c" />
            <path
              d="M-39-47q2 34 22 45-11-44 17-61Q15-34 2-1q33-1 31-40 30 24 12 59"
              fill="#81ad8d"
              stroke="#638b76"
            />
          </g>
        </svg>
      )
    case 'house-plant':
      return (
        <svg viewBox="-60 -215 125 225" aria-hidden="true">
          <g stroke="#79584f" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round">
            <rect x="-32" y="-100" width="64" height="100" rx="12" fill="#ecae91" />
            <path d="M-33-78h66" stroke="#b78070" />
            <path d="M0-101v-93" stroke="#75a47c" strokeWidth="7" />
            <path
              d="M-1-145q-72-17-48-65 44 6 48 65m3-16q16-63 56-46-1 45-56 46"
              fill="#a2c78d"
              stroke="#719c79"
            />
          </g>
        </svg>
      )
    case 'bench':
      return (
        <svg viewBox="-25 -90 210 160" aria-hidden="true">
          <g stroke="#79584f" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round">
            <path d="M0 0v60m160-60v60" stroke="#8c6b67" strokeWidth="12" />
            <rect x="-14" y="-80" width="188" height="78" rx="10" fill="#e9a7b1" />
            <path d="M-12-52h184m-184 26h184" stroke="#ba7f99" />
            <rect x="-20" y="-5" width="200" height="21" rx="6" fill="#f8c3bb" />
          </g>
        </svg>
      )
    case 'wardrobe':
      return (
        <svg viewBox="-102 -300 204 315" aria-hidden="true">
          <g stroke="#79584f" strokeWidth="3.5" strokeLinejoin="round">
            <path d="M-79-5v16m158-16v16" strokeWidth="10" />
            <rect x="-96" y="-290" width="192" height="290" rx="12" fill="#be8a88" />
            <rect x="-84" y="-279" width="168" height="266" rx="7" fill="#f1c4b3" />
            <path d="M0-278v265" />
            <rect x="-73" y="-261" width="61" height="202" rx="29" fill="#e8afbd" />
            <rect x="12" y="-261" width="61" height="202" rx="29" fill="#e8afbd" />
            <path
              d="M-60-222q13-10 29-2m55-2 24-10m-24 25 35-16"
              stroke="#f9d9cd"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <circle cx="-17" cy="-132" r="5" fill="#ffde87" />
            <circle cx="17" cy="-132" r="5" fill="#ffde87" />
            <path d="m-22-33 22-13 22 13" fill="none" stroke="#bd8d94" />
          </g>
        </svg>
      )
  }
}
