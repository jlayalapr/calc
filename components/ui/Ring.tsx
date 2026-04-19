'use client';

interface RingProps {
  value: number;
  label: string;
  size?: number;
  stroke?: number;
  color?: string;
}

export function Ring({ value, label, size = 78, stroke = 6, color = 'var(--accent)' }: RingProps) {
  const r = (size - stroke) / 2;
  const C = 2 * Math.PI * r;
  const off = C - (C * value) / 100;
  return (
    <div style={{ width: size, textAlign: 'center' }}>
      <svg width={size} height={size} style={{ display: 'block' }}>
        <circle cx={size/2} cy={size/2} r={r} stroke="var(--line-strong)" strokeWidth={stroke} fill="none"/>
        <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={stroke} fill="none"
          strokeDasharray={C} strokeDashoffset={off} strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`} />
        <text x="50%" y="52%" dominantBaseline="middle" textAnchor="middle"
          style={{ fontFamily: 'var(--font-serif)', fontSize: size * 0.32, fill: 'var(--ink)' }}>
          {value}
        </text>
      </svg>
      <div className="eyebrow" style={{ marginTop: 6 }}>{label}</div>
    </div>
  );
}
