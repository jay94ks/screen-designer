import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

// Global error handlers to prevent unhandled exceptions causing whiteout
window.addEventListener('error', (event) => {
  console.error('[Global Window Error Caught]:', event.error || event.message);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('[Global Unhandled Promise Rejection]:', event.reason);
});

// F12 and Ctrl+Shift+I fallback in browser/renderer context
window.addEventListener('keydown', (e) => {
  if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'i')) {
    const api = (window as any).electronAPI;
    if (api?.toggleDevTools) {
      api.toggleDevTools();
      e.preventDefault();
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
