import { Building2, Home, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type ChartConfig, ChartContainer } from '@/components/ui/chart';
import { Label, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import type { OccupancyChartProps, BuildingOccupancy } from '@/interfaces/Home.interface';

// Legacy props interface for backward compatibility
interface LegacyOccupancyChartProps {
  totalApartments: number;
  occupied: number;
  totalBuildings: number;
}

// Check if props are legacy format
function isLegacyProps(props: OccupancyChartProps | LegacyOccupancyChartProps): props is LegacyOccupancyChartProps {
  return 'totalApartments' in props && typeof props.totalApartments === 'number';
}

const BuildingProgressBar = ({ building }: { building: BuildingOccupancy }) => {
  const [animatedRate, setAnimatedRate] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedRate(building.occupancyRate);
    }, 100);
    return () => clearTimeout(timer);
  }, [building.occupancyRate]);

  const getOccupancyColor = (rate: number) => {
    if (rate >= 90) return 'bg-emerald-500';
    if (rate >= 70) return 'bg-blue-500';
    if (rate >= 50) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between text-sm'>
        <div className='flex items-center gap-2 min-w-0'>
          <Building2 className='size-4 text-muted-foreground shrink-0' />
          <span className='font-medium truncate'>{building.name}</span>
        </div>
        <div className='flex items-center gap-3 shrink-0'>
          <span className='text-muted-foreground text-xs'>
            {building.occupied}/{building.totalApartments}
          </span>
          <span className='font-semibold tabular-nums w-12 text-right'>
            {building.occupancyRate.toFixed(0)}%
          </span>
        </div>
      </div>
      <div className='relative h-2 w-full overflow-hidden rounded-full bg-muted'>
        <div
          className={cn('h-full transition-all duration-700 ease-out rounded-full', getOccupancyColor(building.occupancyRate))}
          style={{ width: `${animatedRate}%` }}
        />
      </div>
    </div>
  );
};

export default function OccupancyChart(props: OccupancyChartProps | LegacyOccupancyChartProps) {
  const { t } = useTranslation('home');
  const [showAllBuildings, setShowAllBuildings] = useState(false);

  // Handle both legacy and new props format
  let totalApartments: number;
  let occupied: number;
  let totalBuildings: number;
  let buildings: BuildingOccupancy[] = [];
  let isLoading = false;

  if (isLegacyProps(props)) {
    totalApartments = props.totalApartments;
    occupied = props.occupied;
    totalBuildings = props.totalBuildings;
  } else {
    isLoading = props.isLoading || false;
    totalApartments = props.data?.totalApartments || 0;
    occupied = props.data?.totalOccupied || 0;
    totalBuildings = props.data?.totalBuildings || 0;
    buildings = props.data?.buildings || [];
  }

  const vacant = totalApartments - occupied;
  const occupancyRate = totalApartments > 0 ? (occupied / totalApartments) * 100 : 0;

  const [displayRate, setDisplayRate] = useState(0);

  useEffect(() => {
    setDisplayRate(0);
    const timer = setTimeout(() => {
      setDisplayRate(occupancyRate);
    }, 100);
    return () => clearTimeout(timer);
  }, [occupancyRate]);

  const chartData = [{ occupancy: 'rate', occupied: displayRate, fill: 'var(--color-occupied)' }];

  const chartConfig = {
    occupied: {
      label: t('occupancy.occupied'),
      color: 'var(--chart-2)',
    },
  } satisfies ChartConfig;

  const hasMoreBuildings = buildings.length > 3;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <Skeleton className='size-5' />
            <Skeleton className='h-5 w-32' />
          </div>
          <Skeleton className='h-4 w-48' />
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <Skeleton className='aspect-square w-full max-w-[300px] mx-auto rounded-full' />
            <div className='space-y-6'>
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className='h-16 w-full' />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center gap-2'>
          <Building2 className='size-5 text-primary' />
          <CardTitle className='text-lg'>{t('occupancy.title')}</CardTitle>
        </div>
        <CardDescription>
          {t('occupancy.description', 'Current occupancy status across all buildings')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Radial Chart */}
          <div className='flex items-center justify-center'>
            <ChartContainer config={chartConfig} className='mx-auto aspect-square w-full max-w-[280px]'>
              <RadialBarChart
                data={chartData}
                startAngle={0}
                endAngle={displayRate * 3.6}
                innerRadius={90}
                outerRadius={130}
              >
                <PolarGrid
                  gridType='circle'
                  radialLines={false}
                  stroke='none'
                  className='first:fill-muted last:fill-background'
                  polarRadius={[96, 84]}
                />
                <RadialBar dataKey='occupied' background cornerRadius={10} />
                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                        return (
                          <text x={viewBox.cx} y={viewBox.cy} textAnchor='middle' dominantBaseline='middle'>
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className='fill-foreground text-4xl font-bold'
                            >
                              {occupancyRate.toFixed(1)}%
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className='fill-muted-foreground text-sm'
                            >
                              {t('occupancy.occupied')}
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </PolarRadiusAxis>
              </RadialBarChart>
            </ChartContainer>
          </div>

          {/* Stats Panel */}
          <div className='flex flex-col justify-center space-y-5'>
            {/* Quick Stats */}
            <div className='grid grid-cols-2 gap-4'>
              <div className='p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20'>
                <div className='flex items-center gap-2 mb-1'>
                  <div className='w-2 h-2 rounded-full bg-emerald-500' />
                  <p className='text-xs text-muted-foreground'>{t('occupancy.occupied')}</p>
                </div>
                <p className='text-2xl font-bold text-emerald-600 dark:text-emerald-400'>{occupied}</p>
              </div>
              <div className='p-4 rounded-xl bg-muted/50 border'>
                <div className='flex items-center gap-2 mb-1'>
                  <div className='w-2 h-2 rounded-full bg-muted-foreground/40' />
                  <p className='text-xs text-muted-foreground'>{t('occupancy.vacant')}</p>
                </div>
                <p className='text-2xl font-bold'>{vacant}</p>
              </div>
            </div>

            {/* Summary */}
            <div className='grid grid-cols-2 gap-4'>
              <div className='p-4 rounded-xl bg-primary/5 border border-primary/10'>
                <div className='flex items-center gap-2 mb-1'>
                  <Home className='size-4 text-primary' />
                  <p className='text-xs text-muted-foreground'>{t('occupancy.totalApartments')}</p>
                </div>
                <p className='text-2xl font-bold text-primary'>{totalApartments}</p>
              </div>
              <div className='p-4 rounded-xl bg-blue-500/10 border border-blue-500/20'>
                <div className='flex items-center gap-2 mb-1'>
                  <Building2 className='size-4 text-blue-600 dark:text-blue-400' />
                  <p className='text-xs text-muted-foreground'>{t('occupancy.totalBuildings')}</p>
                </div>
                <p className='text-2xl font-bold text-blue-600 dark:text-blue-400'>{totalBuildings}</p>
              </div>
            </div>

            {/* Building Breakdown */}
            {buildings.length > 0 && (
              <Collapsible open={showAllBuildings} onOpenChange={setShowAllBuildings}>
                <div className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <p className='text-sm font-medium'>
                      {t('occupancy.byBuilding', 'By Building')}
                    </p>
                    {hasMoreBuildings && (
                      <CollapsibleTrigger asChild>
                        <Button variant='ghost' size='sm' className='h-7 px-2'>
                          {showAllBuildings ? (
                            <>
                              <ChevronUp className='size-4 mr-1' />
                              {t('actions.showLess', 'Show less')}
                            </>
                          ) : (
                            <>
                              <ChevronDown className='size-4 mr-1' />
                              {t('actions.showAll', 'Show all')} ({buildings.length})
                            </>
                          )}
                        </Button>
                      </CollapsibleTrigger>
                    )}
                  </div>

                  {/* Always visible buildings */}
                  <div className='space-y-3'>
                    {buildings.slice(0, 3).map((building) => (
                      <BuildingProgressBar key={building.id} building={building} />
                    ))}
                  </div>

                  {/* Collapsible additional buildings */}
                  <CollapsibleContent>
                    <div className='space-y-3 pt-3'>
                      {buildings.slice(3).map((building) => (
                        <BuildingProgressBar key={building.id} building={building} />
                      ))}
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
