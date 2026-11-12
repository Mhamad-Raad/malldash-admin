import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';

import type { AppDispatch, RootState } from '@/store/store';
import { fetchOrders } from '@/store/slices/ordersSlice';
import type { OrderStatus } from '@/interfaces/Order.interface';
import { ObjectAutoComplete } from '@/components/ObjectAutoComplete';
import { fetchVendors, fetchVendorById } from '@/data/Vendor';
import type { VendorAPIResponse } from '@/interfaces/Vendor.interface';

import OrderList from '@/components/Orders/OrderList';
import OrderDisplay from '@/components/Orders/OrderDisplay';
import EmptyState from '@/components/Orders/EmptyState';
import CustomTablePagination from '@/components/CustomTablePagination';

import { Search, Filter, ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import {
  SelectValue,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const orderStatuses: (OrderStatus | 'All')[] = [
  'All',
  'Pending',
  'Confirmed',
  'Preparing',
  'OutForDelivery',
  'Delivered',
  'Cancelled',
];

const Orders = () => {
  const { t } = useTranslation('orders');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const { orders, loading, error, total } = useSelector(
    (state: RootState) => state.orders
  );

  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(
    id ? parseInt(id, 10) : null
  );
  const [vendorName, setVendorName] = useState('');

  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const statusParam = searchParams.get('status');
  const status = (statusParam === 'All' ? 'All' : statusParam) as
    | OrderStatus
    | 'All'
    | null;
  const searchQuery = searchParams.get('search') || '';
  const vendorIdParam = searchParams.get('vendorId');
  const vendorId = vendorIdParam ? parseInt(vendorIdParam, 10) : undefined;

  const lastFetchParams = useRef<string>('');

  useEffect(() => {
    const params: {
      limit: number;
      page: number;
      status?: OrderStatus | 'All' | null;
      search?: string;
      vendorId?: number;
    } = {
      limit,
      page,
      status: status || 'All',
    };

    if (searchQuery) {
      params.search = searchQuery;
    }
    if (vendorId) {
      params.vendorId = vendorId;
    }

    // Prevent duplicate fetches for same params
    const paramsString = JSON.stringify(params);
    if (lastFetchParams.current === paramsString && !loading) {
      return;
    }
    // Only update ref if we are actually fetching
    lastFetchParams.current = paramsString;

    dispatch(fetchOrders(params));
  }, [dispatch, limit, page, status, searchQuery, vendorId]);

  // Fetch vendor name if vendorId is present
  useEffect(() => {
    const loadVendorName = async () => {
      if (vendorId) {
        try {
          const data = await fetchVendorById(vendorId.toString());
          if (data && data.name) {
            setVendorName(data.name);
          }
        } catch (error) {
          console.error('Failed to fetch vendor name', error);
        }
      } else {
        setVendorName('');
      }
    };
    loadVendorName();
  }, [vendorId]);

  const handleStatusChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'All') {
      params.set('status', value);
    } else {
      params.delete('status');
    }
    params.set('page', '1');
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
    params.set('page', '1');
    navigate(`${window.location.pathname}?${params.toString()}`, {
      replace: true,
    });
  };

  const handleVendorSelect = (vendor: VendorAPIResponse | undefined) => {
    const params = new URLSearchParams(searchParams);
    if (vendor) {
      params.set('vendorId', vendor.id.toString());
      setVendorName(vendor.name);
    } else {
      params.delete('vendorId');
      setVendorName('');
    }
    params.set('page', '1');
    navigate(`${window.location.pathname}?${params.toString()}`, {
      replace: true,
    });
  };

  const fetchVendorOptions = async (query: string) => {
    try {
      const response = await fetchVendors({ searchName: query, limit: 10 });
      // Assuming response has a 'data' property which is the array
      if (response && Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch vendors', error);
      return [];
    }
  };

  // Sync with URL parameter
  useEffect(() => {
    if (id) {
      setSelectedOrderId(parseInt(id, 10));
    } else {
      setSelectedOrderId(null);
    }
  }, [id]);

  const handleSelectOrder = (orderId: number) => {
    setSelectedOrderId(orderId);
    navigate(`/orders/${orderId}`);
  };

  const hasNoOrders = !loading && orders.length === 0 && !error;

  return (
    <section className='flex-1 flex flex-col min-h-0 -m-6'>
      {/* Main Content Area */}
      <div className='flex-1 flex overflow-hidden'>
        {selectedOrderId ? (
          /* Order Details View */
          <div className='flex flex-col h-full w-full bg-background'>
            <div className='flex items-center p-2 border-b'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => {
                  setSelectedOrderId(null);
                  navigate('/orders');
                }}
              >
                <ArrowLeft className='h-4 w-4 mr-2' />
                {t('backToOrders')}
              </Button>
            </div>
            <OrderDisplay orderId={selectedOrderId} />
          </div>
        ) : /* Order List View */
        hasNoOrders && !searchQuery && status === 'All' && !vendorId ? (
          <EmptyState />
        ) : (
          <div className='flex flex-col h-full w-full bg-muted/10'>
            <div className='bg-background border-b p-4 space-y-4'>
              <div className='flex items-center justify-between'>
                <h1 className='text-xl font-semibold tracking-tight'>
                  {t('title')}
                </h1>
                <div className='text-sm text-muted-foreground'>
                  {t('totalLabel')}{' '}
                  <span className='font-medium text-foreground'>{total}</span>
                </div>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3'>
                <div className='relative'>
                  <Search className='absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                  <Input
                    type='text'
                    placeholder={t('searchPlaceholder')}
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className='pl-9 h-9 text-sm'
                  />
                </div>

                <div className='relative'>
                  <ObjectAutoComplete<VendorAPIResponse>
                    placeholder={t('filterVendorPlaceholder')}
                    fetchOptions={fetchVendorOptions}
                    onSelectOption={handleVendorSelect as any}
                    getOptionLabel={(vendor) => vendor.name}
                    initialValue={vendorName}
                    className='h-9 text-sm'
                  />
                </div>

                <Select
                  value={status || 'All'}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className='h-9 text-sm w-full'>
                    <div className='flex items-center gap-2'>
                      <Filter className='h-4 w-4 text-muted-foreground' />
                      <SelectValue placeholder={t('filterStatusPlaceholder')} />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {orderStatuses.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s === 'All' ? t('allStatuses') : s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='flex-1 min-h-0 bg-background'>
              {loading ? (
                <div className='flex flex-col gap-2 p-4'>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className='flex flex-col gap-2 rounded-lg border p-3'
                    >
                      <Skeleton className='h-4 w-3/4' />
                      <Skeleton className='h-3 w-1/2' />
                      <Skeleton className='h-3 w-full' />
                    </div>
                  ))}
                </div>
              ) : (
                <OrderList
                  orders={orders}
                  selectedOrderId={selectedOrderId}
                  onSelectOrder={handleSelectOrder}
                />
              )}
            </div>
            <div className='border-t px-3 py-2 bg-background'>
              <CustomTablePagination
                total={total}
                suggestions={[10, 20, 30, 40, 50]}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Orders;
