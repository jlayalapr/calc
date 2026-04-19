'use client';

import { useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { PRODUCTS } from '@/lib/data';

const FILTERS = ['All', 'AM', 'PM', 'Serum', 'SPF'];

export function Shelf() {
  const { setSelectedProductId, setActiveTab } = useApp();
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = PRODUCTS.filter(p => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'AM') return p.steps.includes('AM');
    if (activeFilter === 'PM') return p.steps.includes('PM');
    if (activeFilter === 'Serum') return p.type === 'Serum';
    if (activeFilter === 'SPF') return p.type === 'Sunscreen';
    return true;
  });

  function openProduct(id: string) {
    setSelectedProductId(id);
    setActiveTab('shelf'); // stays on shelf, product detail overlays
  }

  return (
    <div className="noscroll" style={{ flex: 1, overflowY: 'auto', background: 'var(--bg)', paddingBottom: 140 }}>
      {/* Header */}
      <div style={{ padding: '16px 22px 0' }}>
        <div className="eyebrow">{PRODUCTS.length} items · 2 nearly empty</div>
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
            style={{ textAlign: 'left', background: 'transparent', border: 'none', padding: 0 }}
          >
            {/* Photo */}
            <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', aspectRatio: '1 / 1' }}>
              <img
                src={product.img}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
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
                <div style={{ display: 'flex', gap: 4 }}>
                  {product.steps.map(s => (
                    <span key={s} style={{
                      padding: '2px 6px', borderRadius: 4,
                      fontSize: 10, fontWeight: 600,
                      background: 'var(--bg-sunken)', color: 'var(--ink-2)',
                    }}>{s}</span>
                  ))}
                </div>
                <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>{product.size}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
