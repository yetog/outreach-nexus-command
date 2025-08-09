
import React from 'react';
import { Dashboard } from '@/components/Dashboard';
import { Toaster } from '@/components/ui/toaster';
import { AppSettingsProvider } from '@/context/AppSettingsContext';
import './App.css';

function App() {
  return (
    <AppSettingsProvider>
      <div className="App">
        <Dashboard />
        <Toaster />
      </div>
    </AppSettingsProvider>
  );
}

export default App;
