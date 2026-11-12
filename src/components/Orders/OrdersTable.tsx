import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Calendar, DollarSign, ChevronRight, Clock } from 'lucide-react';

import CustomTablePagination from '@/components/CustomTablePagination';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import type { OrderStatus } from '@/interfaces/Order.interface';
import { getStatusText } from '@/utils/orderUtils';
import { formatDate } from '@/utils/dateUtils';

const getStatusColor = (status: OrderStatus | number) => {
  const statusText = getStatusText(status);
  switch (statusText) {
    case 'Pending':
      return 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-500/30';
    case 'Confirmed':
      return 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30';
    case 'Preparing':
      return 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border-indigo-500/30';
    case 'OutForDelivery':
      return 'bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30';
    case 'Delivered':
      return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30';
    case 'Cancelled':
      return 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30';
    default:
      return 'bg-gray-500/15 text-gray-700 dark:text-gray-400 border-gray-500/30';
  }
};

const OrdersTable = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('orders');
  const { orders, loading, total } = useSelector(
    (state: RootState) => state.orders
  );

  const handleRowClick = (id: number) => {
    navigate(`/orders/${id}`);
  };

  if (loading) {
    return (
      <div className='w-full h-full flex flex-col gap-4'>
        <div className='border rounded-xl bg-card/50 backdrop-blur-sm shadow-sm overflow-hidden flex-1'>
          <div className='p-4 space-y-4'>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className='flex items-center gap-4'>
                <Skeleton className='h-12 w-12 rounded-full' />
                <div className='space-y-2 flex-1'>
                  <Skeleton className='h-4 w-[250px]' />
                  <Skeleton className='h-4 w-[200px]' />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full h-full flex flex-col gap-4'>
      <ScrollArea className='flex-1 border rounded-xl bg-card/50 backdrop-blur-sm shadow-sm'>
        <Table>
          <TableHeader className='bg-muted/50'>
            <TableRow className='hover:bg-transparent border-b border-border/50'>
              <TableHead className='w-[140px] pl-6 h-12 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                {t('table.orderNumber')}
              </TableHead>
              <TableHead className='h-12 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                {t('table.customer')}
              </TableHead>
              <TableHead className='h-12 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                {t('table.status')}
              </TableHead>
              <TableHead className='h-12 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                {t('table.dateTime')}
              </TableHead>
              <TableHead className='h-12 text-xs font-semibold uppercase tracking-wider text-muted-foreground'>
                {t('table.total')}
              </TableHead>
              <TableHead className='w-[60px] h-12' />
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0
              ? // Empty state handled by parent, but safeguard here
                null
              : orders.map((order) => (
                  <TableRow
                    key={order.id}
                    className='group cursor-pointer hover:bg-muted/50 transition-colors border-b border-border/40 last:border-0'
                    onClick={() => handleRowClick(order.id)}
                  >
                    <TableCell className='font-medium py-4 pl-6'>
                      <span className='font-mono text-sm bg-muted/50 px-2 py-1 rounded'>
                        #{order.orderNumber}
                      </span>
                    </TableCell>

                    <TableCell className='py-4'>
                      <div className='flex items-center gap-2'>
                        <div className='p-1.5 bg-primary/10 rounded-full text-primary'>
                          <User className='size-3.5' />
                        </div>
                        <span className='font-medium text-sm'>
                          {order.userName ||
                            order.customerName ||
                            t('table.guestCustomer')}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className='py-4'>
                      <Badge
                        variant='secondary'
                        className={`border font-medium px-2.5 py-0.5 ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusText(order.status)}
                      </Badge>
                    </TableCell>

                    <TableCell className='py-4'>
                      <div className='flex flex-col gap-1'>
                        <div className='flex items-center gap-2 text-muted-foreground'>
                          <Calendar className='size-3.5' />
                          <span className='text-sm'>
                            {formatDate(order.createdAt, 'MMM dd, yyyy')}
                          </span>
                        </div>
                        <div className='flex items-center gap-2 text-muted-foreground/80'>
                          <Clock className='size-3.5' />
                          <span className='text-xs'>
                            {formatDate(order.createdAt, 'hh:mm a')}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className='py-4'>
                      <div className='flex items-center gap-1 font-semibold'>
                        <DollarSign className='size-3.5 text-muted-foreground' />
                        {order.totalAmount.toFixed(2)}
                      </div>
                    </TableCell>

                    <TableCell className='py-4 pr-6 text-right'>
                      <div className='p-2 rounded-full hover:bg-background hover:shadow-sm transition-all inline-flex'>
                        <ChevronRight className='size-4 text-muted-foreground group-hover:text-primary' />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </ScrollArea>
      <CustomTablePagination total={total} suggestions={[10, 20, 30, 40, 50]} />
    </div>
  );
};

export default OrdersTable;
