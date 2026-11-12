import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface CategoryPerformanceProps {
  data: { category: string; value: number; color: string }[];
}

const CategoryPerformance = ({ data }: CategoryPerformanceProps) => {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();

  const [selectedPeriod, setSelectedPeriod] = useState('current');

  const chartData = data.map((item, index) => ({
    category: item.category,
    value: item.value,
    fill: `var(--chart-${index + 1})`,
  }));

  const chartConfig = data.reduce((config, item, index) => {
    config[item.category.toLowerCase().replace(/\s+/g, '')] = {
      label: item.category,
      color: `var(--chart-${index + 1})`,
    };
    return config;
  }, {} as ChartConfig);

  const totalRevenue = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card>
      <CardHeader>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex items-center gap-2'>
            <TrendingUp className='size-5 text-primary' />
            <CardTitle className='text-lg'>Top Categories</CardTitle>
          </div>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className='w-full sm:w-[180px]'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='current'>This Month</SelectItem>
              <SelectItem value='last'>Last Month</SelectItem>
              <SelectItem value='year'>This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <CardDescription>
          {selectedPeriod === 'current' && `${currentMonth} ${currentYear}`}
          {selectedPeriod === 'last' && 
            `${new Date(currentYear, currentDate.getMonth() - 1).toLocaleString('default', { month: 'long' })} ${currentYear}`}
          {selectedPeriod === 'year' && `${currentYear}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          {/* Bar Chart */}
          <div className='w-full overflow-x-auto'>
            <ChartContainer config={chartConfig} className='h-[200px] sm:h-[250px] w-full min-w-[300px]'>
              <BarChart data={chartData} margin={{ top: 20, right: 12, bottom: 0, left: 12 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey='category'
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 10)}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey='value' radius={8} />
            </BarChart>
          </ChartContainer>
          </div>

          {/* Category Stats */}
          <div className='space-y-3 pt-4 border-t'>
            {data.map((item, index) => {
              const revenuePercent = ((item.value / totalRevenue) * 100).toFixed(1);
              return (
                <div key={index} className='flex items-center justify-between gap-2'>
                  <div className='flex items-center gap-2 flex-1 min-w-0'>
                    <div className='w-3 h-3 rounded-full flex-shrink-0' style={{ backgroundColor: `var(--chart-${index + 1})` }} />
                    <p className='text-sm font-medium truncate'>{item.category}</p>
                  </div>
                  <div className='flex items-center gap-3 flex-shrink-0'>
                    <p className='text-base sm:text-lg font-bold'>${(item.value / 1000).toFixed(1)}k</p>
                    <p className='text-xs text-muted-foreground w-12 text-right'>{revenuePercent}%</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total Revenue */}
          <div className='pt-3 border-t flex items-center justify-between'>
            <span className='text-sm font-medium text-muted-foreground'>Total Revenue</span>
            <span className='text-lg font-bold'>${totalRevenue.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryPerformance;
