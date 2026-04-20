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
  const [routineCheckins, setRoutineCheckins] = useState<Record<string, boolean>>({});

  // Auth listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user.id);
    }) as { data: { subscription: { unsubscribe: () => void } } };
    return () => subscription.unsubscribe();
  }, []);

  // Load profile from Supabase when user logs in
  async function loadProfile(userId: string) {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (data) {
      setPersonaState((data.persona as Persona) ?? 'combination');
      setThemeState((data.theme as Theme) ?? 'light');
      const hasOnboarded = !!data.persona;
      setShowOnboarding(!hasOnboarded);
    } else {
      setShowOnboarding(true);
    }
    // Load today's checkins
    const today = new Date().toISOString().slice(0, 10);
    const { data: checkins } = await supabase
      .from('routine_checkins')
      .select('period, step_index')
      .eq('user_id', userId)
      .eq('date', today);
    if (checkins) {
      const map: Record<string, boolean> = {};
      checkins.forEach(c => { map[`${c.period}-${c.step_index}`] = true; });
      setRoutineCheckins(map);
    }
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  async function setPersona(p: Persona) {
    setPersonaState(p);
    if (user) {
      await supabase.from('profiles').upsert({ id: user.id, persona: p });
    }
  }

  async function setTheme(t: Theme) {
    setThemeState(t);
    if (user) {
      await supabase.from('profiles').upsert({ id: user.id, theme: t });
    }
  }

  async function toggleRoutineStep(key: string) {
    const [period, indexStr] = key.split('-');
    const step_index = parseInt(indexStr);
    const isDone = routineCheckins[key];
    const today = new Date().toISOString().slice(0, 10);

    // Optimistic update
    setRoutineCheckins(prev => ({ ...prev, [key]: !isDone }));

    if (user) {
      if (!isDone) {
        await supabase.from('routine_checkins').upsert({
          user_id: user.id, date: today, period, step_index,
        }, { onConflict: 'user_id,date,period,step_index' });
      } else {
        await supabase.from('routine_checkins')
          .delete()
          .eq('user_id', user.id)
          .eq('date', today)
          .eq('period', period)
          .eq('step_index', step_index);
      }
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setRoutineCheckins({});
    setActiveTab('home');
  }

  if (authLoading) {
    return (
      <div style={{
        position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg)',
      }}>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, color: 'var(--ink-3)' }}>
          Ai Glow
        </div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{
      user,
      persona, theme, activeTab, selectedProductId,
      showOnboarding, showScan, routineCheckins,
      setPersona, setTheme, setActiveTab, setSelectedProductId,
      setShowOnboarding, setShowScan, toggleRoutineStep, signOut,
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
