'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { AppState, NavTab, Persona, Theme } from './types';

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [persona, setPersonaState] = useState<Persona>('combination');
  const [theme, setThemeState] = useState<Theme>('light');
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showScan, setShowScan] = useState(false);
  const [routineCheckins, setRoutineCheckins] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = localStorage.getItem('ai-glow-theme') as Theme | null;
    if (saved) setThemeState(saved);
    const savedPersona = localStorage.getItem('ai-glow-persona') as Persona | null;
    if (savedPersona) setPersonaState(savedPersona);
    const savedOnboarding = localStorage.getItem('ai-glow-onboarded');
    if (!savedOnboarding) setShowOnboarding(true);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ai-glow-theme', theme);
  }, [theme]);

  function setPersona(p: Persona) {
    setPersonaState(p);
    localStorage.setItem('ai-glow-persona', p);
  }

  function setTheme(t: Theme) {
    setThemeState(t);
  }

  function toggleRoutineStep(key: string) {
    setRoutineCheckins(prev => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <AppContext.Provider value={{
      persona, theme, activeTab, selectedProductId,
      showOnboarding, showScan, routineCheckins,
      setPersona, setTheme, setActiveTab, setSelectedProductId,
      setShowOnboarding, setShowScan, toggleRoutineStep,
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
