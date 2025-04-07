// main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// ✅ Register the PWA service worker using vite-plugin-pwa
import { registerSW } from 'virtual:pwa-register';

registerSW({
  onNeedRefresh() {
    // Optional: show a toast/banner to user saying "New update available"
    console.log('A new version is available. Please refresh.');
  },
  onOfflineReady() {
    // Optional: notify user that the app is ready to use offline
    console.log('App is ready to work offline.');
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
