import { Users, SearchX, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const EmptyState = () => {
  const { t } = useTranslation('users');
  
  return (
    <div className='relative flex flex-col items-center justify-center py-20 px-8 overflow-hidden'>
      {/* Background decorative elements */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        {/* Gradient orbs */}
        <div className='absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse' />
        <div className='absolute bottom-1/4 right-1/4 w-48 h-48 bg-chart-1/10 rounded-full blur-3xl animate-pulse delay-1000' />
        
        {/* Grid pattern */}
        <div className='absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black_40%,transparent_100%)]' />
      </div>

      {/* Content */}
      <div className='relative z-10 flex flex-col items-center'>
        {/* Icon container with layered design */}
        <div className='relative mb-8'>
          {/* Outer ring */}
          <div className='absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-chart-1/20 blur-md scale-150' />
          
          {/* Middle ring with rotation animation */}
          <div className='absolute -inset-4 rounded-full border-2 border-dashed border-primary/20 animate-[spin_20s_linear_infinite]' />
          
          {/* Icon background */}
          <div className='relative p-6 rounded-2xl bg-gradient-to-br from-card via-card to-muted border border-border/50 shadow-xl'>
            <div className='relative'>
              <Users className='size-14 text-primary' strokeWidth={1.5} />
              {/* Small sparkle accent */}
              <Sparkles className='absolute -top-1 -right-1 size-4 text-chart-4 animate-pulse' />
            </div>
          </div>
          
          {/* Floating search X indicator */}
          <div className='absolute -bottom-2 -right-2 p-2 rounded-full bg-muted border border-border shadow-lg'>
            <SearchX className='size-4 text-muted-foreground' />
          </div>
        </div>

        {/* Text content */}
        <div className='text-center max-w-md space-y-3'>
          <h3 className='text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent'>
            {t('emptyState.title')}
          </h3>
          
          <p className='text-muted-foreground leading-relaxed'>
            {t('emptyState.description')}
          </p>
        </div>

        {/* Decorative suggestion chips */}
        <div className='flex flex-wrap items-center justify-center gap-2 mt-8'>
          <span className='px-3 py-1.5 text-xs font-medium rounded-full bg-muted/80 text-muted-foreground border border-border/50'>
            {t('emptyState.suggestions.differentSearch')}
          </span>
          <span className='px-3 py-1.5 text-xs font-medium rounded-full bg-muted/80 text-muted-foreground border border-border/50'>
            {t('emptyState.suggestions.clearFilters')}
          </span>
          <span className='px-3 py-1.5 text-xs font-medium rounded-full bg-muted/80 text-muted-foreground border border-border/50'>
            {t('emptyState.suggestions.checkSpelling')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
