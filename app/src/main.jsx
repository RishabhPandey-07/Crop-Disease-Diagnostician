import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// Register PWA service worker (handled automatically by vite-plugin-pwa)
// The plugin injects the registration code at build time.

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
