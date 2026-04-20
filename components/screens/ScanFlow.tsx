'use client';

import { useEffect, useState, useRef } from 'react';
import { useApp } from '@/lib/AppContext';
import { X, Sparkles, Camera } from 'lucide-react';
import { PERSONAS } from '@/lib/data';

type Stage = 'scan' | 'analyzing' | 'result' | 'error';

interface ScanResult {
  product_name: string;
  brand: string;
  type: string;
  size?: string;
  tag?: string;
  steps: string[];
  match_score: number;
  verdict: string;
  meta: { ph?: string; fragrance?: string; alcohol?: string; actives?: string };
  ingredients: { name: string; reason: string; tone: 'good' | 'neutral' | 'warn' }[];
}

export function ScanFlow() {
  const { setShowScan, setActiveTab, persona, addProduct } = useApp();
  const p = PERSONAS[persona];
  const [stage, setStage] = useState<Stage>('scan');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [adding, setAdding] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Camera access
  useEffect(() => {
    if (stage !== 'scan') return;
    navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'environment' } })
      .then(s => {
        streamRef.current = s;
        if (videoRef.current) videoRef.current.srcObject = s;
      })
      .catch(() => { /* no camera */ });
    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    };
  }, [stage]);

  // Animate progress bar during analyzing
  useEffect(() => {
    if (stage !== 'analyzing') return;
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => Math.min(p + 1.2, 92));
    }, 80);
    return () => clearInterval(interval);
  }, [stage]);

  async function capture() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageBase64 = canvas.toDataURL('image/jpeg', 0.85);

    streamRef.current?.getTracks().forEach(t => t.stop());
    setStage('analyzing');

    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          persona,
          metrics: { hydration: p.hydration, barrier: p.barrier, tone: p.tone },
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Scan failed');
      setProgress(100);
      setTimeout(() => { setResult(data); setStage('result'); }, 400);
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : 'Something went wrong');
      setStage('error');
    }
  }

  async function addToShelf() {
    if (!result) return;
    setAdding(true);
    await addProduct({
      brand: result.brand,
      name: result.product_name,
      type: result.type,
      size: result.size || '',
      tag: result.tag || result.type,
      steps: result.steps?.length ? result.steps : ['AM', 'PM'],
      match: result.match_score,
      verdict: result.verdict,
      meta: result.meta,
      ingredients: result.ingredients,
    });
    setAdding(false);
    setShowScan(false);
    setActiveTab('shelf');
  }

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 35,
      background: '#000', display: 'flex', flexDirection: 'column',
    }}>
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Close button */}
      <button
        onClick={() => setShowScan(false)}
        aria-label="Close scan"
        style={{
          position: 'absolute', top: 16, left: 16, zIndex: 10,
          width: 38, height: 38, borderRadius: 19,
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(10px)', border: 'none',
          display: 'grid', placeItems: 'center', cursor: 'pointer',
        }}
      >
        <X size={18} color="#fff" strokeWidth={1.8} />
      </button>

      {stage === 'error' && (
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: 'var(--bg)', padding: '32px 24px', gap: 16,
        }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, color: 'var(--ink)', textAlign: 'center' }}>
            Scan didn't work
          </div>
          <div style={{ fontSize: 14, color: 'var(--ink-3)', textAlign: 'center', lineHeight: 1.5 }}>
            {errorMsg}
          </div>
          <button
            onClick={() => { setStage('scan'); setErrorMsg(''); }}
            style={{
              padding: '14px 28px', borderRadius: 14, border: 'none',
              background: 'var(--accent)', color: 'var(--accent-ink)',
              fontFamily: 'var(--font-sans)', fontSize: 15, cursor: 'pointer',
            }}
          >Try again</button>
        </div>
      )}

      {(stage === 'scan' || stage === 'analyzing') && (
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
            <div style={{ width: 240, height: 140, position: 'relative' }}>
              {[
                { top: 0, left: 0, borderTop: '2px solid var(--accent)', borderLeft: '2px solid var(--accent)' },
                { top: 0, right: 0, borderTop: '2px solid var(--accent)', borderRight: '2px solid var(--accent)' },
                { bottom: 0, left: 0, borderBottom: '2px solid var(--accent)', borderLeft: '2px solid var(--accent)' },
                { bottom: 0, right: 0, borderBottom: '2px solid var(--accent)', borderRight: '2px solid var(--accent)' },
              ].map((style, i) => (
                <div key={i} style={{ position: 'absolute', width: 20, height: 20, ...style }}/>
              ))}
              {stage === 'scan' && (
                <div style={{
                  position: 'absolute', left: 0, right: 0, height: 2,
                  background: 'var(--accent)',
                  animation: 'scanLine 1.6s linear infinite',
                }}/>
              )}
            </div>
          </div>

          {/* Bottom area */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
            padding: '40px 24px 36px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, letterSpacing: 0.14, textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: 6 }}>
                {stage === 'scan' ? 'Align the label inside the frame' : 'Matching to your skin profile…'}
              </div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, color: '#fff', lineHeight: 1.25 }}>
                {stage === 'scan' ? 'Point at the product label' : 'Cross-referencing ingredients…'}
              </div>
            </div>

            {stage === 'analyzing' && (
              <div style={{ width: '100%', background: 'rgba(255,255,255,0.2)', borderRadius: 4, height: 4 }}>
                <div style={{
                  height: '100%', borderRadius: 4,
                  background: 'var(--accent)',
                  width: `${progress}%`,
                  transition: 'width 80ms linear',
                }}/>
              </div>
            )}

            {stage === 'scan' && (
              <button
                onClick={capture}
                aria-label="Capture photo"
                style={{
                  width: 68, height: 68, borderRadius: 34,
                  border: '3px solid #fff',
                  background: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(8px)',
                  display: 'grid', placeItems: 'center', cursor: 'pointer',
                }}
              >
                <Camera size={26} color="#fff" strokeWidth={1.6} />
              </button>
            )}
          </div>
        </div>
      )}

      {stage === 'result' && result && (
        <div className="noscroll" style={{ flex: 1, overflowY: 'auto', background: 'var(--bg)' }}>
          {/* Hero placeholder */}
          <div style={{
            height: 200, background: 'var(--bg-sunken)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: 90, height: 90, borderRadius: 18,
              background: 'var(--surface)', border: '1px solid var(--line)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: 36, color: 'var(--ink-3)' }}>
                {result.brand?.[0] ?? '?'}
              </span>
            </div>
          </div>

          <div style={{ padding: '0 22px 140px' }}>
            <div className="eyebrow" style={{ color: 'var(--accent)', marginTop: 20 }}>Match found</div>
            <div className="serif" style={{ fontSize: 28, marginTop: 4, lineHeight: 1.1 }}>{result.product_name}</div>
            <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>{result.brand} · {result.type}</div>

            {/* Verdict */}
            <div style={{
              marginTop: 20, padding: '16px 18px',
              background: 'var(--accent-soft)', borderRadius: 'var(--r-lg)',
              border: '1px solid rgba(74,107,74,0.18)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <Sparkles size={14} color="var(--accent-2)" strokeWidth={1.6} />
                <span style={{ fontSize: 11, letterSpacing: 0.14, textTransform: 'uppercase', fontWeight: 500, color: 'var(--accent-2)' }}>
                  {result.match_score}% fit for you
                </span>
              </div>
              <div className="serif" style={{ fontSize: 19, lineHeight: 1.4 }}>
                {result.verdict}
              </div>
            </div>

            {/* Meta grid */}
            {result.meta && (
              <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { label: 'pH', value: result.meta.ph || '—' },
                  { label: 'Fragrance', value: result.meta.fragrance || '—' },
                  { label: 'Alcohol', value: result.meta.alcohol || '—' },
                  { label: 'Actives', value: result.meta.actives || '—' },
                ].map(item => (
                  <div key={item.label} style={{
                    background: 'var(--surface)', borderRadius: 'var(--r-md)',
                    border: '1px solid var(--line)', padding: '12px 14px',
                  }}>
                    <div className="eyebrow" style={{ fontSize: 10 }}>{item.label}</div>
                    <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--ink)', marginTop: 4 }}>{item.value}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Ingredients */}
            {result.ingredients?.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <div className="serif" style={{ fontSize: 20, marginBottom: 12 }}>Key ingredients</div>
                <div style={{
                  background: 'var(--surface)', borderRadius: 'var(--r-lg)',
                  border: '1px solid var(--line)', overflow: 'hidden',
                }}>
                  {result.ingredients.map((ing, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '14px 16px', borderTop: i > 0 ? '1px solid var(--line)' : 'none',
                    }}>
                      <div style={{
                        width: 8, height: 8, borderRadius: 4, flexShrink: 0,
                        background: ing.tone === 'good' ? 'var(--accent)' : ing.tone === 'warn' ? 'var(--warn)' : 'var(--ink-4)',
                      }}/>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>{ing.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 1 }}>{ing.reason}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                onClick={addToShelf}
                disabled={adding}
                style={{
                  width: '100%', padding: '16px 0', borderRadius: 14, border: 'none',
                  background: 'var(--accent)', color: 'var(--accent-ink)',
                  fontFamily: 'var(--font-sans)', fontSize: 16, fontWeight: 500, cursor: 'pointer',
                  opacity: adding ? 0.7 : 1,
                }}
              >{adding ? 'Adding…' : 'Add to my shelf'}</button>
              <button
                onClick={() => setShowScan(false)}
                style={{
                  width: '100%', padding: '14px 0', borderRadius: 14,
                  border: '1px solid var(--line)', background: 'transparent',
                  color: 'var(--ink-2)', fontFamily: 'var(--font-sans)', fontSize: 14, cursor: 'pointer',
                }}
              >Not interested</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
