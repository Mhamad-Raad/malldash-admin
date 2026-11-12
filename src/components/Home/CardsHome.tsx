import { TrendingDownIcon, TrendingUpIcon, ShoppingCart, Users, Store, FileText } from 'lucide-react';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { formatCompact } from '@/lib/formatNumbers';

import type { HomeCardsProps } from '@/interfaces/Home.interface';

const cardIcons = {
  Orders: ShoppingCart,
  Users: Users,
  Vendors: Store,
  Requests: FileText,
};

const cardIconColors = {
  Orders: 'bg-chart-1/10 text-chart-1 dark:bg-chart-1/20',
  Users: 'bg-chart-2/10 text-chart-2 dark:bg-chart-2/20',
  Vendors: 'bg-chart-3/10 text-chart-3 dark:bg-chart-3/20',
  Requests: 'bg-chart-4/10 text-chart-4 dark:bg-chart-4/20',
};

const HomeCards = ({ cards }: HomeCardsProps) => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full'>
      {cards.map((card, index) => {
        const Icon = cardIcons[card.title as keyof typeof cardIcons] || FileText;
        const iconColorClass = cardIconColors[card.title as keyof typeof cardIconColors] || cardIconColors.Requests;
        
        return (
          <Card key={index} className='@container/card flex flex-col transition-all hover:shadow-lg'>
            <CardHeader className='pb-3'>
              <div className='flex items-start justify-between gap-4'>
                <div className='flex flex-col gap-1 flex-1'>
                  <CardDescription className='text-sm font-medium'>
                    {card.title}
                  </CardDescription>
                  <CardTitle className='text-3xl font-bold tabular-nums'>
                    {formatCompact(card.value)}
                  </CardTitle>
                </div>
                <div className={`p-3 rounded-full ${iconColorClass}`}>
                  <Icon className='size-5' />
                </div>
              </div>
              <Badge 
                variant='outline' 
                className={`gap-1 w-fit mt-2 ${
                  card.badge.trendingUp === true 
                    ? 'border-primary/30 text-primary' 
                    : card.badge.trendingUp === false 
                    ? 'border-destructive/30 text-destructive' 
                    : 'border-muted-foreground/30 text-muted-foreground'
                }`}
              >
                {card.badge.text}
                {card.badge.trendingUp === true && <TrendingUpIcon className='size-3' />}
                {card.badge.trendingUp === false && <TrendingDownIcon className='size-3' />}
              </Badge>
            </CardHeader>
            <CardFooter className='pt-0 pb-4'>
              <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                {card.badge.trendingUp === true && (
                  <TrendingUpIcon className='size-3.5 text-primary' />
                )}
                {card.badge.trendingUp === false && (
                  <TrendingDownIcon className='size-3.5 text-destructive' />
                )}
                <span className='line-clamp-1'>{card.footer}</span>
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default HomeCards;
