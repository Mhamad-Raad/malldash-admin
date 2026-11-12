import type { ReactNode } from 'react';
import { Check } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import type { ThemeOption } from './types';

interface ThemeCardProps {
  theme: ThemeOption;
  currentTheme: ThemeOption;
  onSelect: (theme: ThemeOption) => void;
  title: string;
  description: string;
  icon: ReactNode;
  preview: ReactNode;
}

export const ThemeCard = ({
  theme,
  currentTheme,
  onSelect,
  title,
  description,
  icon,
  preview,
}: ThemeCardProps) => {
  const isSelected = currentTheme === theme;

  return (
    <Card
      className={cn(
        'relative cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02]',
        isSelected ? 'ring-2 ring-primary shadow-lg' : 'hover:ring-1 hover:ring-primary/50'
      )}
      onClick={() => onSelect(theme)}
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
            {icon}
          </div>
          <div>
            <CardTitle className='text-lg'>{title}</CardTitle>
            <CardDescription className='text-sm'>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className='rounded-lg overflow-hidden border shadow-sm'>{preview}</div>
      </CardContent>
    </Card>
  );
};
