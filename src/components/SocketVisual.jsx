/**
 * SocketVisual — Path of Exile authentic socket visualization
 *
 * Design Philosophy:
 * - Outer colored RING (not filled circle) — the gem socket color
 * - Inner golden/bronze ring — the metallic cradle/frame
 * - Dark center hole — the empty slot
 * - Golden link bars connecting sockets
 *
 * Two layout modes:
 *
 * layout="grid" (default) — Authentic 2-column zigzag:
 *   1 — 2
 *        |
 *   4 — 3
 *   |
 *   5 — 6
 *
 * layout="line" — Simple horizontal row:
 *   1 — 2 — 3 — 4 — 5 — 6
 *
 * Props:
 *   sockets: { r, g, b, w } — count of each color
 *   links:   number          — how many sockets are linked (0 = none)
 *   layout:  'grid' | 'line' — layout mode (default: 'grid')
 */

// --- Dimensions ---
const SOCKET_SIZE = 48;    // Outer socket diameter
const OUTER_RING_W = 8;    // Colored gem ring width
const CRADLE_SIZE = 28;    // Inner golden ring diameter
const CRADLE_W = 4;        // Golden ring width
const HOLE_SIZE = 20;      // Dark center hole diameter
const GAP = 68;            // Center-to-center distance
const PAD = 6;             // Edge padding
const LINK_W = 10;         // Link bar width

// Snake-order grid positions (PoE zigzag layout)
const GRID_POSITIONS = [
  { row: 0, col: 0 }, // 1  (top-left)
  { row: 0, col: 1 }, // 2  (top-right)
  { row: 1, col: 1 }, // 3  (mid-right)
  { row: 1, col: 0 }, // 4  (mid-left)
  { row: 2, col: 0 }, // 5  (bot-left)
  { row: 2, col: 1 }, // 6  (bot-right)
];

// Socket colors — outer ring (gem color)
const SOCKET_COLORS = {
  r: { light: '#ef4444', mid: '#dc2626', dark: '#991b1b' },
  g: { light: '#22c55e', mid: '#16a34a', dark: '#15803d' },
  b: { light: '#3b82f6', mid: '#2563eb', dark: '#1e40af' },
  w: { light: '#f4f4f5', mid: '#e4e4e7', dark: '#a1a1aa' },
};

function buildPositions(total, layout) {
  if (layout === 'line') {
    return Array.from({ length: total }, (_, i) => ({ row: 0, col: i }));
  }
  return GRID_POSITIONS.slice(0, total);
}

function posToXY(pos) {
  return {
    x: PAD + SOCKET_SIZE / 2 + pos.col * GAP,
    y: PAD + SOCKET_SIZE / 2 + pos.row * GAP,
  };
}

function Defs() {
  return (
    <defs>
      {/* Golden cradle gradient (warm metallic) */}
      <linearGradient id="sv-cradle" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#d4a574" />
        <stop offset="50%" stopColor="#9a7541" />
        <stop offset="100%" stopColor="#6a4a2a" />
      </linearGradient>

      {/* Cradle highlight (top edge shine) */}
      <linearGradient id="sv-cradle-hi" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#e8c090" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#d4a574" stopOpacity="0" />
      </linearGradient>

      {/* Dark socket hole (center cavity) */}
      <radialGradient id="sv-hole">
        <stop offset="0%" stopColor="#0a0908" />
        <stop offset="100%" stopColor="#1a1410" />
      </radialGradient>

      {/* Golden link bar gradient */}
      <linearGradient id="sv-link-h" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#d4a574" />
        <stop offset="50%" stopColor="#9a7541" />
        <stop offset="100%" stopColor="#6a4a2a" />
      </linearGradient>

      <linearGradient id="sv-link-v" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#d4a574" />
        <stop offset="50%" stopColor="#9a7541" />
        <stop offset="100%" stopColor="#6a4a2a" />
      </linearGradient>

      {/* Link bar highlight */}
      <linearGradient id="sv-link-hi-h" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#e8c090" stopOpacity="0.4" />
        <stop offset="50%" stopColor="#e8c090" stopOpacity="0" />
      </linearGradient>

      <linearGradient id="sv-link-hi-v" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#e8c090" stopOpacity="0.4" />
        <stop offset="50%" stopColor="#e8c090" stopOpacity="0" />
      </linearGradient>

      {/* Socket shadow */}
      <filter id="sv-shadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.6" />
      </filter>

      {/* Colored ring gradients (one per color) */}
      <linearGradient id="sv-ring-r" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ef4444" />
        <stop offset="50%" stopColor="#dc2626" />
        <stop offset="100%" stopColor="#991b1b" />
      </linearGradient>

      <linearGradient id="sv-ring-g" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#22c55e" />
        <stop offset="50%" stopColor="#16a34a" />
        <stop offset="100%" stopColor="#15803d" />
      </linearGradient>

      <linearGradient id="sv-ring-b" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="50%" stopColor="#2563eb" />
        <stop offset="100%" stopColor="#1e40af" />
      </linearGradient>

      <linearGradient id="sv-ring-w" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f4f4f5" />
        <stop offset="50%" stopColor="#e4e4e7" />
        <stop offset="100%" stopColor="#a1a1aa" />
      </linearGradient>
    </defs>
  );
}

function Socket({ x, y, color }) {
  const ringRadius = SOCKET_SIZE / 2;
  const innerRadius = ringRadius - OUTER_RING_W;
  const cradleRadius = CRADLE_SIZE / 2;
  const cradleInnerRadius = cradleRadius - CRADLE_W;
  const holeRadius = HOLE_SIZE / 2;

  return (
    <g filter="url(#sv-shadow)">
      {/* Outer colored ring (gem socket) — RING not filled circle */}
      <circle
        cx={x}
        cy={y}
        r={ringRadius}
        fill="none"
        stroke={`url(#sv-ring-${color})`}
        strokeWidth={OUTER_RING_W}
      />

      {/* Inner golden cradle ring */}
      <circle
        cx={x}
        cy={y}
        r={cradleRadius}
        fill="none"
        stroke="url(#sv-cradle)"
        strokeWidth={CRADLE_W}
      />

      {/* Cradle highlight (top arc for shine) */}
      <circle
        cx={x}
        cy={y}
        r={cradleRadius}
        fill="none"
        stroke="url(#sv-cradle-hi)"
        strokeWidth={CRADLE_W * 0.5}
        strokeDasharray={`${Math.PI * cradleRadius * 0.35} ${Math.PI * cradleRadius * 1.65}`}
        strokeDashoffset={Math.PI * cradleRadius * 0.4}
        opacity="0.6"
      />

      {/* Dark center hole (socket cavity) */}
      <circle cx={x} cy={y} r={holeRadius} fill="url(#sv-hole)" />

      {/* Subtle inner shadow on hole edge */}
      <circle
        cx={x}
        cy={y}
        r={holeRadius}
        fill="none"
        stroke="#000"
        strokeWidth="1"
        opacity="0.4"
      />
    </g>
  );
}

function Link({ positions, a, b }) {
  const pA = posToXY(positions[a]);
  const pB = posToXY(positions[b]);
  const horizontal = positions[a].row === positions[b].row;

  if (horizontal) {
    const minX = Math.min(pA.x, pB.x);
    const maxX = Math.max(pA.x, pB.x);
    const centerY = pA.y;

    return (
      <g>
        {/* Main link bar */}
        <rect
          x={minX}
          y={centerY - LINK_W / 2}
          width={maxX - minX}
          height={LINK_W}
          rx={3}
          fill="url(#sv-link-h)"
        />

        {/* Top highlight stripe */}
        <rect
          x={minX + 2}
          y={centerY - LINK_W / 2 + 1}
          width={maxX - minX - 4}
          height={LINK_W * 0.3}
          rx={1}
          fill="url(#sv-link-hi-h)"
        />

        {/* Bottom shadow edge */}
        <rect
          x={minX}
          y={centerY + LINK_W / 2 - 1}
          width={maxX - minX}
          height={1}
          rx={0.5}
          fill="#000"
          opacity="0.3"
        />
      </g>
    );
  }

  // Vertical link
  const minY = Math.min(pA.y, pB.y);
  const maxY = Math.max(pA.y, pB.y);
  const centerX = pA.x;

  return (
    <g>
      {/* Main link bar */}
      <rect
        x={centerX - LINK_W / 2}
        y={minY}
        width={LINK_W}
        height={maxY - minY}
        rx={3}
        fill="url(#sv-link-v)"
      />

      {/* Left highlight stripe */}
      <rect
        x={centerX - LINK_W / 2 + 1}
        y={minY + 2}
        width={LINK_W * 0.3}
        height={maxY - minY - 4}
        rx={1}
        fill="url(#sv-link-hi-v)"
      />

      {/* Right shadow edge */}
      <rect
        x={centerX + LINK_W / 2 - 1}
        y={minY}
        width={1}
        height={maxY - minY}
        rx={0.5}
        fill="#000"
        opacity="0.3"
      />
    </g>
  );
}

export default function SocketVisual({ sockets = {}, links = 0, layout = 'grid' }) {
  const colors = [
    ...Array(sockets.r || 0).fill('r'),
    ...Array(sockets.g || 0).fill('g'),
    ...Array(sockets.b || 0).fill('b'),
    ...Array(sockets.w || 0).fill('w'),
  ];

  const total = Math.min(colors.length, 6);
  if (total === 0) return null;

  const positions = buildPositions(total, layout);
  const maxRow = Math.max(...positions.map(p => p.row));
  const maxCol = Math.max(...positions.map(p => p.col));

  const vbWidth = PAD * 2 + maxCol * GAP + SOCKET_SIZE;
  const vbHeight = PAD * 2 + maxRow * GAP + SOCKET_SIZE;

  // Link pairs
  const linkPairs = [];
  if (links >= 2) {
    const n = Math.min(links, total);
    for (let i = 0; i < n - 1; i++) {
      linkPairs.push([i, i + 1]);
    }
  }

  return (
    <svg
      viewBox={`0 0 ${vbWidth} ${vbHeight}`}
      className="mx-auto"
      style={{ maxWidth: vbWidth, width: '100%', height: 'auto' }}
      role="img"
      aria-label={`${total} sockets${links >= 2 ? `, ${links}-linked` : ''}`}
    >
      <Defs />

      {/* Link bars (render under sockets) */}
      {linkPairs.map(([a, b]) => (
        <Link key={`l${a}-${b}`} positions={positions} a={a} b={b} />
      ))}

      {/* Sockets */}
      {colors.slice(0, total).map((color, i) => {
        const { x, y } = posToXY(positions[i]);
        return <Socket key={`s${i}`} x={x} y={y} color={color} />;
      })}
    </svg>
  );
}
