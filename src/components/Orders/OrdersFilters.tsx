import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ShoppingCart, SlidersHorizontal, Search } from 'lucide-react';
import type { OrderStatus } from '@/interfaces/Order.interface';

const OrdersFilters = () => {
  const { t } = useTranslation('orders');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const currentStatus = searchParams.get('status') || 'All';
  const searchQuery = searchParams.get('search') || '';

  const handleStatusChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'All') {
      params.set('status', value);
    } else {
      params.delete('status');
    }
    params.set('page', '1'); // Reset to first page
    navigate(`${window.location.pathname}?${params.toString()}`, {
      replace: true,
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams(searchParams);
    const value = e.target.value;
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    params.set('page', '1'); // Reset to first page
    navigate(`${window.location.pathname}?${params.toString()}`, {
      replace: true,
    });
  };

  const orderStatuses: (OrderStatus | 'All')[] = [
    'All',
    'Pending',
    'Confirmed',
    'Preparing',
    'OutForDelivery',
    'Delivered',
    'Cancelled',
  ];

  return (
    <div className='flex items-center justify-between gap-4'>
      {/* Header Section */}
      <div className='flex items-center gap-3'>
        <div className='relative'>
          <div className='absolute inset-0 bg-gradient-to-br from-primary to-primary/50 rounded-xl blur-lg opacity-40' />
          <div className='relative p-2.5 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg'>
            <ShoppingCart className='h-5 w-5' />
          </div>
        </div>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            {t('headerTitle')}
          </h1>
          <p className='text-sm text-muted-foreground'>
            {t('headerSubtitle')}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className='flex items-center gap-3'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            type='text'
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={handleSearchChange}
            className='pl-9 w-[250px]'
          />
        </div>
        <div className='flex items-center gap-2 text-muted-foreground'>
          <SlidersHorizontal className='h-4 w-4' />
          <span className='text-sm font-medium'>Filter</span>
        </div>
        <Select value={currentStatus} onValueChange={handleStatusChange}>
          <SelectTrigger className='w-[180px] h-9'>
            <SelectValue placeholder='Filter by Status' />
          </SelectTrigger>
          <SelectContent>
            {orderStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status === 'All' ? 'All Orders' : status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default OrdersFilters;
