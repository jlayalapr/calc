'use client';

import { useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { PERSONAS } from '@/lib/data';
import { Sparkles, Sun, Moon, Check, ScanLine } from 'lucide-react';

const TYPE_TO_STEP: Record<string, string> = {
  Cleanser: 'Cleanse',
  Serum: 'Treat',
  Moisturizer: 'Moisturize',
  Sunscreen: 'Protect',
  Exfoliant: 'Exfoliate',
  Toner: 'Tone',
  'Eye Cream': 'Eye care',
  Oil: 'Oil',
  Other: 'Apply',
};

export function Routine() {
  const { persona, routineCheckins, toggleRoutineStep, setSelectedProductId, userProducts, setShowScan } = useApp();
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');
  const p = PERSONAS[persona];

  const periodProducts = userProducts.filter(pr => pr.steps.includes(period));

  const totalTime = periodProducts.length > 0
    ? `${Math.max(5, periodProducts.length * 2)} min`
    : '—';

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
                cursor: 'pointer',
              }}
            >
              {tab === 'AM' ? <Sun size={14} strokeWidth={1.6} /> : <Moon size={14} strokeWidth={1.6} />}
              {tab}
            </button>
          ))}
        </div>
      </div>

      {periodProducts.length === 0 ? (
        <div style={{
          margin: '40px 22px 0', display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 14, textAlign: 'center',
        }}>
          <div style={{
            width: 60, height: 60, borderRadius: 30,
            background: 'var(--bg-sunken)', border: '1px solid var(--line)',
            display: 'grid', placeItems: 'center',
          }}>
            <ScanLine size={24} color="var(--ink-3)" strokeWidth={1.4} />
          </div>
          <div>
            <div className="serif" style={{ fontSize: 20, color: 'var(--ink)', marginBottom: 6 }}>
              No {period} products yet
            </div>
            <div style={{ fontSize: 13, color: 'var(--ink-3)', lineHeight: 1.5 }}>
              Scan a product and mark it as {period} to build your routine.
            </div>
          </div>
          <button
            onClick={() => setShowScan(true)}
            style={{
              padding: '12px 24px', borderRadius: 12, border: 'none',
              background: 'var(--accent)', color: 'var(--accent-ink)',
              fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 500, cursor: 'pointer',
            }}
          >Scan a product</button>
        </div>
      ) : (
        <div style={{ padding: '20px 22px', position: 'relative' }}>
          {/* Vertical spine */}
          <div style={{
            position: 'absolute', left: 22 + 36, top: 34, bottom: 80,
            width: 1, background: 'var(--line-strong)',
          }}/>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {periodProducts.map((product, i) => {
              const key = `${period}-${i}`;
              const done = routineCheckins[key] ?? false;
              const stepName = TYPE_TO_STEP[product.type] || 'Apply';
              return (
                <div key={product.id} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', opacity: done ? 0.55 : 1 }}>
                  {/* Step number button */}
                  <button
                    onClick={() => toggleRoutineStep(key)}
                    aria-label={`Toggle step ${i + 1}`}
                    style={{
                      width: 28, height: 28, borderRadius: 14, flexShrink: 0, zIndex: 1,
                      background: done ? 'var(--accent)' : 'var(--bg)',
                      border: '1.5px solid var(--accent)',
                      color: done ? '#fff' : 'var(--accent)',
                      display: 'grid', placeItems: 'center',
                      fontFamily: 'var(--font-serif)', fontSize: 13, cursor: 'pointer',
                    }}
                  >
                    {done
                      ? <Check size={14} strokeWidth={2.2} color="#fff" />
                      : <span>{i + 1}</span>
                    }
                  </button>

                  {/* Card */}
                  <div
                    onClick={() => setSelectedProductId(product.id)}
                    style={{
                      flex: 1,
                      background: 'var(--surface)', borderRadius: 16,
                      border: '1px solid var(--line)', padding: '14px 16px',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div className="serif" style={{
                        fontSize: 17, lineHeight: 1.2,
                        textDecoration: done ? 'line-through' : 'none',
                      }}>
                        {stepName}
                      </div>
                      <span style={{ fontSize: 11, color: 'var(--ink-3)', marginLeft: 8, flexShrink: 0 }}>
                        {done ? 'Done' : `Step ${i + 1}`}
                      </span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 4 }}>{product.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{product.brand}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* AI Coach card */}
      <div style={{ margin: '16px 22px 0' }}>
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
