import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Users,
  Store,
  Building2,
  Package,
  FileText,
  Home,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { DashboardStatsProps, DashboardStat } from '@/interfaces/Home.interface';

const iconMap = {
  users: Users,
  vendors: Store,
  buildings: Building2,
  products: Package,
  requests: FileText,
  apartments: Home,
};

const colorMap = {
  users: {
    bg: 'bg-blue-500/10 dark:bg-blue-500/20',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-500/20',
  },
  vendors: {
    bg: 'bg-amber-500/10 dark:bg-amber-500/20',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-500/20',
  },
  buildings: {
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-500/20',
  },
  products: {
    bg: 'bg-purple-500/10 dark:bg-purple-500/20',
    text: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-500/20',
  },
  requests: {
    bg: 'bg-rose-500/10 dark:bg-rose-500/20',
    text: 'text-rose-600 dark:text-rose-400',
    border: 'border-rose-500/20',
  },
  apartments: {
    bg: 'bg-cyan-500/10 dark:bg-cyan-500/20',
    text: 'text-cyan-600 dark:text-cyan-400',
    border: 'border-cyan-500/20',
  },
};

interface AnimatedCounterProps {
  value: number;
  duration?: number;
}

const AnimatedCounter = ({ value, duration = 1000 }: AnimatedCounterProps) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(Math.floor(easeOutQuart * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return (
    <span className='tabular-nums'>
      {displayValue.toLocaleString()}
    </span>
  );
};

const StatCard = ({ stat }: { stat: DashboardStat }) => {
  const Icon = iconMap[stat.icon];
  const colors = colorMap[stat.icon];

  const content = (
    <Card
      className={cn(
        'group relative overflow-hidden transition-all duration-300',
        'hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5',
        stat.href && 'cursor-pointer'
      )}
    >
      {/* Subtle gradient background */}
      <div className={cn('absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity', colors.bg)} />

      <CardContent className='p-5 relative'>
        <div className='flex items-start justify-between gap-4'>
          {/* Icon */}
          <div className={cn('p-3 rounded-xl', colors.bg)}>
            <Icon className={cn('size-5', colors.text)} />
          </div>

          {/* Trend Badge */}
          {stat.trend && (
            <div
              className={cn(
                'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                stat.trend.isPositive
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
              )}
            >
              {stat.trend.isPositive ? (
                <TrendingUp className='size-3' />
              ) : (
                <TrendingDown className='size-3' />
              )}
              <span>{stat.trend.value}%</span>
            </div>
          )}
        </div>

        <div className='mt-4 space-y-1'>
          <p className='text-sm font-medium text-muted-foreground'>{stat.title}</p>
          <p className='text-3xl font-bold tracking-tight'>
            <AnimatedCounter value={stat.value} />
          </p>
          <p className='text-xs text-muted-foreground line-clamp-1'>{stat.description}</p>
        </div>

        {/* Link indicator */}
        {stat.href && (
          <div className='absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity'>
            <ArrowUpRight className='size-4 text-muted-foreground' />
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (stat.href) {
    return <Link to={stat.href}>{content}</Link>;
  }

  return content;
};

const StatCardSkeleton = () => (
  <Card>
    <CardContent className='p-5'>
      <div className='flex items-start justify-between gap-4'>
        <Skeleton className='size-11 rounded-xl' />
        <Skeleton className='h-6 w-16 rounded-full' />
      </div>
      <div className='mt-4 space-y-2'>
        <Skeleton className='h-4 w-20' />
        <Skeleton className='h-8 w-24' />
        <Skeleton className='h-3 w-32' />
      </div>
    </CardContent>
  </Card>
);

const DashboardStats = ({ stats, isLoading }: DashboardStatsProps) => {
  const { t } = useTranslation('home');

  if (isLoading) {
    return (
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4'>
        {Array.from({ length: 6 }).map((_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className='space-y-3'>
      <h2 className='text-lg font-semibold text-foreground'>
        {t('sections.overview', 'Overview')}
      </h2>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4'>
        {stats.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>
    </div>
  );
};

export default DashboardStats;
