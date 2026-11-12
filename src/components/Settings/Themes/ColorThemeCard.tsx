import { Check, Palette } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import type { ColorSwatch, ColorThemeOption } from './types';

interface ColorThemeCardProps {
  colorTheme: ColorThemeOption;
  currentColorTheme: ColorThemeOption;
  onSelect: (colorTheme: ColorThemeOption) => void;
  title: string;
  description: string;
  colors: ColorSwatch;
}

export const ColorThemeCard = ({
  colorTheme,
  currentColorTheme,
  onSelect,
  title,
  description,
  colors,
}: ColorThemeCardProps) => {
  const isSelected = currentColorTheme === colorTheme;

  return (
    <Card
      className={cn(
        'relative cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02]',
        isSelected ? 'ring-2 ring-primary shadow-lg' : 'hover:ring-1 hover:ring-primary/50'
      )}
      onClick={() => onSelect(colorTheme)}
    >
      {isSelected && (
        <div className='absolute top-3 right-3 z-10'>
          <div className='bg-primary text-primary-foreground rounded-full p-1'>
            <Check className='size-4' />
          </div>
        </div>
      )}
      <CardHeader className='pb-3'>
        <div className='flex items-center gap-3'>
          <div
            className={cn(
              'p-2 rounded-lg transition-colors',
              isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
            )}
          >
            <Palette className='size-5' />
          </div>
          <div>
            <CardTitle className='text-lg'>{title}</CardTitle>
            <CardDescription className='text-sm'>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className='flex gap-2'>
          <div className='h-12 flex-1 rounded-lg shadow-sm border' style={{ backgroundColor: colors.primary }} />
          <div
            className='h-12 flex-1 rounded-lg shadow-sm border'
            style={{ backgroundColor: colors.secondary }}
          />
          <div className='h-12 flex-1 rounded-lg shadow-sm border' style={{ backgroundColor: colors.accent }} />
        </div>
      </CardContent>
    </Card>
  );
};
