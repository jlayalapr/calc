'use client';

export function StatusBar({ dark = false }: { dark?: boolean }) {
  const c = dark ? '#f5efe4' : '#1a1a17';
  return (
    <div style={{
      height: 54, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      padding: '0 28px 8px', fontWeight: 600, fontSize: 15, color: c, letterSpacing: -0.2,
      flexShrink: 0,
    }}>
      <span>9:41</span>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <svg width="17" height="11" viewBox="0 0 17 11">
          <g fill={c}>
            <rect x="0" y="7" width="3" height="4" rx="0.7"/>
            <rect x="4.5" y="5" width="3" height="6" rx="0.7"/>
            <rect x="9" y="2.5" width="3" height="8.5" rx="0.7"/>
            <rect x="13.5" y="0" width="3" height="11" rx="0.7"/>
          </g>
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke={c} strokeOpacity="0.4" fill="none"/>
          <rect x="2" y="2" width="16" height="8" rx="1.5" fill={c}/>
          <path d="M23 4v4c0.7-0.2 1.3-1 1.3-2S23.7 4.2 23 4z" fill={c} fillOpacity="0.4"/>
        </svg>
      </div>
    </div>
  );
}
