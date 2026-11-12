import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Bell,
  Check,
  X,
  Trash2,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  Settings,
  BellOff,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import {
  markAsRead as markAsReadAction,
  markAllAsRead as markAllAsReadAction,
  deleteNotification as deleteNotificationAction,
  clearAllNotifications,
} from '@/store/slices/notificationsSlice';
import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotificationApi,
} from '@/data/Notifications';

import type { RootState } from '@/store/store';
import type { NotificationType } from '@/interfaces/Notification.interface';

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return CheckCircle2;
    case 'error':
      return AlertCircle;
    case 'warning':
      return AlertTriangle;
    case 'info':
      return Info;
    case 'system':
      return Settings;
    default:
      return Bell;
  }
};

const getNotificationStyles = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return {
        iconBg: 'bg-primary/15 text-primary ring-primary/20',
        accent: 'bg-gradient-to-r from-primary/20 to-transparent',
        dot: 'bg-primary',
      };
    case 'error':
      return {
        iconBg: 'bg-destructive/15 text-destructive ring-destructive/20',
        accent: 'bg-gradient-to-r from-destructive/20 to-transparent',
        dot: 'bg-destructive',
      };
    case 'warning':
      return {
        iconBg: 'bg-chart-4/15 text-chart-4 ring-chart-4/20',
        accent: 'bg-gradient-to-r from-chart-4/20 to-transparent',
        dot: 'bg-chart-4',
      };
    case 'info':
      return {
        iconBg: 'bg-chart-1/15 text-chart-1 ring-chart-1/20',
        accent: 'bg-gradient-to-r from-chart-1/20 to-transparent',
        dot: 'bg-chart-1',
      };
    case 'system':
      return {
        iconBg: 'bg-chart-2/15 text-chart-2 ring-chart-2/20',
        accent: 'bg-gradient-to-r from-chart-2/20 to-transparent',
        dot: 'bg-chart-2',
      };
    default:
      return {
        iconBg: 'bg-muted text-muted-foreground ring-border',
        accent: 'bg-gradient-to-r from-muted to-transparent',
        dot: 'bg-muted-foreground',
      };
  }
};

const formatTimestamp = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - dateObj.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return dateObj.toLocaleDateString();
};

type NotificationTab = 'all' | 'unread' | 'mentions' | 'system';

export default function NotificationPopover() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get notifications from Redux store
  const { notifications } = useSelector((state: RootState) => state.notifications);
  
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<NotificationTab>('all');

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const allCount = notifications.length;
  const mentionsCount = notifications.filter((n) => n.type === 'warning' || n.type === 'error').length;
  const systemCount = notifications.filter((n) => n.type === 'system').length;

  const getFilteredNotifications = () => {
    switch (activeTab) {
      case 'unread':
        return notifications.filter((n) => !n.isRead);
      case 'mentions':
        return notifications.filter((n) => n.type === 'warning' || n.type === 'error');
      case 'system':
        return notifications.filter((n) => n.type === 'system');
      default:
        return notifications;
    }
  };

  const filteredNotifications = getFilteredNotifications();

  const handleMarkAllRead = () => {
    dispatch(markAllAsReadAction());
    markAllNotificationsAsRead();
  };

  const handleMarkAsRead = (id: number) => {
    dispatch(markAsReadAction(id));
    markNotificationAsRead(id);
  };

  const handleDelete = (id: number) => {
    dispatch(deleteNotificationAction(id));
    deleteNotificationApi(id);
  };

  const handleClearAll = () => {
    dispatch(clearAllNotifications());
  };

  const handleNotificationClick = (notification: { id: number; isRead: boolean; actionUrl?: string }) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='relative hover:bg-accent/50 transition-all duration-200 rounded-lg group'
          aria-label='Notifications'
        >
          <Bell className='size-[1.1rem] transition-transform group-hover:scale-110 group-hover:rotate-12' />
          {unreadCount > 0 && (
            <span className='absolute -top-0.5 -right-0.5 flex items-center justify-center w-[18px] h-[18px] text-[10px] font-bold text-primary-foreground bg-primary rounded-full border-2 border-background shadow-lg leading-[18px]'>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='w-[380px] p-0 border shadow-lg'
        align='end'
        sideOffset={8}
      >
        {/* Header */}
        <div className='px-4 pt-3 pb-0 border-b'>
          <div className='flex items-center justify-between mb-3'>
            <h3 className='font-semibold text-sm'>{t('Notifications')}</h3>
            {notifications.length > 0 && unreadCount > 0 && (
              <Button
                variant='ghost'
                size='sm'
                onClick={handleMarkAllRead}
                className='h-7 px-2 text-xs hover:bg-accent'
              >
                <Check className='size-3 mr-1' />
                Mark all as read
              </Button>
            )}
          </div>

          {/* Tabs */}
          <div className='flex gap-1 -mb-px'>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                activeTab === 'all'
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              All
              {allCount > 0 && (
                <span className='ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-muted'>
                  {allCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                activeTab === 'unread'
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Unread
              {unreadCount > 0 && (
                <span className='ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground'>
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('mentions')}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                activeTab === 'mentions'
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Important
              {mentionsCount > 0 && (
                <span className='ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-muted'>
                  {mentionsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('system')}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                activeTab === 'system'
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              System
              {systemCount > 0 && (
                <span className='ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full bg-muted'>
                  {systemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-16 px-4'>
            <div className='p-4 rounded-full bg-muted/50 mb-4'>
              <BellOff className='size-8 text-muted-foreground/50' />
            </div>
            <p className='text-sm font-medium text-foreground mb-1'>
              {activeTab === 'unread' ? 'All caught up!' : 
               activeTab === 'mentions' ? 'No important alerts' :
               activeTab === 'system' ? 'No system updates' : 
               'No notifications yet'}
            </p>
            <p className='text-xs text-muted-foreground text-center'>
              {activeTab === 'unread' ? 'You have no unread notifications' : 
               activeTab === 'mentions' ? 'Important notifications will appear here' :
               activeTab === 'system' ? 'System notifications will appear here' : 
               'Notifications will appear here when you receive them'}
            </p>
          </div>
        ) : (
          <>
            <div className='h-[380px] overflow-y-auto'>
              <div className='p-2 space-y-1'>
                {filteredNotifications.map((notification) => {
                  const Icon = getNotificationIcon(notification.type);
                  const styles = getNotificationStyles(notification.type);
                  
                  return (
                    <div
                      key={notification.id}
                      className={cn(
                        'group relative overflow-hidden rounded-xl transition-all duration-200 cursor-pointer border',
                        !notification.isRead 
                          ? 'bg-card border-border/80 shadow-sm hover:shadow-md hover:border-primary/30' 
                          : 'bg-card/50 border-transparent hover:bg-card hover:border-border/50'
                      )}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      {/* Gradient accent bar for unread */}
                      {!notification.isRead && (
                        <div className={cn('absolute inset-y-0 left-0 w-1', styles.dot)} />
                      )}
                      
                      <div className={cn(
                        'flex gap-3 p-3',
                        !notification.isRead && 'pl-4'
                      )}>
                        {/* Icon with colored background */}
                        <div className={cn(
                          'flex-shrink-0 size-10 rounded-xl ring-1 flex items-center justify-center shadow-sm',
                          styles.iconBg
                        )}>
                          <Icon className='size-4' strokeWidth={2.5} />
                        </div>

                        {/* Content */}
                        <div className='flex-1 min-w-0 space-y-1'>
                          <div className='flex items-start justify-between gap-2'>
                            <div className='flex items-center gap-2 min-w-0'>
                              <p className={cn(
                                'text-[13px] leading-tight truncate',
                                !notification.isRead 
                                  ? 'font-semibold text-foreground' 
                                  : 'font-medium text-foreground/80'
                              )}>
                                {notification.title}
                              </p>
                              {!notification.isRead && (
                                <span className={cn(
                                  'flex-shrink-0 size-2 rounded-full shadow-sm',
                                  styles.dot
                                )} />
                              )}
                            </div>
                            <span className='text-[10px] text-muted-foreground whitespace-nowrap font-medium pt-0.5'>
                              {formatTimestamp(notification.createdAt)}
                            </span>
                          </div>
                          
                          <p className='text-xs text-muted-foreground leading-relaxed'>
                            {notification.message}
                          </p>
                        </div>

                        {/* Delete button - always visible */}
                        <Button
                          variant='ghost'
                          size='icon'
                          className='flex-shrink-0 h-7 w-7 hover:bg-destructive/10 hover:text-destructive text-muted-foreground'
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(notification.id);
                          }}
                        >
                          <X className='size-3.5' />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className='border-t p-2 bg-muted/30'>
              <Button
                variant='ghost'
                size='sm'
                onClick={handleClearAll}
                className='w-full justify-center text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive'
              >
                <Trash2 className='size-3.5 mr-1.5' />
                Clear all notifications
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
