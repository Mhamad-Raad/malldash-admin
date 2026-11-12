export type ThemeOption = 'light' | 'dark' | 'system';

export type ColorThemeOption =
  | 'default'
  | 'clay'
  | 'cosmic-night'
  | 'supabase'
  | 'ocean-breeze'
  | 'aurora'
  | 'midnight-rose'
  | 'neon-cyber'
  | 'slate-storm';

export type FontThemeOption =
  | 'default'
  | 'modern'
  | 'classic'
  | 'mono'
  | 'rounded'
  | 'elegant'
  | 'compact'
  | 'playful'
  | 'times'
  | 'roboto'
  | 'opensans'
  | 'lato'
  | 'montserrat'
  | 'sourcecode'
  | 'literary'
  | 'thin';

export type ColorSwatch = {
  primary: string;
  secondary: string;
  accent: string;
};
