/**
 * PoE-styled cluster jewel diagram (SVG) — purely illustrative.
 * Always shows positions 1 & 3 as desired (green) and position 2 as ignored (red).
 */
export default function ClusterJewelDiagram() {
  return (
    <div className="relative w-full max-w-[420px] aspect-square">
      <svg
        viewBox="0 0 512 512"
        className="w-full h-full select-none"
        role="img"
        aria-label="Cluster Jewel diagram. Positions 1 and 3 are desired notables. Position 2 is the ignored middle."
      >
        <defs>
          <filter id="softNoise" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="2"
              stitchTiles="stitch"
              result="n"
            />
            <feColorMatrix
              in="n"
              type="matrix"
              values="
                0 0 0 0 0.15
                0 0 0 0 0.15
                0 0 0 0 0.15
                0 0 0 0.08 0
              "
              result="n2"
            />
            <feComposite in="n2" in2="SourceGraphic" operator="over" />
          </filter>

          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#000" floodOpacity="0.6" />
          </filter>

          <filter id="gemGlowGreen" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#2dd4bf" floodOpacity="0.25" />
            <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="#22c55e" floodOpacity="0.12" />
          </filter>

          <filter id="gemGlowBlue" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="7" floodColor="#60a5fa" floodOpacity="0.22" />
          </filter>

          <filter id="gemGlowRed" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#ef4444" floodOpacity="0.18" />
          </filter>

          <linearGradient id="bronze" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#d4b36a" stopOpacity="0.8" />
            <stop offset="0.4" stopColor="#b08b44" stopOpacity="0.85" />
            <stop offset="0.75" stopColor="#8b6a2f" stopOpacity="0.9" />
            <stop offset="1" stopColor="#e2c17a" stopOpacity="0.75" />
          </linearGradient>

          <radialGradient id="stone" cx="50%" cy="40%" r="70%">
            <stop offset="0" stopColor="#27272a" />
            <stop offset="0.55" stopColor="#18181b" />
            <stop offset="1" stopColor="#0b0b0f" />
          </radialGradient>

          <radialGradient id="plate" cx="45%" cy="35%" r="80%">
            <stop offset="0" stopColor="#141419" />
            <stop offset="1" stopColor="#07070a" />
          </radialGradient>
        </defs>

        {/* Plate */}
        <g filter="url(#softShadow)">
          <rect
            x="64" y="64" width="384" height="384" rx="28"
            fill="url(#plate)" stroke="rgba(255,255,255,0.06)"
          />
        </g>

        {/* Ring */}
        <g filter="url(#softNoise)">
          <circle cx="256" cy="270" r="155" fill="none" stroke="url(#stone)" strokeWidth="42" />
          <circle cx="256" cy="270" r="155" fill="none" stroke="url(#bronze)" strokeWidth="6" opacity="0.7" />
          <circle cx="256" cy="270" r="132" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
        </g>

        {/* Arc highlight between positions 1 and 3 */}
        <path
          d="M 140 330 A 140 140 0 0 0 372 330"
          fill="none"
          stroke="rgba(45, 212, 191, 0.25)"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Blue socketed gems (left + right) */}
        <GemDiamond x={128} y={208} />
        <GemDiamond x={384} y={208} />

        {/* Bottom anchor node */}
        <circle cx="256" cy="414" r="18" fill="#0b0b0f" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />

        {/* Position 2 — ignored (top) */}
        <NotableSocket x={256} y={122} n={2} state="ignored" />

        {/* Position 1 — desired (bottom-left) */}
        <NotableSocket x={150} y={305} n={1} state="selected" />

        {/* Position 3 — desired (bottom-right) */}
        <NotableSocket x={362} y={305} n={3} state="selected" />

        {/* Position labels near ring */}
        <text x="205" y="290" fill="rgba(255,255,255,0.35)" fontSize="18" fontFamily="ui-sans-serif">1</text>
        <text x="252" y="185" fill="rgba(255,255,255,0.28)" fontSize="18" fontFamily="ui-sans-serif">2</text>
        <text x="308" y="290" fill="rgba(255,255,255,0.35)" fontSize="18" fontFamily="ui-sans-serif">3</text>
      </svg>
    </div>
  );
}

function NotableSocket({ x, y, n, state }) {
  const isSelected = state === 'selected';
  const isIgnored = state === 'ignored';

  const rim = isIgnored
    ? 'rgba(248,113,113,0.55)'
    : 'rgba(34,197,94,0.55)';
  const fill = isIgnored ? '#220709' : '#062012';
  const filter = isIgnored ? 'url(#gemGlowRed)' : 'url(#gemGlowGreen)';

  return (
    <g transform={`translate(${x} ${y})`} filter={filter}>
      <circle r="38" fill="rgba(0,0,0,0.35)" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
      <circle r="30" fill={fill} stroke={rim} strokeWidth="3" />
      {isIgnored ? (
        <g opacity="0.9">
          <circle r="16" fill="#7f1d1d" opacity="0.55" />
          <path d="M -8 -2 L 10 6" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" />
          <path d="M -2 -10 L 6 12" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
        </g>
      ) : (
        <g>
          <circle r="16" fill="#14532d" />
          <circle r="10" fill="rgba(34,197,94,0.55)" />
        </g>
      )}
      <text
        y="6"
        textAnchor="middle"
        fontSize="16"
        fontFamily="ui-sans-serif"
        fill={isIgnored ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.65)'}
      >
        {n}
      </text>
    </g>
  );
}

function GemDiamond({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`} filter="url(#gemGlowBlue)">
      <circle r="34" fill="rgba(0,0,0,0.35)" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
      <path d="M 0 -22 L 18 0 L 0 22 L -18 0 Z" fill="#0b1a33" stroke="rgba(255,255,255,0.14)" strokeWidth="2" />
      <path d="M 0 -22 L 0 22" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      <path d="M -18 0 L 18 0" stroke="rgba(255,255,255,0.10)" strokeWidth="1" />
      <circle r="8" fill="rgba(96,165,250,0.35)" />
    </g>
  );
}
