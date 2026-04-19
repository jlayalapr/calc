'use client';

import { NavTab } from '@/lib/types';
import { Home, Layers, ScanLine, Clock, User } from 'lucide-react';

interface TabBarProps {
  active: NavTab;
  onNav: (tab: NavTab) => void;
  dark?: boolean;
}

const items: { key: NavTab; label: string; Icon: React.ElementType; primary?: boolean }[] = [
  { key: 'home',    label: 'Today',   Icon: Home },
  { key: 'shelf',   label: 'Shelf',   Icon: Layers },
  { key: 'scan',    label: 'Scan',    Icon: ScanLine, primary: true },
  { key: 'routine', label: 'Routine', Icon: Clock },
  { key: 'profile', label: 'You',     Icon: User },
];

export function TabBar({ active, onNav, dark = false }: TabBarProps) {
  return (
    <div style={{
      position: 'absolute', left: 12, right: 12, bottom: 12, zIndex: 30,
      background: dark ? 'rgba(37,34,30,0.9)' : 'rgba(255,255,255,0.85)',
      borderRadius: 28, padding: '10px 8px',
      backdropFilter: 'blur(24px) saturate(160%)',
      WebkitBackdropFilter: 'blur(24px) saturate(160%)',
      boxShadow: 'var(--shadow-2)',
      border: '1px solid var(--line)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
    }}>
      {items.map(it => {
        const isActive = it.key === active;
        if (it.primary) {
          return (
            <button key={it.key} onClick={() => onNav(it.key)} aria-label="Scan" style={{
              width: 52, height: 52, borderRadius: 26, border: 'none',
              background: 'var(--accent)', color: 'var(--accent-ink)',
              display: 'grid', placeItems: 'center',
              boxShadow: '0 8px 20px rgba(74,107,74,0.35)',
              transform: 'translateY(-6px)',
            }}>
              <it.Icon size={22} strokeWidth={1.6} />
            </button>
          );
        }
        return (
          <button key={it.key} onClick={() => onNav(it.key)} style={{
            flex: 1, background: 'transparent', border: 'none',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
            padding: '6px 0',
            color: isActive ? 'var(--ink)' : 'var(--ink-3)',
          }}>
            <it.Icon size={22} strokeWidth={1.6} />
            <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: 0.2 }}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}
