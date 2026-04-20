'use client';

import { useEffect, useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { PERSONAS } from '@/lib/data';
import { ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const SETTINGS = [
  'Skin goals & concerns',
  'Reminders',
  'Environmental inputs',
  'Sync from Apple Health',
  'Data & privacy',
];

export function Profile() {
  const { persona, theme, setTheme, setPersona, signOut, user, setShowAdmin, profileName } = useApp();
  const isAdmin = user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL || false;
  const p = PERSONAS[persona];

  const [streakDays, setStreakDays] = useState(0);
  const [last14, setLast14] = useState<boolean[]>(Array(14).fill(false));
  const [checkinCount, setCheckinCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    async function loadStreak() {
      const { data } = await supabase
        .from('routine_checkins')
        .select('date')
        .eq('user_id', user!.id)
        .order('date', { ascending: false });

      if (!data) return;

      const uniqueDates = [...new Set(data.map((r: { date: string }) => r.date))].sort().reverse() as string[];
      setCheckinCount(uniqueDates.length);

      let streak = 0;
      const today = new Date();
      for (let i = 0; i < uniqueDates.length; i++) {
        const expected = new Date(today);
        expected.setDate(today.getDate() - i);
        if (uniqueDates[i] === expected.toISOString().slice(0, 10)) streak++;
        else break;
      }
      setStreakDays(streak);

      const dateSet = new Set(uniqueDates);
      setLast14(Array.from({ length: 14 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (13 - i));
        return dateSet.has(d.toISOString().slice(0, 10));
      }));
    }
    loadStreak();
  }, [user]);

  const completedDays = last14.filter(Boolean).length;

  return (
    <div className="noscroll" style={{ flex: 1, overflowY: 'auto', background: 'var(--bg)', paddingBottom: 140 }}>
      {/* Header */}
      <div style={{ padding: '16px 22px 0' }}>
        <div className="eyebrow">Profile</div>
        <div className="serif" style={{ fontSize: 30, marginTop: 4 }}>{profileName || p.name}</div>
        <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>{p.label}</div>
      </div>

      {/* Streak card */}
      <div style={{ margin: '20px 22px 0' }}>
        <div style={{
          background: 'var(--ink)', borderRadius: 'var(--r-lg)',
          padding: '20px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <div className="eyebrow" style={{ color: 'rgba(245,239,228,0.5)' }}>Day streak</div>
            <div className="serif" style={{ fontSize: 44, color: 'var(--bg)', marginTop: 4, lineHeight: 1 }}>{streakDays}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3 }}>
            {last14.map((complete, i) => (
              <div key={i} style={{
                width: 14, height: 24, borderRadius: 3,
                background: complete ? '#8aa880' : 'rgba(255,255,255,0.15)',
              }}/>
            ))}
          </div>
        </div>
        <div style={{ marginTop: 8, fontSize: 12, color: 'var(--ink-3)', textAlign: 'center' }}>
          {completedDays > 0
            ? `Routine completed ${completedDays} of last 14 days.`
            : 'Complete your routine to start a streak.'}
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ margin: '20px 22px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[
          { label: 'Skin persona', value: persona.charAt(0).toUpperCase() + persona.slice(1), delta: p.label.split(' · ')[1] || '' },
          { label: 'Check-in days', value: String(checkinCount), delta: streakDays > 0 ? `${streakDays}-day streak` : 'No streak yet' },
          { label: 'Hydration', value: `${p.hydration}%`, delta: 'Current reading' },
          { label: 'Barrier avg', value: `${p.barrier}%`, delta: 'Current reading' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: 'var(--surface)', borderRadius: 'var(--r-lg)',
            border: '1px solid var(--line)', padding: '16px 16px',
            boxShadow: 'var(--shadow-1)',
          }}>
            <div className="eyebrow" style={{ fontSize: 10 }}>{stat.label}</div>
            <div className="serif" style={{ fontSize: 30, marginTop: 6 }}>{stat.value}</div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 4 }}>{stat.delta}</div>
          </div>
        ))}
      </div>

      {/* Theme + Persona switchers */}
      <div style={{ margin: '24px 22px 0' }}>
        <div className="serif" style={{ fontSize: 20, marginBottom: 12 }}>Appearance</div>
        <div style={{
          background: 'var(--surface)', borderRadius: 'var(--r-lg)',
          border: '1px solid var(--line)', overflow: 'hidden',
        }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, color: 'var(--ink-2)' }}>Theme</span>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: 3, background: 'var(--bg-sunken)', borderRadius: 8, padding: 3,
            }}>
              {(['light', 'dark'] as const).map(t => (
                <button key={t} onClick={() => setTheme(t)} style={{
                  padding: '4px 12px', borderRadius: 6, border: 'none',
                  background: theme === t ? 'var(--surface)' : 'transparent',
                  color: theme === t ? 'var(--ink)' : 'var(--ink-3)',
                  fontSize: 12, fontWeight: 500,
                  boxShadow: theme === t ? 'var(--shadow-1)' : 'none',
                  cursor: 'pointer',
                }}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 14, color: 'var(--ink-2)' }}>Skin persona</span>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: 3, background: 'var(--bg-sunken)', borderRadius: 8, padding: 3,
            }}>
              {(['combination', 'oily', 'dry', 'mature'] as const).map(pKey => (
                <button key={pKey} onClick={() => setPersona(pKey)} style={{
                  padding: '5px 8px', borderRadius: 6, border: 'none',
                  background: persona === pKey ? 'var(--surface)' : 'transparent',
                  color: persona === pKey ? 'var(--ink)' : 'var(--ink-3)',
                  fontSize: 11, fontWeight: 500, textAlign: 'center',
                  boxShadow: persona === pKey ? 'var(--shadow-1)' : 'none',
                  cursor: 'pointer',
                }}>
                  {pKey.charAt(0).toUpperCase() + pKey.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Settings list */}
      <div style={{ margin: '24px 22px 0' }}>
        <div className="serif" style={{ fontSize: 20, marginBottom: 12 }}>Settings</div>
        <div style={{
          background: 'var(--surface)', borderRadius: 'var(--r-lg)',
          border: '1px solid var(--line)', overflow: 'hidden',
        }}>
          {SETTINGS.map((setting, i) => (
            <button key={setting} style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '15px 16px', background: 'transparent', border: 'none',
              borderTop: i > 0 ? '1px solid var(--line)' : 'none',
              color: 'var(--ink-2)', fontSize: 14, textAlign: 'left', cursor: 'pointer',
            }}>
              {setting}
              <ChevronRight size={14} color="var(--ink-4)" strokeWidth={2} />
            </button>
          ))}
        </div>
      </div>

      {/* Account */}
      <div style={{ margin: '24px 22px 0' }}>
        <div style={{ fontSize: 12, color: 'var(--ink-4)', marginBottom: 10, textAlign: 'center' }}>
          Signed in as {user?.email}
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowAdmin(true)}
            style={{
              width: '100%', padding: '14px 0', borderRadius: 'var(--r-md)',
              border: 'none', background: 'var(--ink)',
              color: 'var(--bg)', fontSize: 14, fontFamily: 'var(--font-sans)',
              marginBottom: 10, cursor: 'pointer',
            }}
          >
            Admin panel →
          </button>
        )}
        <button
          onClick={signOut}
          style={{
            width: '100%', padding: '14px 0', borderRadius: 'var(--r-md)',
            border: '1px solid var(--line-strong)', background: 'transparent',
            color: 'var(--warn)', fontSize: 14, fontFamily: 'var(--font-sans)', cursor: 'pointer',
          }}
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
