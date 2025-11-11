import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './App.tsx';

// Versjonsnummer for å verifisere deployment
const APP_VERSION = '1.0';
console.log(`🚀 dotDAGENE app started - Version ${APP_VERSION}`, {
  version: APP_VERSION,
  timestamp: new Date().toISOString(),
  environment: import.meta.env.MODE || 'production'
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
