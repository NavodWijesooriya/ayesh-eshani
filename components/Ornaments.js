// Original gold line-art ornaments (SVG)

function leafPath(len, w) {
  return `M0 0 Q ${w} ${-len / 2} 0 ${-len} Q ${-w} ${-len / 2} 0 0 Z`;
}

export function Wreath({ size = 140, monogram = "A E" }) {
  const leaves = [];
  const r = 44;
  for (let side of [-1, 1]) {
    for (let i = 0; i < 11; i++) {
      const a = (200 + i * 13) * (Math.PI / 180); // from bottom up along the side
      const ang = side === -1 ? a : Math.PI - a;
      const x = 60 + r * Math.cos(ang);
      const y = 60 - r * Math.sin(ang);
      const rot = (side === -1 ? -(200 + i * 13) + 90 : (200 + i * 13) - 90) + side * 35;
      leaves.push(
        <path
          key={`${side}-${i}`}
          d={leafPath(11 - i * 0.35, 3.6)}
          transform={`translate(${x} ${y}) rotate(${rot})`}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.9"
        />
      );
    }
  }
  const [a, b] = monogram.split(" ");
  return (
    <svg className="wreath" width={size} height={size} viewBox="0 0 120 120" aria-hidden="true">
      <path d="M 26 84 A 44 44 0 0 1 40 22" fill="none" stroke="currentColor" strokeWidth="0.9" />
      <path d="M 94 84 A 44 44 0 0 0 80 22" fill="none" stroke="currentColor" strokeWidth="0.9" />
      {leaves}
      <text x="52" y="66" textAnchor="middle" className="wreath-letter">{a}</text>
      <text x="69" y="74" textAnchor="middle" className="wreath-letter">{b}</text>
    </svg>
  );
}

export function Sprig({ className = "", flip = false }) {
  const leaves = [
    [30, 250, -40, 26], [48, 215, 35, 24], [52, 180, -35, 26], [70, 150, 40, 22],
    [74, 118, -30, 22], [92, 92, 45, 20], [98, 62, -25, 18],
  ];
  return (
    <svg
      className={`sprig ${className}`}
      viewBox="0 0 160 300"
      aria-hidden="true"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <path d="M20 300 C 40 230, 60 170, 90 110 S 120 40, 118 20" fill="none" stroke="currentColor" strokeWidth="1.2" />
      {leaves.map(([x, y, r, l], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
          <path d={leafPath(l, 7)} fill="none" stroke="currentColor" strokeWidth="1" />
          <path d={`M0 0 L0 ${-l + 3}`} stroke="currentColor" strokeWidth="0.6" />
        </g>
      ))}
      {/* blossom */}
      <g transform="translate(118 22)">
        {[0, 72, 144, 216, 288].map((r) => (
          <path key={r} d="M0 0 Q 8 -8 0 -18 Q -8 -8 0 0 Z" transform={`rotate(${r})`} fill="none" stroke="currentColor" strokeWidth="1" />
        ))}
        <circle r="2.4" fill="currentColor" />
      </g>
      <g transform="translate(64 168) scale(.7)">
        {[0, 60, 120, 180, 240, 300].map((r) => (
          <path key={r} d="M0 0 Q 7 -7 0 -15 Q -7 -7 0 0 Z" transform={`rotate(${r})`} fill="none" stroke="currentColor" strokeWidth="1.3" />
        ))}
        <circle r="2.4" fill="currentColor" />
      </g>
    </svg>
  );
}

export function Divider() {
  return (
    <svg className="divider" viewBox="0 0 240 20" aria-hidden="true">
      <path d="M0 10 H95" stroke="currentColor" strokeWidth="0.8" />
      <path d="M145 10 H240" stroke="currentColor" strokeWidth="0.8" />
      <path d="M120 2 L128 10 L120 18 L112 10 Z" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="104" cy="10" r="2" fill="currentColor" />
      <circle cx="136" cy="10" r="2" fill="currentColor" />
    </svg>
  );
}
