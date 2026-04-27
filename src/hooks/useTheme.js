import { useEffect, useState } from 'react';

const STORAGE_KEY = 'hub-theme';
const CUSTOM_KEY = 'hub-theme-custom';

export const PRESET_THEMES = ['light', 'dark', 'midnight', 'forest', 'crimson'];
export const THEMES = [...PRESET_THEMES, 'custom'];

export const DEFAULT_CUSTOM = {
  mode: 'dark',
  accent: '#7c5cff',
  accent2: '#ff5cc8',
};

const LIGHT_BASE = {
  '--bg': '#ffffff',
  '--bg-elev': '#ffffff',
  '--bg-subtle': '#fafafa',
  '--text': '#171717',
  '--text-secondary': '#4d4d4d',
  '--text-muted': '#808080',
  '--border': 'rgba(0, 0, 0, 0.08)',
  '--border-strong': '#ebebeb',
  '--inner-glow': '#fafafa',
  '--shadow-card':
    'rgba(0, 0, 0, 0.08) 0px 0px 0px 1px, rgba(0, 0, 0, 0.04) 0px 2px 2px, rgba(0, 0, 0, 0.04) 0px 8px 8px -8px, var(--inner-glow) 0px 0px 0px 1px inset',
  '--shadow-ring': 'rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',
  '--grid-color': 'rgba(0, 0, 0, 0.04)',
  '--accent-green': '#17a25b',
  '--accent-amber': '#d97706',
  '--accent-red': '#ff5b4f',
};

const DARK_BASE = {
  '--bg': '#0a0a0a',
  '--bg-elev': '#111111',
  '--bg-subtle': '#161616',
  '--text': '#ededed',
  '--text-secondary': '#a1a1a1',
  '--text-muted': '#6e6e6e',
  '--border': 'rgba(255, 255, 255, 0.10)',
  '--border-strong': '#262626',
  '--inner-glow': '#1a1a1a',
  '--shadow-card':
    'rgba(255, 255, 255, 0.08) 0px 0px 0px 1px, rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.6) 0px 8px 24px -8px, var(--inner-glow) 0px 0px 0px 1px inset',
  '--shadow-ring': 'rgba(255, 255, 255, 0.10) 0px 0px 0px 1px',
  '--grid-color': 'rgba(255, 255, 255, 0.04)',
  '--accent-green': '#4ade80',
  '--accent-amber': '#fbbf24',
  '--accent-red': '#ff7a70',
};

export function buildCustomVars(palette) {
  const p = { ...DEFAULT_CUSTOM, ...(palette || {}) };
  const base = p.mode === 'light' ? LIGHT_BASE : DARK_BASE;
  const bg = p.mode === 'light' ? '#ffffff' : '#0a0a0a';
  return {
    ...base,
    '--accent-blue': p.accent,
    '--link': p.accent,
    '--focus': p.accent,
    '--accent-pink': p.accent2,
    '--badge-bg': `color-mix(in srgb, ${p.accent} ${p.mode === 'light' ? 14 : 22}%, ${bg})`,
    '--badge-text': p.accent,
  };
}

const INLINE_VAR_KEYS = Object.keys(buildCustomVars(DEFAULT_CUSTOM));

function applyTheme(theme, palette) {
  const html = document.documentElement;
  html.setAttribute('data-theme', theme);
  if (theme === 'custom') {
    const vars = buildCustomVars(palette);
    Object.entries(vars).forEach(([k, v]) => html.style.setProperty(k, v));
  } else {
    INLINE_VAR_KEYS.forEach((k) => html.style.removeProperty(k));
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && THEMES.includes(saved)) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [custom, setCustomState] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_CUSTOM;
    try {
      const raw = window.localStorage.getItem(CUSTOM_KEY);
      if (raw) return { ...DEFAULT_CUSTOM, ...JSON.parse(raw) };
    } catch {}
    return DEFAULT_CUSTOM;
  });

  useEffect(() => {
    applyTheme(theme, custom);
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme, custom]);

  useEffect(() => {
    window.localStorage.setItem(CUSTOM_KEY, JSON.stringify(custom));
  }, [custom]);

  return {
    theme,
    setTheme: setThemeState,
    custom,
    setCustom: setCustomState,
  };
}
