import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type FontSize = 'normal' | 'large' | 'xlarge';

export interface AccessibilitySettings {
  fontSize: FontSize;
  highContrast: boolean;
  reduceMotion: boolean;
  dyslexiaFont: boolean;
}

const STORAGE_KEY = 'whells-accessibility';

const DEFAULT_SETTINGS: AccessibilitySettings = {
  fontSize: 'normal',
  highContrast: false,
  reduceMotion: false,
  dyslexiaFont: false,
};

function loadSettings(): AccessibilitySettings {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    // malformed or inaccessible storage — fall through to defaults
  }
  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  return { ...DEFAULT_SETTINGS, reduceMotion: prefersReducedMotion };
}

interface AccessibilityContextValue {
  settings: AccessibilitySettings;
  setFontSize: (size: FontSize) => void;
  toggleHighContrast: () => void;
  toggleReduceMotion: () => void;
  toggleDyslexiaFont: () => void;
  reset: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

/** Applies settings as data-* attributes on <body> so plain CSS can react to them everywhere, instead of threading props through every component. */
export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(loadSettings);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    document.body.dataset.fontSize = settings.fontSize;
    document.body.dataset.contrast = settings.highContrast ? 'high' : 'normal';
    document.body.dataset.motion = settings.reduceMotion ? 'reduced' : 'normal';
    document.body.dataset.font = settings.dyslexiaFont ? 'dyslexia' : 'normal';
  }, [settings]);

  const value = useMemo<AccessibilityContextValue>(
    () => ({
      settings,
      setFontSize: (fontSize) => setSettings((prev) => ({ ...prev, fontSize })),
      toggleHighContrast: () => setSettings((prev) => ({ ...prev, highContrast: !prev.highContrast })),
      toggleReduceMotion: () => setSettings((prev) => ({ ...prev, reduceMotion: !prev.reduceMotion })),
      toggleDyslexiaFont: () => setSettings((prev) => ({ ...prev, dyslexiaFont: !prev.dyslexiaFont })),
      reset: () => setSettings(DEFAULT_SETTINGS),
    }),
    [settings],
  );

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
}

export function useAccessibility(): AccessibilityContextValue {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error('useAccessibility must be used within AccessibilityProvider');
  return ctx;
}
