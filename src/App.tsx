import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AppSettingsProvider } from '@/context/AppSettingsContext';
import { MainLayout } from '@/components/MainLayout';
import TodayView from '@/pages/TodayView';
import ContentHub from '@/pages/ContentHub';
import Settings from '@/pages/Settings';
import { ContactManager } from '@/components/ContactManager';
import { DealsManager } from '@/components/DealsManager';
import { EmailComposer } from '@/components/EmailComposer';
import { CampaignScheduler } from '@/components/CampaignScheduler';
import { CallNotes } from '@/components/CallNotes';
import { StatusTracker } from '@/components/StatusTracker';
import './App.css';

function App() {
  return (
    <AppSettingsProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
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
        </Routes>
        <Toaster />
      </BrowserRouter>
    </AppSettingsProvider>
  );
}

export default App;
