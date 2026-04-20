'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

type Mode = 'signin' | 'signup';

export function AuthScreen() {
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (mode === 'signup') {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (signUpError) { setError(signUpError.message); setLoading(false); return; }
      // Create profile row
      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          name: name || email.split('@')[0],
          persona: 'combination',
          theme: 'light',
        });
      }
      setSent(true);
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) setError(signInError.message);
    }
    setLoading(false);
  }

  if (sent) {
    return (
      <div style={outerStyle}>
        <div style={cardStyle}>
          <Logo />
          <div className="serif" style={{ fontSize: 26, marginTop: 24, lineHeight: 1.2 }}>
            Check your email
          </div>
          <div style={{ fontSize: 14, color: 'var(--ink-3)', marginTop: 10, lineHeight: 1.6 }}>
            We sent a confirmation link to <strong style={{ color: 'var(--ink-2)' }}>{email}</strong>. Open it to activate your account.
          </div>
          <button onClick={() => setSent(false)} style={linkBtnStyle}>
            Back to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={outerStyle}>
      <div style={cardStyle}>
        <Logo />

        <div className="serif" style={{ fontSize: 26, marginTop: 24, lineHeight: 1.2 }}>
          {mode === 'signin' ? 'Welcome back.' : 'Create your account.'}
        </div>
        <div style={{ fontSize: 14, color: 'var(--ink-3)', marginTop: 6, lineHeight: 1.5 }}>
          {mode === 'signin'
            ? 'Your skin routine is waiting.'
            : 'Start your personalized skincare journey.'}
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {mode === 'signup' && (
            <div>
              <label style={labelStyle}>Your name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Sofía"
                style={inputStyle}
              />
            </div>
          )}
          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              style={inputStyle}
            />
          </div>

          {error && (
            <div style={{ fontSize: 13, color: 'var(--warn)', padding: '10px 14px', background: 'var(--warn-soft)', borderRadius: 10 }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={primaryBtnStyle}>
            {loading ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <div style={{ marginTop: 20, textAlign: 'center', fontSize: 14, color: 'var(--ink-3)' }}>
          {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); }}
            style={linkBtnStyle}
          >
            {mode === 'signin' ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: 32, height: 32, borderRadius: 16, background: 'var(--accent)',
        display: 'grid', placeItems: 'center',
        fontFamily: 'var(--font-serif)', fontSize: 20, color: '#fff',
      }}>G</div>
      <span style={{ fontFamily: 'var(--font-serif)', fontSize: 24, letterSpacing: -0.01 }}>Ai Glow</span>
    </div>
  );
}

const outerStyle: React.CSSProperties = {
  position: 'fixed', inset: 0, zIndex: 100,
  background: 'var(--bg)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  padding: '24px 22px',
};

const cardStyle: React.CSSProperties = {
  width: '100%', maxWidth: 400,
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 11, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase',
  color: 'var(--ink-3)', marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px',
  borderRadius: 'var(--r-md)', border: '1px solid var(--line-strong)',
  background: 'var(--surface)', color: 'var(--ink)',
  fontSize: 15, fontFamily: 'var(--font-sans)',
  outline: 'none',
};

const primaryBtnStyle: React.CSSProperties = {
  width: '100%', padding: '15px 0', marginTop: 4,
  borderRadius: 'var(--r-md)', border: 'none',
  background: 'var(--accent)', color: 'var(--accent-ink)',
  fontSize: 16, fontWeight: 500, fontFamily: 'var(--font-sans)',
};

const linkBtnStyle: React.CSSProperties = {
  background: 'transparent', border: 'none', padding: 0,
  color: 'var(--accent-2)', fontWeight: 500, fontSize: 14,
  fontFamily: 'var(--font-sans)', cursor: 'pointer',
};
