import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AppSettingsProvider } from '@/context/AppSettingsContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { MainLayout } from '@/components/MainLayout';
import Auth from '@/pages/Auth';
import TodayView from '@/pages/TodayView';
import ContentHub from '@/pages/ContentHub';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';
import { ContactManager } from '@/components/ContactManager';
import { DealsManager } from '@/components/DealsManager';
import { EmailComposer } from '@/components/EmailComposer';
import { CampaignScheduler } from '@/components/CampaignScheduler';
import { CallNotes } from '@/components/CallNotes';
import { StatusTracker } from '@/components/StatusTracker';
import { OnboardingChoice } from '@/components/OnboardingChoice';
import { seedDemoData, isFirstTimeUser } from '@/lib/demoData';
import './App.css';

function OnboardingGate({ children }: { children: React.ReactNode }) {
  const { user, hydrating } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [checked, setChecked] = useState(false);

  // After cloud hydration completes, decide whether to show onboarding.
  useEffect(() => {
    if (!user || hydrating) return;
    if (isFirstTimeUser()) setShowOnboarding(true);
    setChecked(true);
  }, [user, hydrating]);

  const handleChoice = (choice: 'demo' | 'fresh') => {
    if (choice === 'demo') {
      seedDemoData();
    } else {
      localStorage.setItem('onx.onboarded', 'true');
    }
    setShowOnboarding(false);
  };

  return (
    <>
      {children}
      <OnboardingChoice open={showOnboarding && checked} onChoice={handleChoice} />
    </>
  );
}

function App() {
  return (
    <AppSettingsProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              element={
                <ProtectedRoute>
                  <OnboardingGate>
                    <MainLayout />
                  </OnboardingGate>
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<TodayView />} />
              <Route path="/composer" element={<EmailComposer />} />
              <Route path="/campaigns" element={<CampaignScheduler />} />
              <Route path="/call-notes" element={<CallNotes />} />
              <Route path="/content" element={<ContentHub />} />
              <Route path="/contacts" element={<ContactManager />} />
              <Route path="/deals" element={<DealsManager />} />
              <Route path="/analytics" element={<StatusTracker />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </AppSettingsProvider>
  );
}

export default App;
