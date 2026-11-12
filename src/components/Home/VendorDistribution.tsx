import { useTranslation } from 'react-i18next';
import { Store, ShoppingBag, UtensilsCrossed, Cake, Coffee, Package } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Cell, Pie, PieChart } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { VendorDistributionProps, VendorTypeDistribution } from '@/interfaces/Home.interface';

const typeIcons: Record<string, React.ElementType> = {
  Market: ShoppingBag,
  Restaurant: UtensilsCrossed,
  Bakery: Cake,
  Cafe: Coffee,
  default: Package,
};

const typeColors: Record<string, { bg: string; text: string; chart: string }> = {
  Market: {
    bg: 'bg-blue-500/10 dark:bg-blue-500/20',
    text: 'text-blue-600 dark:text-blue-400',
    chart: 'var(--chart-1)',
  },
  Restaurant: {
    bg: 'bg-amber-500/10 dark:bg-amber-500/20',
    text: 'text-amber-600 dark:text-amber-400',
    chart: 'var(--chart-2)',
  },
  Bakery: {
    bg: 'bg-rose-500/10 dark:bg-rose-500/20',
    text: 'text-rose-600 dark:text-rose-400',
    chart: 'var(--chart-3)',
  },
  Cafe: {
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    text: 'text-emerald-600 dark:text-emerald-400',
    chart: 'var(--chart-4)',
  },
  Other: {
    bg: 'bg-purple-500/10 dark:bg-purple-500/20',
    text: 'text-purple-600 dark:text-purple-400',
    chart: 'var(--chart-5)',
  },
};

const getTypeColor = (type: string) => {
  return typeColors[type] || typeColors.Other;
};

const getTypeIcon = (type: string) => {
  return typeIcons[type] || typeIcons.default;
};

const VendorTypeCard = ({ item }: { item: VendorTypeDistribution }) => {
  const Icon = getTypeIcon(item.type);
  const colors = getTypeColor(item.type);

  return (
    <div className='flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors'>
      <div className='flex items-center gap-3'>
        <div className={cn('p-2 rounded-lg', colors.bg)}>
          <Icon className={cn('size-4', colors.text)} />
        </div>
        <div>
          <p className='text-sm font-medium'>{item.type}</p>
          <p className='text-xs text-muted-foreground'>
            {item.count} {item.count === 1 ? 'vendor' : 'vendors'}
          </p>
        </div>
      </div>
      <div className='text-right'>
        <p className='text-lg font-bold tabular-nums'>{item.percentage.toFixed(1)}%</p>
      </div>
    </div>
  );
};

const VendorDistribution = ({ data, totalVendors, isLoading }: VendorDistributionProps) => {
  const { t } = useTranslation('home');

  const chartData = data.map((item) => ({
    name: item.type,
    value: item.count,
    fill: getTypeColor(item.type).chart,
  }));

  const chartConfig = data.reduce((config, item) => {
    config[item.type.toLowerCase()] = {
      label: item.type,
      color: getTypeColor(item.type).chart,
    };
    return config;
  }, {} as ChartConfig);

  if (isLoading) {
    return (
      <Card className='h-full'>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <Skeleton className='size-5' />
            <Skeleton className='h-5 w-40' />
          </div>
          <Skeleton className='h-4 w-56' />
        </CardHeader>
        <CardContent>
          <div className='flex flex-col lg:flex-row gap-6'>
            <Skeleton className='aspect-square w-48 rounded-full mx-auto' />
            <div className='flex-1 space-y-3'>
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className='h-16 w-full' />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className='h-full'>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <Store className='size-5 text-primary' />
            <CardTitle className='text-lg'>
              {t('vendors.distribution', 'Vendor Distribution')}
            </CardTitle>
          </div>
          <CardDescription>
            {t('vendors.distributionDesc', 'Breakdown by vendor type')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col items-center justify-center h-[200px] text-muted-foreground'>
            <Store className='size-12 mb-3 opacity-30' />
            <p className='text-sm'>{t('vendors.noData', 'No vendor data available')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='h-full'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Store className='size-5 text-primary' />
            <CardTitle className='text-lg'>
              {t('vendors.distribution', 'Vendor Distribution')}
            </CardTitle>
          </div>
          <div className='text-right'>
            <p className='text-2xl font-bold'>{totalVendors}</p>
            <p className='text-xs text-muted-foreground'>
              {t('vendors.total', 'Total Vendors')}
            </p>
          </div>
        </div>
        <CardDescription>
          {t('vendors.distributionDesc', 'Breakdown by vendor type')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex flex-col lg:flex-row gap-6'>
          {/* Pie Chart */}
          <div className='flex items-center justify-center lg:w-1/2'>
            <ChartContainer config={chartConfig} className='mx-auto aspect-square w-full max-w-[200px]'>
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={chartData}
                  dataKey='value'
                  nameKey='name'
                  cx='50%'
                  cy='50%'
                  innerRadius={50}
                  outerRadius={80}
                  strokeWidth={4}
                  stroke='hsl(var(--background))'
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </div>

          {/* Type List */}
          <div className='flex-1 space-y-2'>
            {data.map((item) => (
              <VendorTypeCard key={item.type} item={item} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VendorDistribution;
