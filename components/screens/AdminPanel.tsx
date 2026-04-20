'use client';

import { useEffect, useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { supabase } from '@/lib/supabase';
import { X, RefreshCw } from 'lucide-react';

interface UserRow {
  id: string;
  name: string;
  persona: string;
  theme: string;
  created_at: string;
  checkin_count?: number;
}

export function AdminPanel() {
  const { setShowAdmin, signOut, user } = useApp();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, checkins: 0, today: 0 });

  async function load() {
    setLoading(true);
    const { data: profiles } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    const { data: checkins } = await supabase.from('routine_checkins').select('user_id, date');

    if (profiles) {
      const today = new Date().toISOString().slice(0, 10);
      const countMap: Record<string, number> = {};
      const todaySet = new Set<string>();
      (checkins ?? []).forEach((c: { user_id: string; date: string }) => {
        countMap[c.user_id] = (countMap[c.user_id] ?? 0) + 1;
        if (c.date === today) todaySet.add(c.user_id);
      });
      const rows = profiles.map((p: UserRow) => ({ ...p, checkin_count: countMap[p.id] ?? 0 }));
      setUsers(rows);
      setStats({ total: rows.length, checkins: checkins?.length ?? 0, today: todaySet.size });
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const PERSONA_COLORS: Record<string, string> = {
    combination: '#4a6b4a',
    oily: '#7a8f6b',
    dry: '#c07556',
    mature: '#8a6b4a',
  };

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 50,
      background: 'var(--bg)', display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 22px 12px', background: 'var(--ink)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(245,239,228,0.5)', fontWeight: 500 }}>
            Admin
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, color: 'var(--bg)', marginTop: 2 }}>
            Ai Glow Dashboard
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={load} style={{
            width: 34, height: 34, borderRadius: 17, border: 'none',
            background: 'rgba(255,255,255,0.1)', color: '#fff',
            display: 'grid', placeItems: 'center', cursor: 'pointer',
          }}>
            <RefreshCw size={15} strokeWidth={1.8} />
          </button>
          <button onClick={() => setShowAdmin(false)} style={{
            width: 34, height: 34, borderRadius: 17, border: 'none',
            background: 'rgba(255,255,255,0.1)', color: '#fff',
            display: 'grid', placeItems: 'center', cursor: 'pointer',
          }}>
            <X size={15} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      <div className="noscroll" style={{ flex: 1, overflowY: 'auto', padding: '20px 22px 40px' }}>
        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 24 }}>
          {[
            { label: 'Total users', value: stats.total },
            { label: 'Total check-ins', value: stats.checkins },
            { label: 'Active today', value: stats.today },
          ].map(s => (
            <div key={s.label} style={{
              background: 'var(--surface)', borderRadius: 'var(--r-md)',
              border: '1px solid var(--line)', padding: '12px 12px',
              boxShadow: 'var(--shadow-1)',
            }}>
              <div className="eyebrow" style={{ fontSize: 9 }}>{s.label}</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 28, marginTop: 4 }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Users list */}
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 18, marginBottom: 12 }}>Users</div>
        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--ink-3)', padding: '40px 0', fontSize: 14 }}>Loading…</div>
        ) : users.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--ink-3)', padding: '40px 0', fontSize: 14 }}>
            No users yet. The profiles table might need RLS policies — see instructions.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {users.map(u => (
              <div key={u.id} style={{
                background: 'var(--surface)', borderRadius: 'var(--r-md)',
                border: '1px solid var(--line)', padding: '14px 16px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--ink)' }}>{u.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{u.id.slice(0, 8)}…</div>
                  </div>
                  <span style={{
                    padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                    background: PERSONA_COLORS[u.persona] + '20',
                    color: PERSONA_COLORS[u.persona] ?? 'var(--ink-3)',
                  }}>
                    {u.persona}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
                  <div>
                    <div className="eyebrow" style={{ fontSize: 9 }}>Check-ins</div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)', marginTop: 2 }}>{u.checkin_count}</div>
                  </div>
                  <div>
                    <div className="eyebrow" style={{ fontSize: 9 }}>Theme</div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)', marginTop: 2 }}>{u.theme}</div>
                  </div>
                  <div>
                    <div className="eyebrow" style={{ fontSize: 9 }}>Joined</div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)', marginTop: 2 }}>
                      {new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Signed in as */}
        <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--line)', textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: 'var(--ink-4)', marginBottom: 10 }}>
            Signed in as {user?.email}
          </div>
          <button onClick={signOut} style={{
            padding: '10px 24px', borderRadius: 'var(--r-md)',
            border: '1px solid var(--line-strong)', background: 'transparent',
            color: 'var(--warn)', fontSize: 13, fontFamily: 'var(--font-sans)', cursor: 'pointer',
          }}>
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
