'use client';

import { useApp } from '@/lib/AppContext';
import { PRODUCTS, PERSONAS } from '@/lib/data';
import { Sparkles, X } from 'lucide-react';
import { Pill } from '@/components/ui/Pill';

export function ProductDetail() {
  const { selectedProductId, setSelectedProductId, persona, userProducts } = useApp();

  // Look up in user's scanned products first, then fall back to mock catalog
  const userProduct = userProducts.find(p => p.id === selectedProductId);
  const mockProduct = PRODUCTS.find(p => p.id === selectedProductId);

  const product = userProduct
    ? {
        id: userProduct.id,
        brand: userProduct.brand,
        name: userProduct.name,
        type: userProduct.type,
        size: userProduct.size || '',
        img: userProduct.img || '',
        steps: userProduct.steps,
        tag: userProduct.tag || userProduct.type,
        opened: new Date((userProduct as any).created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        match: userProduct.match,
        verdict: userProduct.verdict,
        ingredients: userProduct.ingredients,
      }
    : mockProduct;

  if (!product) return null;

  const p = PERSONAS[persona];

  return (
    <div className="noscroll" style={{
      position: 'absolute', inset: 0, zIndex: 20,
      background: 'var(--bg)', overflowY: 'auto',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Hero image */}
      <div style={{ position: 'relative', height: 360, flexShrink: 0 }}>
        <img
          src={product.img}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {/* Close */}
        <button
          onClick={() => setSelectedProductId(null)}
          aria-label="Close"
          style={{
            position: 'absolute', top: 16, left: 16,
            width: 38, height: 38, borderRadius: 19,
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(10px)',
            border: 'none', display: 'grid', placeItems: 'center',
          }}
        >
          <X size={18} color="#1a1a17" strokeWidth={1.8} />
        </button>
        {/* Match pill */}
        <div style={{
          position: 'absolute', top: 16, right: 16,
          background: 'rgba(26,26,23,0.85)',
          backdropFilter: 'blur(10px)',
          padding: '6px 12px', borderRadius: 999,
          fontSize: 12, fontWeight: 600, color: '#ffffff',
        }}>
          {product.match}% fit for you
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '20px 22px 140px' }}>
        {/* Title */}
        <div className="eyebrow">{product.brand} · {product.type}</div>
        <div className="serif" style={{ fontSize: 28, marginTop: 6, lineHeight: 1.15 }}>{product.name}</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
          <Pill tone="accent">{product.tag}</Pill>
          {product.steps.map(s => <Pill key={s}>{s}</Pill>)}
          <Pill>{product.size}</Pill>
        </div>

        {/* AI verdict */}
        <div style={{
          marginTop: 24,
          padding: '18px 18px',
          background: 'var(--accent-soft)',
          borderRadius: 'var(--r-lg)',
          border: '1px solid rgba(74,107,74,0.18)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <Sparkles size={14} color="var(--accent-2)" strokeWidth={1.6} />
            <span className="eyebrow" style={{ color: 'var(--accent-2)' }}>AI Verdict</span>
          </div>
          <div className="serif" style={{ fontSize: 19, lineHeight: 1.4, color: 'var(--ink)' }}>
            {product.verdict ?? `A solid choice for ${p.label.split(' ·')[0].toLowerCase()} skin. Monitor how your barrier responds over the first two weeks.`}
          </div>
          {/* Stat row */}
          <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
            {[
              { label: 'Opened', val: product.opened },
              { label: 'Shelf life', val: '6 mo' },
              { label: 'Used', val: '2×/day' },
            ].map(stat => (
              <div key={stat.label}>
                <div className="eyebrow" style={{ fontSize: 10 }}>{stat.label}</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)', marginTop: 3 }}>{stat.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Key ingredients */}
        {product.ingredients && product.ingredients.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <div className="serif" style={{ fontSize: 20, marginBottom: 12 }}>Key ingredients</div>
            <div style={{
              background: 'var(--surface)', borderRadius: 'var(--r-lg)',
              border: '1px solid var(--line)', overflow: 'hidden',
            }}>
              {product.ingredients.map((ing, i) => (
                <div key={ing.name} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '14px 16px',
                  borderTop: i > 0 ? '1px solid var(--line)' : 'none',
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
      </div>
    </div>
  );
}
