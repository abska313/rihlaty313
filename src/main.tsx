import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register PWA Service Worker
if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((reg) => {
        console.log('[ABSKA] Service Worker registered with scope:', reg.scope);
      })
      .catch((err) => {
        console.warn('[ABSKA] Service Worker registration note:', err);
      });
  });
}

createRoot(document.getElementById('root')!).render(<App />);
