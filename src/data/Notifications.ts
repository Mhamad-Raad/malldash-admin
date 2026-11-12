import { axiosInstance } from '@/data/axiosInstance';
import type { Notification, NotificationType } from '@/interfaces/Notification.interface';

interface NotificationResponse {
  id: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

// Transform backend response to frontend Notification type
const transformNotification = (notification: NotificationResponse): Notification => ({
  id: notification.id,
  title: notification.title,
  message: notification.message,
  type: (notification.type?.toLowerCase() || 'info') as NotificationType,
  isRead: notification.isRead,
  createdAt: notification.createdAt,
  actionUrl: notification.actionUrl,
  metadata: notification.metadata,
});

// GET: Fetch user notifications
export const fetchNotifications = async (skip = 0, take = 20): Promise<Notification[]> => {
  try {
    const response = await axiosInstance.get<NotificationResponse[]>('/Notification', {
      params: { skip, take },
    });
    return response.data.map(transformNotification);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

// GET: Fetch unread count
export const fetchUnreadCount = async (): Promise<number> => {
  try {
    const response = await axiosInstance.get<{ count: number }>('/Notification/unread-count');
    return response.data.count;
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return 0;
  }
};

// PUT: Mark notification as read
export const markNotificationAsRead = async (id: number): Promise<void> => {
  try {
    await axiosInstance.put(`/Notification/${id}/read`);
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
};

// PUT: Mark all notifications as read
export const markAllNotificationsAsRead = async (): Promise<void> => {
  try {
    await axiosInstance.put('/Notification/mark-all-read');
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
  }
};

// DELETE: Delete a notification
export const deleteNotificationApi = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/Notification/${id}`);
  } catch (error) {
    console.error('Error deleting notification:', error);
  }
};
