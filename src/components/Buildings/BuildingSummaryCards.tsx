import { useSelector } from 'react-redux';
import { Layers, Home } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Card, CardContent } from '@/components/ui/card';
import { type ChartConfig, ChartContainer } from '@/components/ui/chart';
import { Label, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';
import type { RootState } from '@/store/store';

function getBuildingSummary(building: any) {
  const totalFloors = building?.floors?.length || 0;
  const totalApartments = building?.floors?.reduce(
    (sum: number, floor: any) => sum + (floor?.apartments?.length || 0),
    0
  );

  const occupiedApartments = building?.floors?.reduce(
    (sum: number, floor: any) =>
      sum +
      (floor?.apartments?.reduce((aptSum: number, apartment: any) => {
        const hasOccupant = 
          (Array.isArray(apartment.occupants) && apartment.occupants.length > 0) ||
          (apartment.occupant && typeof apartment.occupant === 'object');
        return aptSum + (hasOccupant ? 1 : 0);
      }, 0) || 0),
    0
  );

  return { totalFloors, totalApartments, occupiedApartments };
}

const BuildingSummaryCards = () => {
  const { building } = useSelector((state: RootState) => state.building);
  const { t } = useTranslation('buildings');
  const { totalFloors, totalApartments, occupiedApartments } =
    getBuildingSummary(building);

  const vacantApartments = (totalApartments || 0) - (occupiedApartments || 0);
  const occupancyRate = totalApartments > 0 ? (occupiedApartments / totalApartments) * 100 : 0;
  const occupiedPercentage = totalApartments > 0 ? ((occupiedApartments / totalApartments) * 100).toFixed(1) : '0.0';
  const vacantPercentage = totalApartments > 0 ? ((vacantApartments / totalApartments) * 100).toFixed(1) : '0.0';
  
  const [displayRate, setDisplayRate] = useState(0);

  useEffect(() => {
    // Reset to 0 when building changes
    setDisplayRate(0);
    // Small delay then animate to actual value
    const timer = setTimeout(() => {
      setDisplayRate(occupancyRate);
    }, 100);
    return () => clearTimeout(timer);
  }, [occupancyRate, building?.id]);
  
  const chartData = [{ occupancy: 'rate', occupied: displayRate, fill: 'var(--color-occupied)' }];

  const chartConfig = {
    occupied: {
      label: t('detail.summary.occupied'),
      color: 'var(--chart-2)',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardContent className='pt-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {/* Radial Chart */}
          <div className='flex items-center justify-center'>
            <ChartContainer config={chartConfig} className='mx-auto aspect-square w-full max-w-[300px]'>
              <RadialBarChart
                data={chartData}
                startAngle={0}
                endAngle={displayRate * 3.6}
                innerRadius={100}
                outerRadius={140}
              >
                <PolarGrid
                  gridType='circle'
                  radialLines={false}
                  stroke='none'
                  className='first:fill-muted last:fill-background'
                  polarRadius={[106, 94]}
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
                              className='fill-muted-foreground'
                            >
                              {t('detail.summary.occupied')}
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

          {/* Stats */}
          <div className='flex flex-col justify-center space-y-6'>
            {/* Occupied */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='w-4 h-4 rounded-full bg-chart-2' />
                <div>
                  <p className='text-sm text-muted-foreground'>{t('detail.summary.occupied')}</p>
                  <p className='text-2xl font-bold'>{occupiedApartments || 0}</p>
                </div>
              </div>
              <div className='text-right'>
                <p className='text-sm text-muted-foreground'>
                  {occupiedPercentage}%
                </p>
              </div>
            </div>

            {/* Vacant */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='w-4 h-4 rounded-full bg-muted border-2 border-muted-foreground/20' />
                <div>
                  <p className='text-sm text-muted-foreground'>{t('detail.summary.vacant')}</p>
                  <p className='text-2xl font-bold'>{vacantApartments || 0}</p>
                </div>
              </div>
              <div className='text-right'>
                <p className='text-sm text-muted-foreground'>
                  {vacantPercentage}%
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className='border-t' />

            {/* Total Apartments and Floors in one row */}
            <div className='grid grid-cols-2 gap-4'>
              {/* Total Apartments */}
              <div className='flex items-center gap-2'>
                <Home className='size-5 text-primary' />
                <div>
                  <p className='text-sm text-muted-foreground'>{t('detail.summary.totalApartments')}</p>
                  <p className='text-xl font-semibold text-primary'>{totalApartments || 0}</p>
                </div>
              </div>

              {/* Floors */}
              <div className='flex items-center gap-2'>
                <Layers className='size-5 text-muted-foreground' />
                <div>
                  <p className='text-sm text-muted-foreground'>{t('detail.summary.floors')}</p>
                  <p className='text-xl font-semibold'>{totalFloors || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BuildingSummaryCards;
