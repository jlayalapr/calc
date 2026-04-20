'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { AppState, NavTab, Persona, Theme } from './types';

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [persona, setPersonaState] = useState<Persona>('combination');
  const [theme, setThemeState] = useState<Theme>('light');
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showScan, setShowScan] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [routineCheckins, setRoutineCheckins] = useState<Record<string, boolean>>({});

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) loadProfile(u);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) loadProfile(u);
    }) as { data: { subscription: { unsubscribe: () => void } } };

    return () => subscription.unsubscribe();
  }, []);

  async function loadProfile(u: User) {
    const name = u.user_metadata?.name || u.email?.split('@')[0] || 'Friend';
    const { data: existing } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', u.id)
      .single();

    if (!existing) {
      await supabase.from('profiles').upsert({
        id: u.id,
        name,
        persona: 'combination',
        theme: 'light',
      });
      setShowOnboarding(true);
    } else {
      setPersonaState((existing.persona as Persona) ?? 'combination');
      setThemeState((existing.theme as Theme) ?? 'light');
    }

    const today = new Date().toISOString().slice(0, 10);
    const { data: checkins } = await supabase
      .from('routine_checkins')
      .select('period, step_index')
      .eq('user_id', u.id)
      .eq('date', today);
    if (checkins) {
      const map: Record<string, boolean> = {};
      checkins.forEach((c: { period: string; step_index: number }) => {
        map[`${c.period}-${c.step_index}`] = true;
      });
      setRoutineCheckins(map);
    }
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  async function setPersona(p: Persona) {
    setPersonaState(p);
    if (user) await supabase.from('profiles').upsert({ id: user.id, persona: p });
  }

  async function setTheme(t: Theme) {
    setThemeState(t);
    if (user) await supabase.from('profiles').upsert({ id: user.id, theme: t });
  }

  async function toggleRoutineStep(key: string) {
    const [period, indexStr] = key.split('-');
    const step_index = parseInt(indexStr);
    const isDone = routineCheckins[key];
    const today = new Date().toISOString().slice(0, 10);
    setRoutineCheckins(prev => ({ ...prev, [key]: !isDone }));
    if (user) {
      if (!isDone) {
        await supabase.from('routine_checkins').upsert({
          user_id: user.id, date: today, period, step_index,
        }, { onConflict: 'user_id,date,period,step_index' });
      } else {
        await supabase.from('routine_checkins')
          .delete()
          .eq('user_id', user.id).eq('date', today).eq('period', period).eq('step_index', step_index);
      }
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setRoutineCheckins({});
    setActiveTab('home');
    setShowAdmin(false);
  }

  if (authLoading) {
    return (
      <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, color: 'var(--ink-3)' }}>Ai Glow</div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{
      user, persona, theme, activeTab, selectedProductId,
      showOnboarding, showScan, showAdmin, routineCheckins,
      setPersona, setTheme, setActiveTab, setSelectedProductId,
      setShowOnboarding, setShowScan, setShowAdmin, toggleRoutineStep, signOut,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
