import { Check, Type } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import type { FontThemeOption } from './types';

interface FontThemeCardProps {
  fontTheme: FontThemeOption;
  currentFontTheme: FontThemeOption;
  onSelect: (fontTheme: FontThemeOption) => void;
  title: string;
  description: string;
  fontFamily: string;
  sampleText: string;
}

export const FontThemeCard = ({
  fontTheme,
  currentFontTheme,
  onSelect,
  title,
  description,
  fontFamily,
  sampleText,
}: FontThemeCardProps) => {
  const isSelected = currentFontTheme === fontTheme;

  return (
    <Card
      className={cn(
        'relative cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02]',
        isSelected ? 'ring-2 ring-primary shadow-lg' : 'hover:ring-1 hover:ring-primary/50'
      )}
      onClick={() => onSelect(fontTheme)}
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
            <Type className='size-5' />
          </div>
          <div>
            <CardTitle className='text-lg'>{title}</CardTitle>
            <CardDescription className='text-sm'>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className='p-4 rounded-lg border bg-muted/30 text-center' style={{ fontFamily }}>
          <p className='text-2xl font-semibold mb-1'>{sampleText}</p>
          <p className='text-sm text-muted-foreground'>Aa Bb Cc 123</p>
        </div>
      </CardContent>
    </Card>
  );
};
