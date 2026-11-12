export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'system';

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: Date | string;
  isRead: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
}
