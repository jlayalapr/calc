'use client';

interface PillProps {
  children: React.ReactNode;
  tone?: 'default' | 'accent' | 'warn';
}

const tones = {
  default: { bg: 'var(--bg-sunken)', fg: 'var(--ink-2)' },
  accent:  { bg: 'var(--accent-soft)', fg: 'var(--accent-2)' },
  warn:    { bg: 'var(--warn-soft)', fg: 'var(--warn)' },
};

export function Pill({ children, tone = 'default' }: PillProps) {
  const t = tones[tone];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '4px 10px', borderRadius: 999,
      fontSize: 11, fontWeight: 500, letterSpacing: 0.2,
      background: t.bg, color: t.fg,
    }}>{children}</span>
  );
}
