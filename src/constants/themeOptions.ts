import type { ColorThemeOption, FontThemeOption } from '@/components/Settings/Themes/types';

export const colorThemeOptions: {
  colorTheme: ColorThemeOption;
  titleKey: string;
  descriptionKey: string;
  colors: { primary: string; secondary: string; accent: string };
}[] = [
  {
    colorTheme: 'default',
    titleKey: 'defaultColorTheme',
    descriptionKey: 'defaultColorThemeDescription',
    colors: {
      primary: '#000000',
      secondary: '#f0f0f0',
      accent: '#e5e5e5',
    },
  },
  {
    colorTheme: 'clay',
    titleKey: 'clayColorTheme',
    descriptionKey: 'clayColorThemeDescription',
    colors: {
      primary: '#b45309',
      secondary: '#fef3c7',
      accent: '#fde68a',
    },
  },
  {
    colorTheme: 'cosmic-night',
    titleKey: 'cosmicNightColorTheme',
    descriptionKey: 'cosmicNightColorThemeDescription',
    colors: {
      primary: '#7c3aed',
      secondary: '#e0e7ff',
      accent: '#c4b5fd',
    },
  },
  {
    colorTheme: 'supabase',
    titleKey: 'supabaseColorTheme',
    descriptionKey: 'supabaseColorThemeDescription',
    colors: {
      primary: '#3ecf8e',
      secondary: '#f0f0f0',
      accent: '#b8f0d8',
    },
  },
  {
    colorTheme: 'ocean-breeze',
    titleKey: 'oceanBreezeColorTheme',
    descriptionKey: 'oceanBreezeColorThemeDescription',
    colors: {
      primary: '#2dd4bf',
      secondary: '#e0f2fe',
      accent: '#99f6e4',
    },
  },
  {
    colorTheme: 'aurora',
    titleKey: 'auroraColorTheme',
    descriptionKey: 'auroraColorThemeDescription',
    colors: {
      primary: '#38bdf8',
      secondary: '#e0e7ff',
      accent: '#f0abfc',
    },
  },
  {
    colorTheme: 'midnight-rose',
    titleKey: 'midnightRoseColorTheme',
    descriptionKey: 'midnightRoseColorThemeDescription',
    colors: {
      primary: '#e11d48',
      secondary: '#ddd6fe',
      accent: '#fda4af',
    },
  },
  {
    colorTheme: 'neon-cyber',
    titleKey: 'neonCyberColorTheme',
    descriptionKey: 'neonCyberColorThemeDescription',
    colors: {
      primary: '#ec4899',
      secondary: '#67e8f9',
      accent: '#22d3d1',
    },
  },
  {
    colorTheme: 'slate-storm',
    titleKey: 'slateStormColorTheme',
    descriptionKey: 'slateStormColorThemeDescription',
    colors: {
      primary: '#64748b',
      secondary: '#cbd5e1',
      accent: '#94a3b8',
    },
  },
];

export const fontThemeOptions: {
  fontTheme: FontThemeOption;
  titleKey: string;
  descriptionKey: string;
  fontFamily: string;
  sampleText: string;
}[] = [
  {
    fontTheme: 'default',
    titleKey: 'defaultFontTheme',
    descriptionKey: 'defaultFontThemeDescription',
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
    sampleText: 'The quick fox',
  },
  {
    fontTheme: 'modern',
    titleKey: 'modernFontTheme',
    descriptionKey: 'modernFontThemeDescription',
    fontFamily: '"Inter", ui-sans-serif, system-ui, sans-serif',
    sampleText: 'The quick fox',
  },
  {
    fontTheme: 'classic',
    titleKey: 'classicFontTheme',
    descriptionKey: 'classicFontThemeDescription',
    fontFamily: 'Georgia, "Times New Roman", serif',
    sampleText: 'The quick fox',
  },
  {
    fontTheme: 'mono',
    titleKey: 'monoFontTheme',
    descriptionKey: 'monoFontThemeDescription',
    fontFamily: '"JetBrains Mono", "Fira Code", monospace',
    sampleText: 'The quick fox',
  },
  {
    fontTheme: 'rounded',
    titleKey: 'roundedFontTheme',
    descriptionKey: 'roundedFontThemeDescription',
    fontFamily: '"Nunito", sans-serif',
    sampleText: 'The quick fox',
  },
  {
    fontTheme: 'elegant',
    titleKey: 'elegantFontTheme',
    descriptionKey: 'elegantFontThemeDescription',
    fontFamily: '"Playfair Display", serif',
    sampleText: 'The quick fox',
  },
  {
    fontTheme: 'compact',
    titleKey: 'compactFontTheme',
    descriptionKey: 'compactFontThemeDescription',
    fontFamily: '"IBM Plex Sans", sans-serif',
    sampleText: 'The quick fox',
  },
  {
    fontTheme: 'playful',
    titleKey: 'playfulFontTheme',
    descriptionKey: 'playfulFontThemeDescription',
    fontFamily: '"Poppins", sans-serif',
    sampleText: 'The quick fox',
  },
  {
    fontTheme: 'times',
    titleKey: 'timesFontTheme',
    descriptionKey: 'timesFontThemeDescription',
    fontFamily: '"Times New Roman", Times, serif',
    sampleText: 'The quick fox',
  },
  {
    fontTheme: 'roboto',
    titleKey: 'robotoFontTheme',
    descriptionKey: 'robotoFontThemeDescription',
    fontFamily: '"Roboto", sans-serif',
    sampleText: 'The quick fox',
  },
  {
    fontTheme: 'opensans',
    titleKey: 'opensansFontTheme',
    descriptionKey: 'opensansFontThemeDescription',
    fontFamily: '"Open Sans", sans-serif',
    sampleText: 'The quick fox',
  },
  {
    fontTheme: 'lato',
    titleKey: 'latoFontTheme',
    descriptionKey: 'latoFontThemeDescription',
    fontFamily: '"Lato", sans-serif',
    sampleText: 'The quick fox',
  },
  {
    fontTheme: 'montserrat',
    titleKey: 'montserratFontTheme',
    descriptionKey: 'montserratFontThemeDescription',
    fontFamily: '"Montserrat", sans-serif',
    sampleText: 'The quick fox',
  },
  {
    fontTheme: 'sourcecode',
    titleKey: 'sourcecodeFontTheme',
    descriptionKey: 'sourcecodeFontThemeDescription',
    fontFamily: '"Source Code Pro", monospace',
    sampleText: 'The quick fox',
  },
  {
    fontTheme: 'literary',
    titleKey: 'literaryFontTheme',
    descriptionKey: 'literaryFontThemeDescription',
    fontFamily: '"Merriweather", serif',
    sampleText: 'The quick fox',
  },
  {
    fontTheme: 'thin',
    titleKey: 'thinFontTheme',
    descriptionKey: 'thinFontThemeDescription',
    fontFamily: '"Raleway", sans-serif',
    sampleText: 'The quick fox',
  },
];
