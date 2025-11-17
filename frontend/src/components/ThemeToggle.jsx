import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from './ui/button';

function getStoredTheme() {
  try {
    return localStorage.getItem('theme');
  } catch {
    return null;
  }
}

function getSystemPrefersDark() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = getStoredTheme();
    const initialDark = stored ? stored === 'dark' : getSystemPrefersDark();
    setIsDark(initialDark);
    applyTheme(initialDark ? 'dark' : 'light');
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    const nextTheme = next ? 'dark' : 'light';
    try { localStorage.setItem('theme', nextTheme); } catch {}
    applyTheme(nextTheme);
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={toggle}
      className="transition-colors hover:bg-transparent"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}
