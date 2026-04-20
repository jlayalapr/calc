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
  const [info, setInfo] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setInfo('');

    if (mode === 'signup') {
      const { data, error: signUpError } = await supabase.auth.signUp({ email, password, options: { data: { name } } });
      if (signUpError) { setError(signUpError.message); setLoading(false); return; }
      if (data.session) {
        // Email confirmation disabled — user is logged in immediately
        return;
      }
      // Email confirmation enabled — show message
      setInfo(`Confirmation email sent to ${email}. Click the link in the email, then come back and sign in.`);
      setMode('signin');
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        if (signInError.message.toLowerCase().includes('not confirmed')) {
          setError('');
          setInfo('Your email is not confirmed yet. Check your inbox and click the link, then try again.');
          // Offer resend
        } else if (signInError.message.toLowerCase().includes('invalid')) {
          setError('Email or password is incorrect.');
        } else {
          setError(signInError.message);
        }
      }
    }
    setLoading(false);
  }

  async function resendConfirmation() {
    if (!email) { setError('Enter your email first.'); return; }
    await supabase.auth.resend({ type: 'signup', email });
    setInfo(`Confirmation email resent to ${email}.`);
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
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="Sofía" style={inputStyle} />
            </div>
          )}
          <div>
            <label style={labelStyle}>Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Password</label>
            <input type="password" required minLength={6} value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="At least 6 characters" style={inputStyle} />
          </div>

          {error && (
            <div style={{ fontSize: 13, color: 'var(--warn)', padding: '10px 14px', background: 'var(--warn-soft)', borderRadius: 10 }}>
              {error}
            </div>
          )}

          {info && (
            <div style={{ fontSize: 13, color: 'var(--accent-2)', padding: '10px 14px', background: 'var(--accent-soft)', borderRadius: 10, lineHeight: 1.5 }}>
              {info}
              {info.includes('not confirmed') && (
                <button type="button" onClick={resendConfirmation}
                  style={{ display: 'block', marginTop: 8, color: 'var(--accent)', fontWeight: 600, background: 'none', border: 'none', padding: 0, fontSize: 13, cursor: 'pointer' }}>
                  Resend confirmation email →
                </button>
              )}
            </div>
          )}

          <button type="submit" disabled={loading} style={primaryBtnStyle}>
            {loading ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <div style={{ marginTop: 18, textAlign: 'center', fontSize: 14, color: 'var(--ink-3)' }}>
          {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); setInfo(''); }}
            style={linkBtnStyle}>
            {mode === 'signin' ? 'Sign up' : 'Sign in'}
          </button>
        </div>

        {/* Admin access */}
        <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--line)', textAlign: 'center' }}>
          <AdminLogin />
        </div>
      </div>
    </div>
  );
}

function AdminLogin() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  async function handleAdmin(e: React.FormEvent) {
    e.preventDefault();
    if (ADMIN_EMAIL && email !== ADMIN_EMAIL) {
      setError('Not authorized as admin.');
      return;
    }
    setLoading(true);
    setError('');
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError(signInError.message.toLowerCase().includes('invalid') ? 'Wrong email or password.' : signInError.message);
    }
    setLoading(false);
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        style={{ background: 'none', border: 'none', color: 'var(--ink-4)', fontSize: 12, cursor: 'pointer', letterSpacing: '0.05em' }}>
        Admin access →
      </button>
    );
  }

  return (
    <form onSubmit={handleAdmin} style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left' }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 2 }}>
        Admin login
      </div>
      <input type="email" required placeholder="Admin email" value={email}
        onChange={e => setEmail(e.target.value)} style={{ ...inputStyle, fontSize: 13, padding: '10px 12px' }} />
      <input type="password" required placeholder="Password" value={password}
        onChange={e => setPassword(e.target.value)} style={{ ...inputStyle, fontSize: 13, padding: '10px 12px' }} />
      {error && <div style={{ fontSize: 12, color: 'var(--warn)' }}>{error}</div>}
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" disabled={loading} style={{ ...primaryBtnStyle, flex: 1, padding: '11px 0', fontSize: 13 }}>
          {loading ? '…' : 'Enter admin'}
        </button>
        <button type="button" onClick={() => setOpen(false)}
          style={{ padding: '11px 14px', borderRadius: 'var(--r-md)', border: '1px solid var(--line)', background: 'transparent', color: 'var(--ink-3)', fontSize: 13, cursor: 'pointer' }}>
          Cancel
        </button>
      </div>
    </form>
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
  overflowY: 'auto',
};
const cardStyle: React.CSSProperties = { width: '100%', maxWidth: 400 };
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 11, fontWeight: 500,
  letterSpacing: '0.1em', textTransform: 'uppercase',
  color: 'var(--ink-3)', marginBottom: 6,
};
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px',
  borderRadius: 'var(--r-md)', border: '1px solid var(--line-strong)',
  background: 'var(--surface)', color: 'var(--ink)',
  fontSize: 15, fontFamily: 'var(--font-sans)', outline: 'none',
};
const primaryBtnStyle: React.CSSProperties = {
  width: '100%', padding: '15px 0', marginTop: 4,
  borderRadius: 'var(--r-md)', border: 'none',
  background: 'var(--accent)', color: 'var(--accent-ink)',
  fontSize: 16, fontWeight: 500, fontFamily: 'var(--font-sans)', cursor: 'pointer',
};
const linkBtnStyle: React.CSSProperties = {
  background: 'transparent', border: 'none', padding: 0,
  color: 'var(--accent-2)', fontWeight: 500, fontSize: 14,
  fontFamily: 'var(--font-sans)', cursor: 'pointer',
};
