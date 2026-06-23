import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { installAutoSync } from '@/lib/cloudSync';

// Patch localStorage so every write to a synced key mirrors to the cloud.
// Must run before any module reads/writes localStorage.
installAutoSync();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
