/** Vector Goa scene used behind hero + footer. Pure SVG, no raster assets. */
export function TropicalScene({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 500"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMax slice"
    >
      <defs>
        <linearGradient id="hh-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00593B" />
          <stop offset="100%" stopColor="#004F32" />
        </linearGradient>
      </defs>

      <circle cx="600" cy="150" r="86" fill="none" stroke="#FF168C" strokeWidth="5" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <line
          key={i}
          x1={600 - Math.sqrt(Math.max(0, 86 * 86 - Math.pow(-60 + i * 24, 2))) * 0.9}
          x2={600 + Math.sqrt(Math.max(0, 86 * 86 - Math.pow(-60 + i * 24, 2))) * 0.9}
          y1={150 - 60 + i * 24}
          y2={150 - 60 + i * 24}
          stroke="#FF168C"
          strokeWidth="5"
          strokeLinecap="round"
        />
      ))}

      <path d="M0 330 Q 200 300 400 330 T 800 330 L800 500 L0 500Z" fill="url(#hh-sea)" />
      {[0, 1, 2, 3].map((r) => (
        <path
          key={r}
          d={`M-20 ${360 + r * 34} q 40 -16 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0 t 80 0`}
          fill="none"
          stroke="#FFD400"
          strokeOpacity="0.5"
          strokeWidth="4"
          strokeLinecap="round"
        />
      ))}

      {/* beach hut */}
      <g stroke="#FFF8DD" strokeWidth="6" fill="none" strokeLinejoin="round">
        <path d="M640 330 L700 272 L760 330 Z" fill="#FFF8DD" />
        <path d="M656 330 L656 386 M744 330 L744 386 M646 386 L754 386" />
      </g>

      {/* palms */}
      <g stroke="#FFD400" strokeWidth="7" fill="none" strokeLinecap="round">
        <path d="M120 470 q 22 -110 8 -210" />
        <path d="M128 260 q -60 -34 -100 -8 M128 260 q -46 -62 -100 -60 M128 260 q 10 -70 -30 -96 M128 260 q 66 -50 116 -18 M128 260 q 44 -66 108 -50" />
        <circle cx="128" cy="262" r="8" fill="#FFD400" />
      </g>
      <g stroke="#FFF8DD" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.85">
        <path d="M250 480 q -18 -86 -6 -160" />
        <path d="M244 320 q -48 -28 -80 -6 M244 320 q -30 -52 -78 -48 M244 320 q 52 -40 92 -14 M244 320 q 34 -52 86 -40" />
      </g>

      {/* surfboard + umbrella */}
      <g transform="translate(430 400) rotate(-18)">
        <path d="M0 -70 q 24 70 0 140 q -24 -70 0 -140Z" fill="#FF168C" />
        <line x1="0" y1="-58" x2="0" y2="58" stroke="#FFF8DD" strokeWidth="4" />
      </g>
      <g transform="translate(330 420)">
        <path d="M-52 0 A52 52 0 0 1 52 0 Z" fill="#FFD400" />
        <path d="M-52 0 A52 52 0 0 1 -17 -49 L0 0 Z" fill="#FF168C" />
        <path d="M17 -49 A52 52 0 0 1 52 0 L0 0 Z" fill="#FF168C" />
        <line x1="0" y1="0" x2="0" y2="58" stroke="#FFF8DD" strokeWidth="5" />
      </g>
    </svg>
  );
}
