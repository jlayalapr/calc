'use client';

import { useApp } from '@/lib/AppContext';
import { PERSONAS, PRODUCTS, ROUTINE_STEPS } from '@/lib/data';
import { Ring } from '@/components/ui/Ring';
import { Sparkles, ScanLine, CheckCircle } from 'lucide-react';

export function Dashboard() {
  const { persona, setActiveTab, setShowScan, toggleRoutineStep, routineCheckins } = useApp();
  const p = PERSONAS[persona];
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const amSteps = ROUTINE_STEPS.AM.slice(0, 4);

  return (
    <div className="noscroll" style={{
      flex: 1, overflowY: 'auto',
      padding: '10px 0 140px',
      background: 'var(--bg)',
    }}>
      {/* Header */}
      <div style={{ padding: '6px 22px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="eyebrow">{today}</div>
          <div className="serif" style={{ fontSize: 26, lineHeight: 1.1, marginTop: 4 }}>
            Good morning, {p.name}.
          </div>
        </div>
        <button
          onClick={() => setActiveTab('profile')}
          aria-label="Open profile"
          style={{
            width: 38, height: 38, borderRadius: 19,
            background: 'var(--bg-sunken)',
            backgroundImage: `url(https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=70)`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            border: '1px solid var(--line)', padding: 0, flexShrink: 0,
          }}
        />
      </div>

      {/* Hero read card */}
      <div style={{
        margin: '0 22px',
        padding: '20px 22px 22px',
        background: 'var(--surface)',
        borderRadius: 'var(--r-lg)',
        border: '1px solid var(--line)',
        boxShadow: 'var(--shadow-1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <Sparkles size={14} color="var(--accent)" strokeWidth={1.6} />
          <span className="eyebrow" style={{ color: 'var(--accent)' }}>This morning's read</span>
        </div>
        <div className="serif" style={{ fontSize: 22, lineHeight: 1.25, letterSpacing: -0.2 }}>
          {p.hero}
        </div>
        <div style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.5, marginTop: 10 }}>
          {p.today}
        </div>
        <div style={{ display: 'flex', gap: 18, marginTop: 18, justifyContent: 'space-between' }}>
          <Ring value={p.hydration} label="Hydration" />
          <Ring value={p.barrier}   label="Barrier"  color="#7a8f6b"/>
          <Ring value={p.tone}      label="Tone"     color="#c07556"/>
        </div>
      </div>

      {/* Today's ritual */}
      <div style={{ marginTop: 28, padding: '0 22px 10px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div className="serif" style={{ fontSize: 20 }}>Today's ritual</div>
        <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>{amSteps.length} steps · 5 min</span>
      </div>

      <div style={{ padding: '0 22px', display: 'grid', gap: 10 }}>
        {amSteps.map((step, i) => {
          const key = `AM-${i}`;
          const done = routineCheckins[key] ?? false;
          const isFirst = i === 0;
          const state = done ? 'done' : isFirst ? 'now' : 'next';
          return (
            <div
              key={step.id}
              onClick={() => toggleRoutineStep(key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                background: state === 'now' ? 'var(--accent-soft)' : 'var(--surface)',
                borderRadius: 16, padding: '14px 14px',
                border: '1px solid ' + (state === 'now' ? 'rgba(74,107,74,0.2)' : 'var(--line)'),
                opacity: done ? 0.6 : 1,
                cursor: 'pointer',
              }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: 14, flexShrink: 0,
                background: done ? 'var(--accent)' : 'transparent',
                border: done ? 'none' : '1.5px solid ' + (state === 'now' ? 'var(--accent)' : 'var(--ink-4)'),
                color: done ? '#fff' : 'var(--accent)',
                display: 'grid', placeItems: 'center',
              }}>
                {done
                  ? <CheckCircle size={14} strokeWidth={2.2} color="#fff" />
                  : state === 'now'
                    ? <div style={{ width: 8, height: 8, borderRadius: 4, background: 'var(--accent)' }} />
                    : null
                }
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 14, fontFamily: 'var(--font-serif)', fontWeight: 400,
                  letterSpacing: -0.01,
                  textDecoration: done ? 'line-through' : 'none',
                  color: 'var(--ink)',
                }}>{step.step}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{step.product}</div>
              </div>
              <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>{done ? 'Done' : step.time}</span>
            </div>
          );
        })}
      </div>

      {/* Working on */}
      <div style={{ marginTop: 28, padding: '0 22px 10px' }}>
        <div className="serif" style={{ fontSize: 20 }}>You're working on</div>
      </div>
      <div className="noscroll" style={{ overflowX: 'auto', paddingLeft: 22, paddingRight: 22, paddingBottom: 4 }}>
        <div style={{ display: 'flex', gap: 12 }}>
          {p.concerns.map((concern, i) => (
            <div key={concern} style={{
              flexShrink: 0, width: 160,
              background: 'var(--surface)',
              borderRadius: 'var(--r-lg)',
              border: '1px solid var(--line)',
              padding: '16px 16px 18px',
              boxShadow: 'var(--shadow-1)',
            }}>
              <div className="eyebrow" style={{ color: 'var(--accent)' }}>Focus · Wk {i + 1}</div>
              <div className="serif" style={{ fontSize: 18, marginTop: 8, lineHeight: 1.2 }}>{concern}</div>
              <div style={{ marginTop: 14, display: 'flex', gap: 2 }}>
                {Array.from({ length: 12 }).map((_, j) => (
                  <div key={j} style={{
                    flex: 1, height: 4, borderRadius: 2,
                    background: j < (i + 1) * 3 ? 'rgba(74,107,74,0.9)' : 'var(--line-strong)',
                  }}/>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scan CTA */}
      <div style={{ margin: '24px 22px 0' }}>
        <button
          onClick={() => setShowScan(true)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 14,
            padding: '16px 18px', borderRadius: 'var(--r-lg)',
            border: '1px dashed var(--line-strong)', background: 'transparent',
            textAlign: 'left',
          }}
        >
          <ScanLine size={22} color="var(--ink-3)" strokeWidth={1.6} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink-2)' }}>Scan a new product</div>
            <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>Ingredients + fit for your skin</div>
          </div>
        </button>
      </div>
    </div>
  );
}
