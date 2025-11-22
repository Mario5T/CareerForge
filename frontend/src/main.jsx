import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Initialize theme early to avoid flash
function initializeTheme() {
  try {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = stored ? stored : (prefersDark ? 'dark' : 'light');
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  } catch {}
}

// Initialize on page load
initializeTheme();

// Re-initialize theme on visibility change (handles OAuth redirects)
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    initializeTheme();
  }
});

// Also re-initialize on page show (handles browser back/forward)
window.addEventListener('pageshow', () => {
  initializeTheme();
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
