'use client';

import { useEffect, useState, useRef } from 'react';
import { useApp } from '@/lib/AppContext';
import { X, Sparkles } from 'lucide-react';
import { Pill } from '@/components/ui/Pill';

type Stage = 'scan' | 'analyzing' | 'result';

const SCAN_RESULT = {
  match: 96,
  brand: 'La Roche-Posay',
  name: 'Hyalu B5 Serum',
  img: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=70',
  verdict: 'Strong fit for your profile. The multi-molecular hyaluronic acid complex addresses your hydration deficit directly.',
  meta: [
    { label: 'pH', value: '5.5' },
    { label: 'Fragrance', value: 'Free' },
    { label: 'Alcohol', value: 'None' },
    { label: 'Actives', value: '3' },
  ],
};

export function ScanFlow() {
  const { setShowScan, setActiveTab } = useApp();
  const [stage, setStage] = useState<Stage>('scan');
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Auto-advance for demo
  useEffect(() => {
    if (stage === 'scan') {
      const t = setTimeout(() => setStage('analyzing'), 1800);
      return () => clearTimeout(t);
    }
    if (stage === 'analyzing') {
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) { clearInterval(interval); return 100; }
          return p + 2;
        });
      }, 40);
      const t = setTimeout(() => { clearInterval(interval); setStage('result'); }, 2200);
      return () => { clearInterval(interval); clearTimeout(t); };
    }
  }, [stage]);

  // Camera access
  useEffect(() => {
    if (stage !== 'scan') return;
    let stream: MediaStream | null = null;
    navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'environment' } })
      .then(s => { stream = s; if (videoRef.current) videoRef.current.srcObject = s; })
      .catch(() => {/* no camera — fine in demo */});
    return () => { stream?.getTracks().forEach(t => t.stop()); };
  }, [stage]);

  function addToShelf() {
    setShowScan(false);
    setActiveTab('shelf');
  }

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 35,
      background: '#000', display: 'flex', flexDirection: 'column',
    }}>
      {/* Close button */}
      <button
        onClick={() => setShowScan(false)}
        aria-label="Close scan"
        style={{
          position: 'absolute', top: 16, left: 16, zIndex: 10,
          width: 38, height: 38, borderRadius: 19,
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(10px)', border: 'none',
          display: 'grid', placeItems: 'center',
        }}
      >
        <X size={18} color="#fff" strokeWidth={1.8} />
      </button>

      {stage !== 'result' ? (
        /* Viewfinder */
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: stage === 'analyzing' ? 0.7 : 1 }}
          />
          {/* Scan bracket */}
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: 240, height: 140, position: 'relative',
            }}>
              {/* Corners */}
              {[
                { top: 0, left: 0, borderTop: '2px solid var(--accent)', borderLeft: '2px solid var(--accent)' },
                { top: 0, right: 0, borderTop: '2px solid var(--accent)', borderRight: '2px solid var(--accent)' },
                { bottom: 0, left: 0, borderBottom: '2px solid var(--accent)', borderLeft: '2px solid var(--accent)' },
                { bottom: 0, right: 0, borderBottom: '2px solid var(--accent)', borderRight: '2px solid var(--accent)' },
              ].map((style, i) => (
                <div key={i} style={{ position: 'absolute', width: 20, height: 20, ...style }}/>
              ))}
              {/* Scan line */}
              {stage === 'scan' && (
                <div style={{
                  position: 'absolute', left: 0, right: 0, height: 2,
                  background: 'var(--accent)',
                  animation: 'scanLine 1.6s linear infinite',
                }}/>
              )}
            </div>
          </div>
          {/* Bottom copy */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
            padding: '40px 24px 32px', color: '#fff',
          }}>
            <div style={{ fontSize: 11, letterSpacing: 0.14, textTransform: 'uppercase', opacity: 0.7, marginBottom: 6 }}>
              {stage === 'scan' ? 'Align the label' : 'Matching to you'}
            </div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, lineHeight: 1.25 }}>
              {stage === 'scan' ? 'Reading the product…' : 'Cross-referencing ingredients…'}
            </div>
            {stage === 'analyzing' && (
              <div style={{ marginTop: 16, background: 'rgba(255,255,255,0.2)', borderRadius: 4, height: 4 }}>
                <div style={{
                  height: '100%', borderRadius: 4,
                  background: 'var(--accent)',
                  width: `${progress}%`,
                  transition: 'width 40ms linear',
                }}/>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Result screen */
        <div className="noscroll" style={{
          flex: 1, overflowY: 'auto',
          background: 'var(--bg)',
        }}>
          {/* Hero */}
          <div style={{ position: 'relative', height: 260 }}>
            <img src={SCAN_RESULT.img} alt={SCAN_RESULT.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(transparent 50%, var(--bg) 100%)',
            }}/>
          </div>

          <div style={{ padding: '0 22px 140px' }}>
            <div className="eyebrow" style={{ color: 'var(--accent)' }}>Match found</div>
            <div className="serif" style={{ fontSize: 30, marginTop: 4, lineHeight: 1.1 }}>{SCAN_RESULT.name}</div>
            <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>{SCAN_RESULT.brand}</div>

            {/* Verdict */}
            <div style={{
              marginTop: 20,
              padding: '16px 18px',
              background: 'var(--accent-soft)',
              borderRadius: 'var(--r-lg)',
              border: '1px solid rgba(74,107,74,0.18)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <Sparkles size={14} color="var(--accent-2)" strokeWidth={1.6} />
                <span style={{ fontSize: 11, letterSpacing: 0.14, textTransform: 'uppercase', fontWeight: 500, color: 'var(--accent-2)' }}>
                  {SCAN_RESULT.match}% fit for you
                </span>
              </div>
              <div className="serif" style={{ fontSize: 19, lineHeight: 1.4 }}>
                {SCAN_RESULT.verdict}
              </div>
            </div>

            {/* Meta grid */}
            <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {SCAN_RESULT.meta.map(item => (
                <div key={item.label} style={{
                  background: 'var(--surface)', borderRadius: 'var(--r-md)',
                  border: '1px solid var(--line)', padding: '12px 14px',
                }}>
                  <div className="eyebrow" style={{ fontSize: 10 }}>{item.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--ink)', marginTop: 4 }}>{item.value}</div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                onClick={addToShelf}
                style={{
                  width: '100%', padding: '16px 0', borderRadius: 14, border: 'none',
                  background: 'var(--accent)', color: 'var(--accent-ink)',
                  fontFamily: 'var(--font-sans)', fontSize: 16, fontWeight: 500,
                }}
              >Add to my shelf</button>
              <button
                onClick={() => setShowScan(false)}
                style={{
                  width: '100%', padding: '14px 0', borderRadius: 14,
                  border: '1px solid var(--line)', background: 'transparent',
                  color: 'var(--ink-2)', fontFamily: 'var(--font-sans)', fontSize: 14,
                }}
              >Not interested</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
