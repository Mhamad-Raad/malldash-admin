import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';
type ColorTheme = 'default' | 'clay' | 'cosmic-night' | 'supabase' | 'ocean-breeze' | 'aurora' | 'midnight-rose' | 'neon-cyber' | 'slate-storm';
type FontTheme = 'default' | 'modern' | 'classic' | 'mono' | 'rounded' | 'elegant' | 'compact' | 'playful' | 'times' | 'roboto' | 'opensans' | 'lato' | 'montserrat' | 'sourcecode' | 'literary' | 'thin';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultColorTheme?: ColorTheme;
  defaultFontTheme?: FontTheme;
  storageKey?: string;
  colorStorageKey?: string;
  fontStorageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colorTheme: ColorTheme;
  setColorTheme: (colorTheme: ColorTheme) => void;
  fontTheme: FontTheme;
  setFontTheme: (fontTheme: FontTheme) => void;
};

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
  colorTheme: 'default',
  setColorTheme: () => null,
  fontTheme: 'default',
  setFontTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  defaultColorTheme = 'default',
  defaultFontTheme = 'default',
  storageKey = 'vite-ui-theme',
  colorStorageKey = 'vite-ui-color-theme',
  fontStorageKey = 'vite-ui-font-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );
  const [colorTheme, setColorTheme] = useState<ColorTheme>(
    () => (localStorage.getItem(colorStorageKey) as ColorTheme) || defaultColorTheme
  );
  const [fontTheme, setFontTheme] = useState<FontTheme>(
    () => (localStorage.getItem(fontStorageKey) as FontTheme) || defaultFontTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;

    // Remove all theme classes
    root.classList.remove(
      'light', 'dark',
      'theme-clay', 'theme-cosmic-night', 'theme-supabase', 'theme-ocean-breeze', 'theme-aurora',
      'theme-midnight-rose', 'theme-neon-cyber', 'theme-slate-storm',
      'font-modern', 'font-classic', 'font-mono', 'font-rounded', 'font-elegant', 'font-compact', 'font-playful',
      'font-times', 'font-roboto', 'font-opensans', 'font-lato', 'font-montserrat', 'font-sourcecode', 'font-literary', 'font-thin'
    );

    // Apply color theme class (if not default)
    if (colorTheme !== 'default') {
      root.classList.add(`theme-${colorTheme}`);
    }

    // Apply font theme class (if not default)
    if (fontTheme !== 'default') {
      root.classList.add(`font-${fontTheme}`);
    }

    // Apply light/dark mode
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme, colorTheme, fontTheme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    colorTheme,
    setColorTheme: (colorTheme: ColorTheme) => {
      localStorage.setItem(colorStorageKey, colorTheme);
      setColorTheme(colorTheme);
    },
    fontTheme,
    setFontTheme: (fontTheme: FontTheme) => {
      localStorage.setItem(fontStorageKey, fontTheme);
      setFontTheme(fontTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const theme = localStorage.getItem('vite-ui-theme');

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
