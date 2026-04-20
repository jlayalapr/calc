export type Persona = 'combination' | 'oily' | 'dry' | 'mature';
export type Theme = 'light' | 'dark';
export type NavTab = 'home' | 'shelf' | 'scan' | 'routine' | 'profile';
export type RoutinePeriod = 'AM' | 'PM';
export type ScanStage = 'scan' | 'analyzing' | 'result';

export interface PersonaData {
  label: string;
  name: string;
  concerns: string[];
  hydration: number;
  barrier: number;
  tone: number;
  hero: string;
  today: string;
  ritualCopy: string;
  aiCoach: string;
}

export interface Product {
  id: string;
  brand: string;
  name: string;
  type: string;
  size: string;
  img: string;
  steps: string[];
  tag: string;
  opened: string;
  match: number;
  verdict?: string;
  ingredients?: Ingredient[];
}

export interface Ingredient {
  name: string;
  reason: string;
  tone: 'good' | 'neutral' | 'warn';
}

export interface RoutineStep {
  id: string;
  step: string;
  product: string;
  brand: string;
  time: string;
  done: boolean;
  productId?: string;
}

export interface SkinRead {
  hero: string;
  tip: string;
  hydration: number;
  barrier: number;
  tone: number;
}

export interface AppState {
  user: import('@supabase/supabase-js').User | null;
  persona: Persona;
  theme: Theme;
  activeTab: NavTab;
  selectedProductId: string | null;
  showOnboarding: boolean;
  showScan: boolean;
  showAdmin: boolean;
  routineCheckins: Record<string, boolean>;
  setPersona: (p: Persona) => void;
  setTheme: (t: Theme) => void;
  setActiveTab: (t: NavTab) => void;
  setSelectedProductId: (id: string | null) => void;
  setShowOnboarding: (v: boolean) => void;
  setShowScan: (v: boolean) => void;
  setShowAdmin: (v: boolean) => void;
  toggleRoutineStep: (key: string) => void;
  signOut: () => void;
}
