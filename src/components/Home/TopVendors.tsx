import { useTranslation } from 'react-i18next';
import { Trophy, Store, ShoppingBag, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { TopVendorsProps, TopVendor } from '@/interfaces/Home.interface';

const typeColors: Record<string, string> = {
  Market: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Restaurant: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Bakery: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  Cafe: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
};

const getRankBadge = (index: number) => {
  if (index === 0) return { icon: '🥇', bg: 'bg-amber-500/10 border-amber-500/30' };
  if (index === 1) return { icon: '🥈', bg: 'bg-slate-400/10 border-slate-400/30' };
  if (index === 2) return { icon: '🥉', bg: 'bg-orange-600/10 border-orange-600/30' };
  return null;
};

const VendorItem = ({ vendor, index }: { vendor: TopVendor; index: number }) => {
  const rankBadge = getRankBadge(index);
  const typeColor = typeColors[vendor.type] || 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';

  return (
    <div className='group flex items-center gap-3 p-3 rounded-lg transition-colors hover:bg-muted/50'>
      {/* Rank */}
      <div
        className={cn(
          'flex items-center justify-center size-8 rounded-lg border text-sm font-bold',
          rankBadge ? rankBadge.bg : 'bg-muted/50 border-border'
        )}
      >
        {rankBadge ? rankBadge.icon : index + 1}
      </div>

      {/* Avatar */}
      <Avatar className='size-10 border'>
        <AvatarImage src={vendor.logo} alt={vendor.name} />
        <AvatarFallback className='bg-muted text-xs font-medium'>
          {vendor.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
        </AvatarFallback>
      </Avatar>

      {/* Info */}
      <div className='flex-1 min-w-0'>
        <p className='text-sm font-medium truncate'>{vendor.name}</p>
        <div className='flex items-center gap-2 mt-0.5'>
          <Badge variant='secondary' className={cn('text-[10px] px-1.5 py-0 h-4 font-normal', typeColor)}>
            {vendor.type}
          </Badge>
        </div>
      </div>

      {/* Order Count */}
      <div className='flex items-center gap-1.5 text-muted-foreground'>
        <ShoppingBag className='size-4' />
        <span className='text-sm font-semibold tabular-nums'>{vendor.orderCount}</span>
      </div>

      {/* Link */}
      <Link to={`/vendors/${vendor.id}`} className='opacity-0 group-hover:opacity-100 transition-opacity'>
        <Button variant='ghost' size='icon' className='size-8'>
          <ExternalLink className='size-4' />
        </Button>
      </Link>
    </div>
  );
};

const VendorItemSkeleton = () => (
  <div className='flex items-center gap-3 p-3'>
    <Skeleton className='size-8 rounded-lg' />
    <Skeleton className='size-10 rounded-full' />
    <div className='flex-1 space-y-1.5'>
      <Skeleton className='h-4 w-32' />
      <Skeleton className='h-4 w-16' />
    </div>
    <Skeleton className='h-5 w-12' />
  </div>
);

const TopVendors = ({ vendors, isLoading }: TopVendorsProps) => {
  const { t } = useTranslation('home');

  return (
    <Card className='h-full'>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Trophy className='size-5 text-amber-500' />
            <CardTitle className='text-lg'>
              {t('vendors.topVendors', 'Top Vendors')}
            </CardTitle>
          </div>
          <Link to='/vendors'>
            <Button variant='ghost' size='sm' className='text-xs h-7'>
              {t('actions.viewAll', 'View All')}
              <ExternalLink className='size-3 ml-1' />
            </Button>
          </Link>
        </div>
        <CardDescription>
          {t('vendors.topDesc', 'Vendors with the most products')}
        </CardDescription>
      </CardHeader>
      <CardContent className='p-0'>
        <ScrollArea className='h-[350px] px-4 pb-4'>
          {isLoading ? (
            <div className='space-y-1'>
              {Array.from({ length: 5 }).map((_, i) => (
                <VendorItemSkeleton key={i} />
              ))}
            </div>
          ) : vendors.length > 0 ? (
            <div className='space-y-1'>
              {vendors.map((vendor, index) => (
                <VendorItem key={vendor.id} vendor={vendor} index={index} />
              ))}
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center h-[250px] text-muted-foreground'>
              <Store className='size-12 mb-3 opacity-30' />
              <p className='text-sm'>{t('vendors.noVendors', 'No vendors found')}</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TopVendors;
