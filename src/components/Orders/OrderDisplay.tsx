import { useState, useEffect } from 'react';
import {
  Clock,
  MapPin,
  Package,
  Phone,
  Mail,
  CheckCircle,
  Building2,
  Layers,
  Home,
  User,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import { fetchOrderById } from '@/data/Orders';
import type { Order, OrderStatus } from '@/interfaces/Order.interface';
import { getStatusText } from '@/utils/orderUtils';
import { formatDate } from '@/utils/dateUtils';
import { cn } from '@/lib/utils';
import { OrderDisplaySkeleton } from './OrderDisplaySkeleton';
import { useTranslation } from 'react-i18next';

interface OrderDisplayProps {
  orderId: number;
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

const OrderDisplay = ({ orderId }: OrderDisplayProps) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation('orders');

  useEffect(() => {
    const loadOrder = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchOrderById(orderId);
        if ('error' in result) {
          setError(result.error);
        } else {
          setOrder(result);
        }
      } catch (err) {
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  if (loading) {
    return <OrderDisplaySkeleton />;
  }

  if (error || !order) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">{error || 'Order not found'}</p>
        </div>
      </div>
    );
  }

  const currentStatusText = getStatusText(order.status);

  return (
    <div className="h-full overflow-y-auto">
      <div className="flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b bg-muted/30">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Order #{order.orderNumber}</h2>
            <p className="text-xs text-muted-foreground mt-1.5">
              {formatDate(order.createdAt, 'MMMM dd, yyyy · hh:mm a')}
            </p>
          </div>
          <Badge
            variant="secondary"
            className={cn(
              'border px-2.5 py-1 text-xs font-medium',
              getStatusColor(order.status)
            )}
          >
            {currentStatusText}
          </Badge>
        </div>

        {/* Customer & Delivery Information */}
        <div className="px-6 py-5 border-b">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 divide-y md:divide-y-0 md:divide-x">
            {/* Customer Information */}
            <div className="pb-6 md:pb-0 md:pr-6">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Customer</p>
              <div className="flex gap-4">
                <Avatar className="h-16 w-16 flex-shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xl">
                    {(order.userName || order.customerName || 'G')[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2.5 flex-1 min-w-0">
                  <div className="flex items-start gap-3">
                    <User className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">Name</p>
                      <p className="font-medium text-base">
                        {order.userName || order.customerName || 'Guest Customer'}
                      </p>
                    </div>
                  </div>
                  {order.userEmail && (
                    <div className="flex items-start gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">
                          {t('detail.email')}
                        </p>
                        <p className="font-medium text-base truncate">{order.userEmail}</p>
                      </div>
                    </div>
                  )}
                  {order.userPhone && (
                    <div className="flex items-start gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground">
                          {t('detail.phone')}
                        </p>
                        <p className="font-medium text-base">{order.userPhone}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            {order.deliveryAddress && (
              <div className="pt-6 md:pt-0 md:pl-6">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5" />
                  {t('detail.deliveryAddressSection')}
                </p>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-3">
                    <Building2 className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {t('detail.building')}
                      </p>
                      <p className="font-medium text-base">
                        {order.deliveryAddress.buildingName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Layers className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {t('detail.floor')}
                      </p>
                      <p className="font-medium text-base">
                        {t('detail.floorWithNumber', {
                          number: order.deliveryAddress.floorNumber,
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Home className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {t('detail.apartment')}
                      </p>
                      <p className="font-medium text-base">
                        {order.deliveryAddress.apartmentName}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Items */}
        {order.items && order.items.length > 0 && (
          <div className="px-6 py-5 border-b">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
              {t('detail.itemsSection', { count: order.items.length })}
            </p>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4"
                >
                  {item.productImageUrl ? (
                    <img
                      src={item.productImageUrl}
                      alt={item.productName}
                      className="h-16 w-16 rounded-lg object-cover flex-shrink-0 border"
                    />
                  ) : (
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-muted border">
                      <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm mb-1 truncate">{item.productName}</p>
                    <p className="text-xs text-muted-foreground">
                      {t('detail.qtyPrice', {
                        quantity: item.quantity,
                        price: item.unitPrice.toFixed(2),
                      })}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-base">${item.totalPrice.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className="px-6 py-5 border-b bg-muted/10">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
            {t('detail.summarySection')}
          </p>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {t('detail.subtotal')}
              </span>
              <span className="font-medium text-sm">${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {t('detail.deliveryFee')}
              </span>
              <span className="font-medium text-sm">${order.deliveryFee.toFixed(2)}</span>
            </div>
            <Separator className="my-3" />
            <div className="flex justify-between items-center pt-1">
              <span className="font-semibold text-base">
                {t('detail.totalAmount')}
              </span>
              <span className="text-xl font-bold">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {order.notes && (
          <div className="px-6 py-5 border-b">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              {t('detail.notesSection')}
            </p>
            <p className="text-sm leading-relaxed">{order.notes}</p>
          </div>
        )}

        {/* Timeline */}
        <div className="px-6 py-5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
            {t('detail.activitySection')}
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div className="pt-1.5">
                <p className="font-medium text-sm">
                  {t('detail.orderCreated')}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatDate(order.createdAt, 'MMMM dd, yyyy · hh:mm a')}
                </p>
              </div>
            </div>
            {order.completedAt && (
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-green-500/10">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div className="pt-1.5">
                  <p className="font-medium text-sm">
                    {t('detail.orderCompleted')}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatDate(order.completedAt, 'MMMM dd, yyyy · hh:mm a')}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDisplay;
