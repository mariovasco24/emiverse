import type { FurnitureId } from '../../domain/layout'
export default function FurnitureArt({ id }: { id: FurnitureId }) {
  switch (id) {
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
