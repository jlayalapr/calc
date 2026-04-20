'use client';

import { useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { ScanLine } from 'lucide-react';

const FILTERS = ['All', 'AM', 'PM', 'Serum', 'SPF'];

export function Shelf() {
  const { setSelectedProductId, setActiveTab, setShowScan, userProducts } = useApp();
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = userProducts.filter(p => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'AM') return p.steps.includes('AM');
    if (activeFilter === 'PM') return p.steps.includes('PM');
    if (activeFilter === 'Serum') return p.type === 'Serum';
    if (activeFilter === 'SPF') return p.type === 'Sunscreen';
    return true;
  });

  function openProduct(id: string) {
    setSelectedProductId(id);
    setActiveTab('shelf');
  }

  if (userProducts.length === 0) {
    return (
      <div className="noscroll" style={{ flex: 1, overflowY: 'auto', background: 'var(--bg)', paddingBottom: 140 }}>
        <div style={{ padding: '16px 22px 0' }}>
          <div className="eyebrow">0 items</div>
          <div className="serif" style={{ fontSize: 30, marginTop: 4 }}>My Shelf</div>
        </div>
        <div style={{
          margin: '60px 22px 0', display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 16, textAlign: 'center',
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: 36,
            background: 'var(--bg-sunken)', border: '1px solid var(--line)',
            display: 'grid', placeItems: 'center',
          }}>
            <ScanLine size={28} color="var(--ink-3)" strokeWidth={1.4} />
          </div>
          <div>
            <div className="serif" style={{ fontSize: 22, color: 'var(--ink)', marginBottom: 6 }}>
              Your shelf is empty
            </div>
            <div style={{ fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.5 }}>
              Scan a product label to get an AI ingredient analysis and add it here.
            </div>
          </div>
          <button
            onClick={() => setShowScan(true)}
            style={{
              padding: '14px 28px', borderRadius: 14, border: 'none',
              background: 'var(--accent)', color: 'var(--accent-ink)',
              fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 500, cursor: 'pointer',
            }}
          >Scan your first product</button>
        </div>
      </div>
    );
  }

  return (
    <div className="noscroll" style={{ flex: 1, overflowY: 'auto', background: 'var(--bg)', paddingBottom: 140 }}>
      {/* Header */}
      <div style={{ padding: '16px 22px 0' }}>
        <div className="eyebrow">{userProducts.length} item{userProducts.length !== 1 ? 's' : ''}</div>
        <div className="serif" style={{ fontSize: 30, marginTop: 4 }}>My Shelf</div>
      </div>

      {/* Filter pills */}
      <div className="noscroll" style={{ overflowX: 'auto', padding: '16px 22px 4px', display: 'flex', gap: 8 }}>
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            style={{
              flexShrink: 0,
              padding: '7px 14px', borderRadius: 999, border: 'none',
              fontSize: 13, fontWeight: 500,
              background: f === activeFilter ? 'var(--ink)' : 'transparent',
              color: f === activeFilter ? 'var(--bg)' : 'var(--ink-2)',
              outline: f === activeFilter ? 'none' : '1px solid var(--line-strong)',
              cursor: 'pointer',
            }}
          >{f}</button>
        ))}
      </div>

      {/* Product grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 14, padding: '14px 22px',
      }}>
        {filtered.map(product => (
          <button
            key={product.id}
            onClick={() => openProduct(product.id)}
            style={{ textAlign: 'left', background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
          >
            {/* Photo or placeholder */}
            <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', aspectRatio: '1 / 1', background: 'var(--bg-sunken)' }}>
              {product.img ? (
                <img src={product.img} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: 40, color: 'var(--ink-3)' }}>
                    {product.brand?.[0] ?? product.name?.[0] ?? '?'}
                  </span>
                </div>
              )}
              <div style={{
                position: 'absolute', top: 8, left: 8,
                background: 'rgba(255,255,255,0.9)',
                padding: '3px 8px', borderRadius: 999,
                fontSize: 10, fontWeight: 600, color: 'var(--accent-2)',
              }}>
                {product.match}% FIT
              </div>
            </div>
            {/* Info */}
            <div style={{ padding: '10px 2px 4px' }}>
              <div className="eyebrow" style={{ fontSize: 10 }}>{product.brand}</div>
              <div className="serif" style={{ fontSize: 16, marginTop: 3, lineHeight: 1.2 }}>{product.name}</div>
              <div style={{ display: 'flex', gap: 4, marginTop: 6, alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {product.steps.map(s => (
                    <span key={s} style={{
                      padding: '2px 6px', borderRadius: 4,
                      fontSize: 10, fontWeight: 600,
                      background: 'var(--bg-sunken)', color: 'var(--ink-2)',
                    }}>{s}</span>
                  ))}
                </div>
                {product.size && <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>{product.size}</span>}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Add more CTA */}
      <div style={{ margin: '8px 22px 0' }}>
        <button
          onClick={() => setShowScan(true)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 14,
            padding: '16px 18px', borderRadius: 'var(--r-lg)',
            border: '1px dashed var(--line-strong)', background: 'transparent',
            textAlign: 'left', cursor: 'pointer',
          }}
        >
          <ScanLine size={22} color="var(--ink-3)" strokeWidth={1.6} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink-2)' }}>Scan another product</div>
            <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>Ingredients + fit for your skin</div>
          </div>
        </button>
      </div>
    </div>
  );
}
