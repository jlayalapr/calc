'use client';

import { useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { ROUTINE_STEPS, PERSONAS } from '@/lib/data';
import { Sparkles, Sun, Moon, Check } from 'lucide-react';

export function Routine() {
  const { persona, routineCheckins, toggleRoutineStep, setSelectedProductId } = useApp();
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');
  const p = PERSONAS[persona];
  const steps = ROUTINE_STEPS[period];
  const totalTime = period === 'AM' ? '7 min' : '6 min';

  return (
    <div className="noscroll" style={{ flex: 1, overflowY: 'auto', background: 'var(--bg)', paddingBottom: 140 }}>
      {/* Header */}
      <div style={{ padding: '16px 22px 0' }}>
        <div className="eyebrow">Built for {p.label}</div>
        <div className="serif" style={{ fontSize: 30, marginTop: 4 }}>Routine</div>
        <div style={{ fontSize: 14, color: 'var(--ink-2)', marginTop: 6, lineHeight: 1.5 }}>
          {p.ritualCopy}
        </div>
      </div>

      {/* AM/PM toggle */}
      <div style={{ padding: '18px 22px 4px' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 4, background: 'var(--bg-sunken)', borderRadius: 14, padding: 4,
        }}>
          {(['AM', 'PM'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setPeriod(tab)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '10px 0', borderRadius: 10, border: 'none',
                background: period === tab ? 'var(--surface)' : 'transparent',
                color: period === tab ? 'var(--ink)' : 'var(--ink-3)',
                fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 500,
                boxShadow: period === tab ? 'var(--shadow-1)' : 'none',
              }}
            >
              {tab === 'AM' ? <Sun size={14} strokeWidth={1.6} /> : <Moon size={14} strokeWidth={1.6} />}
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div style={{ padding: '20px 22px', position: 'relative' }}>
        {/* Vertical spine */}
        <div style={{
          position: 'absolute', left: 22 + 36, top: 34, bottom: 80,
          width: 1, background: 'var(--line-strong)',
        }}/>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {steps.map((step, i) => {
            const key = `${period}-${i}`;
            const done = routineCheckins[key] ?? false;
            return (
              <div key={step.id} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', opacity: done ? 0.55 : 1 }}>
                {/* Step number button */}
                <button
                  onClick={() => toggleRoutineStep(key)}
                  aria-label={`Toggle step ${i + 1}`}
                  style={{
                    width: 28, height: 28, borderRadius: 14, flexShrink: 0, zIndex: 1,
                    background: done ? 'var(--accent)' : 'var(--bg)',
                    border: '1.5px solid ' + (done ? 'var(--accent)' : 'var(--accent)'),
                    color: done ? '#fff' : 'var(--accent)',
                    display: 'grid', placeItems: 'center',
                    fontFamily: 'var(--font-serif)', fontSize: 13,
                  }}
                >
                  {done
                    ? <Check size={14} strokeWidth={2.2} color="#fff" />
                    : <span>{i + 1}</span>
                  }
                </button>

                {/* Card */}
                <div
                  onClick={() => step.productId && setSelectedProductId(step.productId)}
                  style={{
                    flex: 1,
                    background: 'var(--surface)', borderRadius: 16,
                    border: '1px solid var(--line)', padding: '14px 16px',
                    cursor: step.productId ? 'pointer' : 'default',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div className="serif" style={{
                      fontSize: 17, lineHeight: 1.2,
                      textDecoration: done ? 'line-through' : 'none',
                    }}>
                      {step.step}
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--ink-3)', marginLeft: 8, flexShrink: 0 }}>
                      {done ? 'Done' : `Step ${i + 1}`}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 4 }}>{step.product}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{step.time}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Coach card */}
      <div style={{ margin: '0 22px 0' }}>
        <div style={{
          padding: '18px 18px',
          background: 'var(--accent-soft)',
          borderRadius: 'var(--r-lg)',
          border: '1px solid rgba(74,107,74,0.18)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <Sparkles size={14} color="var(--accent-2)" strokeWidth={1.6} />
            <span className="eyebrow" style={{ color: 'var(--accent-2)' }}>AI Coach</span>
          </div>
          <div className="serif" style={{ fontSize: 17, lineHeight: 1.5, color: 'var(--ink)', fontStyle: 'italic' }}>
            {p.aiCoach}
          </div>
        </div>
      </div>
    </div>
  );
}
