'use client';

import { useState } from 'react';
import { useApp } from '@/lib/AppContext';
import { Persona } from '@/lib/types';
import { ChevronRight, Camera } from 'lucide-react';

const STEPS = [
  {
    question: 'How does your skin usually feel by midday?',
    options: [
      { label: 'Tight and a bit dry', persona: 'dry' as Persona },
      { label: 'Balanced, comfortable', persona: 'mature' as Persona },
      { label: 'Shiny in the T-zone', persona: 'combination' as Persona },
      { label: 'Very oily all over', persona: 'oily' as Persona },
    ],
  },
  {
    question: "What are you most hoping to improve?",
    options: [
      { label: 'Hydration', persona: 'dry' as Persona },
      { label: 'Breakouts', persona: 'oily' as Persona },
      { label: 'Fine lines', persona: 'mature' as Persona },
      { label: 'Even tone', persona: 'combination' as Persona },
      { label: 'Redness', persona: 'dry' as Persona },
    ],
  },
  {
    question: 'How many products are in your current routine?',
    options: [
      { label: '1–2  ·  I keep it simple', persona: 'dry' as Persona },
      { label: '3–5  ·  a solid routine', persona: 'combination' as Persona },
      { label: '6+  ·  I love a ritual', persona: 'mature' as Persona },
    ],
  },
];

export function Onboarding() {
  const { setPersona, setShowOnboarding } = useApp();
  const [step, setStep] = useState(0);
  const [selectedPersona, setSelectedPersona] = useState<Persona>('combination');

  function handleOption(persona: Persona) {
    setSelectedPersona(persona);
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      // Step 4: selfie screen
      setStep(3);
    }
  }

  function finish() {
    setPersona(selectedPersona); // also saves to Supabase via AppContext
    setShowOnboarding(false);
  }

  const isSelfiStep = step === 3;
  const currentStep = isSelfiStep ? null : STEPS[step];

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 40,
      background: 'var(--bg)', display: 'flex', flexDirection: 'column',
      padding: '40px 28px 32px',
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 14, background: 'var(--accent)',
          display: 'grid', placeItems: 'center',
          fontFamily: 'var(--font-serif)', fontSize: 18, color: '#fff', lineHeight: 1,
        }}>G</div>
        <span style={{ fontFamily: 'var(--font-serif)', fontSize: 22, letterSpacing: -0.01 }}>Ai Glow</span>
      </div>

      {isSelfiStep ? (
        /* Selfie step */
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div className="eyebrow">Step 4/4</div>
          <div className="serif" style={{ fontSize: 30, marginTop: 12, lineHeight: 1.05, marginBottom: 24 }}>
            Let's see your skin.
          </div>

          {/* Camera frame */}
          <div style={{
            flex: 1, maxHeight: 320, borderRadius: 32, overflow: 'hidden',
            background: 'var(--bg-sunken)',
            border: '2px dashed var(--line-strong)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', marginBottom: 24,
          }}>
            {/* Oval guide */}
            <div style={{
              width: 160, height: 200, borderRadius: '50%',
              border: '2px dashed rgba(74,107,74,0.4)',
            }}/>
            <Camera size={28} color="var(--ink-4)" style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)' }} strokeWidth={1.4} />
          </div>

          <button
            onClick={finish}
            style={{
              width: '100%', padding: '16px 0', borderRadius: 14, border: 'none',
              background: 'var(--accent)', color: 'var(--accent-ink)',
              fontFamily: 'var(--font-sans)', fontSize: 16, fontWeight: 500,
              marginBottom: 12,
            }}
          >Take the photo</button>
          <button
            onClick={finish}
            style={{
              width: '100%', padding: '14px 0', borderRadius: 14, border: 'none',
              background: 'transparent', color: 'var(--ink-3)',
              fontFamily: 'var(--font-sans)', fontSize: 14,
            }}
          >Skip for now</button>
        </div>
      ) : (
        /* Quiz steps */
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div className="eyebrow">Step {step + 1}/4</div>
          <div className="serif" style={{ fontSize: 30, marginTop: 12, lineHeight: 1.05, marginBottom: 24 }}>
            {currentStep!.question}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
            {currentStep!.options.map(opt => (
              <button
                key={opt.label}
                onClick={() => handleOption(opt.persona)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '16px 16px', borderRadius: 16,
                  background: 'var(--surface)', border: '1px solid var(--line)',
                  textAlign: 'left', color: 'var(--ink)',
                  fontFamily: 'var(--font-sans)', fontSize: 14,
                }}
              >
                {opt.label}
                <ChevronRight size={14} color="var(--ink-4)" strokeWidth={2} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div style={{ display: 'flex', gap: 4, marginTop: 24 }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 2,
            background: i <= step ? 'var(--accent)' : 'var(--line-strong)',
          }}/>
        ))}
      </div>
    </div>
  );
}
