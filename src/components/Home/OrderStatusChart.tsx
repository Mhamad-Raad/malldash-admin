import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Label, Pie, PieChart } from 'recharts';
import { Calendar } from 'lucide-react';

interface OrderStatusChartProps {
  data: { status: string; count: number; color: string }[];
}

const OrderStatusChart = ({ data }: OrderStatusChartProps) => {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();

  const [selectedPeriod, setSelectedPeriod] = useState('current');

  const total = data.reduce((sum, item) => sum + item.count, 0);

  const chartData = data.map((item, index) => ({
    status: item.status,
    count: item.count,
    fill: `var(--chart-${index + 1})`,
  }));

  const chartConfig = data.reduce((config, item, index) => {
    config[item.status.toLowerCase().replace(/\s+/g, '')] = {
      label: item.status,
      color: `var(--chart-${index + 1})`,
    };
    return config;
  }, {} as ChartConfig);

  return (
    <Card>
      <CardHeader>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex items-center gap-2'>
            <Calendar className='size-5 text-primary' />
            <CardTitle className='text-lg'>Order Status Distribution</CardTitle>
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
        <div className='space-y-8'>
          {/* Pie Chart */}
          <div className='flex items-center justify-center'>
            <ChartContainer config={chartConfig} className='mx-auto aspect-square w-full max-w-[300px]'>
              <PieChart width={300} height={300}>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={chartData}
                  dataKey='count'
                  nameKey='status'
                  innerRadius={70}
                  outerRadius={110}
                  strokeWidth={5}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                        return (
                          <text x={viewBox.cx} y={viewBox.cy} textAnchor='middle' dominantBaseline='middle'>
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className='fill-foreground text-3xl font-bold'
                            >
                              {total}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className='fill-muted-foreground'
                            >
                              Total Orders
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </div>

          {/* Stats */}
          <div className='space-y-3'>
            {data.map((item, index) => {
              const percentage = total > 0 ? ((item.count / total) * 100).toFixed(1) : '0.0';
              return (
                <div key={index} className='flex items-center justify-between gap-2'>
                  <div className='flex items-center gap-2 flex-1 min-w-0'>
                    <div className='w-3 h-3 rounded-full flex-shrink-0' style={{ backgroundColor: `var(--chart-${index + 1})` }} />
                    <p className='text-sm font-medium truncate'>{item.status}</p>
                  </div>
                  <div className='flex items-center gap-3 flex-shrink-0'>
                    <p className='text-base sm:text-lg font-bold'>{item.count}</p>
                    <p className='text-xs text-muted-foreground w-12 text-right'>{percentage}%</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderStatusChart;
