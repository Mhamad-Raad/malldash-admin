import type { OrderStatus } from '@/interfaces/Order.interface';

export const getStatusText = (status: OrderStatus | number): OrderStatus => {
  if (typeof status === 'string') return status;

  switch (status) {
    case 1:
      return 'Pending';
    case 2:
      return 'Confirmed';
    case 3:
      return 'Preparing';
    case 4:
      return 'OutForDelivery';
    case 5:
      return 'Delivered';
    case 6:
      return 'Cancelled';
    default:
      return 'Pending';
  }
};
