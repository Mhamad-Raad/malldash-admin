import { useTranslation } from 'react-i18next';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { ThemeCard } from '@/components/Settings/Themes/ThemeCard';
import { ColorThemeCard } from '@/components/Settings/Themes/ColorThemeCard';
import { FontThemeCard } from '@/components/Settings/Themes/FontThemeCard';
import { LightPreview, DarkPreview, SystemPreview } from '@/components/Settings/Themes/ThemePreviews';
import type { ThemeOption } from '@/components/Settings/Themes/types';
import { colorThemeOptions, fontThemeOptions } from '@/constants/themeOptions';

const Themes = () => {
  const { t } = useTranslation('themes');
  const { theme, setTheme, colorTheme, setColorTheme, fontTheme, setFontTheme } = useTheme();

  const themeOptions: {
    theme: ThemeOption;
    titleKey: string;
    descriptionKey: string;
    icon: React.ReactNode;
    preview: React.ReactNode;
  }[] = [
    {
      theme: 'light',
      titleKey: 'lightTheme',
      descriptionKey: 'lightThemeDescription',
      icon: <Sun className='size-5' />,
      preview: <LightPreview />,
    },
    {
      theme: 'dark',
      titleKey: 'darkTheme',
      descriptionKey: 'darkThemeDescription',
      icon: <Moon className='size-5' />,
      preview: <DarkPreview />,
    },
    {
      theme: 'system',
      titleKey: 'systemTheme',
      descriptionKey: 'systemThemeDescription',
      icon: <Monitor className='size-5' />,
      preview: <SystemPreview />,
    },
  ];

  return (
    <div className='p-6 space-y-8'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>{t('title')}</h1>
        <p className='text-muted-foreground mt-1'>{t('subtitle')}</p>
      </div>

      {/* Appearance Mode Section */}
      <div className='space-y-4'>
        <div>
          <h2 className='text-xl font-semibold'>{t('appearanceTitle')}</h2>
          <p className='text-muted-foreground text-sm'>{t('appearanceSubtitle')}</p>
        </div>
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {themeOptions.map((option) => (
            <ThemeCard
              key={option.theme}
              theme={option.theme}
              currentTheme={theme}
              onSelect={setTheme}
              title={t(option.titleKey)}
              description={t(option.descriptionKey)}
              icon={option.icon}
              preview={option.preview}
            />
          ))}
        </div>
      </div>

      {/* Color Theme Section */}
      <div className='space-y-4'>
        <div>
          <h2 className='text-xl font-semibold'>{t('colorThemeTitle')}</h2>
          <p className='text-muted-foreground text-sm'>{t('colorThemeSubtitle')}</p>
        </div>
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {colorThemeOptions.map((option) => (
            <ColorThemeCard
              key={option.colorTheme}
              colorTheme={option.colorTheme}
              currentColorTheme={colorTheme}
              onSelect={setColorTheme}
              title={t(option.titleKey)}
              description={t(option.descriptionKey)}
              colors={option.colors}
            />
          ))}
        </div>
      </div>

      {/* Font Theme Section */}
      <div className='space-y-4'>
        <div>
          <h2 className='text-xl font-semibold'>{t('fontThemeTitle')}</h2>
          <p className='text-muted-foreground text-sm'>{t('fontThemeSubtitle')}</p>
        </div>
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
          {fontThemeOptions.map((option) => (
            <FontThemeCard
              key={option.fontTheme}
              fontTheme={option.fontTheme}
              currentFontTheme={fontTheme}
              onSelect={setFontTheme}
              title={t(option.titleKey)}
              description={t(option.descriptionKey)}
              fontFamily={option.fontFamily}
              sampleText={option.sampleText}
            />
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('moreThemesTitle')}</CardTitle>
          <CardDescription>{t('moreThemesDescription')}</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export default Themes;
