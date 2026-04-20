'use client';

import { AppProvider, useApp } from '@/lib/AppContext';
import { StatusBar } from '@/components/ui/StatusBar';
import { TabBar } from '@/components/ui/TabBar';
import { Dashboard } from '@/components/screens/Dashboard';
import { Shelf } from '@/components/screens/Shelf';
import { ProductDetail } from '@/components/screens/ProductDetail';
import { Routine } from '@/components/screens/Routine';
import { Profile } from '@/components/screens/Profile';
import { Onboarding } from '@/components/screens/Onboarding';
import { ScanFlow } from '@/components/screens/ScanFlow';
import { AuthScreen } from '@/components/screens/AuthScreen';
import { AdminPanel } from '@/components/screens/AdminPanel';

function AppShell() {
  const { activeTab, setActiveTab, selectedProductId, showOnboarding, showScan, showAdmin, theme, user } = useApp();
  const dark = theme === 'dark';

  if (!user) return <AuthScreen />;

  function renderScreen() {
    switch (activeTab) {
      case 'home':    return <Dashboard />;
      case 'shelf':   return <Shelf />;
      case 'routine': return <Routine />;
      case 'profile': return <Profile />;
      default:        return <Dashboard />;
    }
  }

  function renderOverlays() {
    return (
      <>
        {selectedProductId && <ProductDetail />}
        {showOnboarding && <Onboarding />}
        {showScan && <ScanFlow />}
        {showAdmin && <AdminPanel />}
      </>
    );
  }

  return (
    <>
      <div className="mobile-shell" style={{
        display: 'none', position: 'fixed', inset: 0,
        flexDirection: 'column', background: 'var(--bg)', overflow: 'hidden',
      }}>
        <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {renderScreen()}
          {!showOnboarding && !showScan && !showAdmin && (
            <TabBar active={activeTab} onNav={setActiveTab} dark={dark} />
          )}
          {renderOverlays()}
        </div>
      </div>

      <div className="desktop-stage" style={{
        minHeight: '100vh',
        background: dark
          ? 'radial-gradient(1200px 600px at 20% -10%, #201d19 0%, transparent 60%), radial-gradient(900px 500px at 110% 10%, #1a1e19 0%, transparent 55%), #0e0d0b'
          : 'radial-gradient(1200px 600px at 20% -10%, #efe6d8 0%, transparent 60%), radial-gradient(900px 500px at 110% 10%, #e6ece0 0%, transparent 55%), #f2ece1',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 20px 60px',
      }}>
        <div style={{
          width: 392, height: 840, borderRadius: 52, overflow: 'hidden',
          position: 'relative',
          background: dark ? '#161513' : '#f7f2ea',
          boxShadow: `0 40px 80px rgba(26,18,6,0.12), 0 0 0 10px ${dark ? '#0b0a09' : '#eae3d3'}, 0 0 0 11px rgba(26,18,6,0.12)`,
          flexShrink: 0,
        }}>
          <div style={{
            position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
            width: 118, height: 34, borderRadius: 24, background: '#0b0a09', zIndex: 50, pointerEvents: 'none',
          }}/>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <StatusBar dark={dark} />
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {renderScreen()}
              {!showOnboarding && !showScan && !showAdmin && (
                <TabBar active={activeTab} onNav={setActiveTab} dark={dark} />
              )}
              {renderOverlays()}
            </div>
          </div>
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 24, zIndex: 60,
            display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
            paddingBottom: 7, pointerEvents: 'none',
          }}>
            <div style={{ width: 126, height: 4, borderRadius: 100, background: dark ? 'rgba(245,239,228,0.65)' : 'rgba(26,26,23,0.3)' }}/>
          </div>
        </div>
      </div>
    </>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
