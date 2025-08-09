
import React from 'react';
import { Dashboard } from '@/components/Dashboard';
import { Toaster } from '@/components/ui/toaster';
import './App.css';

function App() {
  return (
    <div className="App">
      <Dashboard />
      <Toaster />
    </div>
  );
}

export default App;
