import { formatDate } from '@/utils/dateUtils';
import { getStatusText } from '@/utils/orderUtils';
import type { Order, OrderStatus } from '@/interfaces/Order.interface';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Clock, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface OrderListProps {
  orders: Order[];
  selectedOrderId: number | null;
  onSelectOrder: (orderId: number) => void;
}

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

const OrderList = ({ orders, selectedOrderId, onSelectOrder }: OrderListProps) => {
  const { t } = useTranslation('orders');

  return (
    <div className="h-full overflow-y-auto">
      <div className="flex flex-col">
        {orders.map((order) => {
          const isSelected = order.id === selectedOrderId;
          return (
            <button
              key={order.id}
              onClick={() => onSelectOrder(order.id)}
              className={cn(
                'flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-accent/50 border-b last:border-b-0',
                isSelected && 'bg-muted'
              )}
            >
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Package className="h-4 w-4 text-primary" />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-sm truncate">
                    #{order.orderNumber}
                  </span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge
                      variant="secondary"
                      className={cn(
                        'border text-[10px] font-medium px-1.5 py-0 h-5',
                        getStatusColor(order.status)
                      )}
                    >
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-medium text-muted-foreground truncate">
                    {order.userName ||
                      order.customerName ||
                      t('table.guestCustomer')}
                  </span>
                  <span className="font-semibold text-foreground flex-shrink-0 ml-2">
                    ${order.totalAmount.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDate(order.createdAt, 'MMM dd, hh:mm a')}
                  </span>
                  {order.itemCount && order.itemCount > 0 && (
                    <span>
                      {order.itemCount === 1
                        ? t('table.itemsSingle', { count: order.itemCount })
                        : t('table.itemsPlural', { count: order.itemCount })}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default OrderList;
