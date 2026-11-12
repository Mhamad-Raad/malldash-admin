import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import * as signalR from '@microsoft/signalr';
import { DEMO } from '@/demo/server';
import { toast } from 'sonner';

import {
  addNotification,
  setNotifications,
  setConnectionStatus,
} from '@/store/slices/notificationsSlice';
import { fetchNotifications } from '@/data/Notifications';

import type { Notification } from '@/interfaces/Notification.interface';

const API_URL = import.meta.env.VITE_API_URL;

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private notificationCallbacks: ((notification: Notification) => void)[] = [];
  private connectionStateCallbacks: ((state: signalR.HubConnectionState) => void)[] = [];

  public async startConnection(): Promise<void> {
    // Public demo: there is no live server to connect to.
    if (DEMO) return;
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      console.log('SignalR already connected');
      return;
    }

    // The hub URL - adjust this based on your backend configuration
    // Common patterns: /hubs/notifications, /notificationHub, /signalr/notifications
    const baseUrl = API_URL.replace('/MalDashApi', '');
    const hubUrl = `${baseUrl}/hubs/notifications`;
    console.log('SignalR connecting to:', hubUrl);

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        // Use cookies for authentication (HTTP-only cookies sent automatically)
        withCredentials: true,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Set up connection state handlers
    this.connection.onreconnecting((error) => {
      console.log('SignalR reconnecting...', error);
      this.notifyConnectionState(signalR.HubConnectionState.Reconnecting);
    });

    this.connection.onreconnected((connectionId) => {
      console.log('SignalR reconnected. Connection ID:', connectionId);
      this.notifyConnectionState(signalR.HubConnectionState.Connected);
    });

    this.connection.onclose((error) => {
      console.log('SignalR connection closed', error);
      this.notifyConnectionState(signalR.HubConnectionState.Disconnected);
    });

    // Listen for notifications from backend
    this.connection.on('ReceiveNotification', (notification: any) => {
      console.log('Received notification:', notification);
      
      const processedNotification: Notification = {
        id: notification.Id ?? notification.id,
        title: notification.Title ?? notification.title,
        message: notification.Message ?? notification.message,
        type: notification.Type ?? notification.type ?? 'info',
        isRead: false,
        createdAt: new Date(notification.CreatedAt ?? notification.createdAt),
        actionUrl: notification.ActionUrl ?? notification.actionUrl,
        metadata: notification.Metadata ?? notification.metadata,
      };
      
      this.notificationCallbacks.forEach((callback) => callback(processedNotification));
    });

    try {
      await this.connection.start();
      console.log('✅ SignalR Connected successfully');
      this.notifyConnectionState(signalR.HubConnectionState.Connected);
    } catch (error: any) {
      console.error('❌ SignalR Connection Error:', error?.message || error);
      this.notifyConnectionState(signalR.HubConnectionState.Disconnected);
      
      // Don't retry on 404 - the hub URL is wrong
      if (error?.message?.includes('404')) {
        console.error('Hub not found. Please check the SignalR hub URL configuration.');
        return;
      }
      
      // Retry for other errors
      setTimeout(() => this.startConnection(), 5000);
    }
  }

  public async stopConnection(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
      console.log('SignalR Disconnected');
    }
  }

  public getConnectionState(): signalR.HubConnectionState {
    return this.connection?.state ?? signalR.HubConnectionState.Disconnected;
  }

  public onNotification(callback: (notification: Notification) => void): () => void {
    this.notificationCallbacks.push(callback);
    return () => {
      this.notificationCallbacks = this.notificationCallbacks.filter((cb) => cb !== callback);
    };
  }

  public onConnectionStateChange(callback: (state: signalR.HubConnectionState) => void): () => void {
    this.connectionStateCallbacks.push(callback);
    return () => {
      this.connectionStateCallbacks = this.connectionStateCallbacks.filter((cb) => cb !== callback);
    };
  }

  private notifyConnectionState(state: signalR.HubConnectionState): void {
    this.connectionStateCallbacks.forEach((callback) => callback(state));
  }

  // Only method available in your backend hub
  public async markAsRead(notificationId: number): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      try {
        await this.connection.invoke('MarkAsRead', notificationId);
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
  }
}

export const signalRService = new SignalRService();

// React hook to use SignalR
export function useSignalR(isAuthorized: boolean = false) {
  const dispatch = useDispatch();
  const isInitialized = useRef(false);

  useEffect(() => {
    // Don't initialize until authorized
    if (!isAuthorized) {
      console.log('SignalR: Waiting for authorization...');
      return;
    }

    // Prevent double initialization in React Strict Mode
    if (isInitialized.current) return;
    isInitialized.current = true;

    // Fetch existing notifications from API
    const loadExistingNotifications = async () => {
      try {
        const notifications = await fetchNotifications(0, 50);
        dispatch(setNotifications(notifications));
        console.log('✅ Loaded', notifications.length, 'existing notifications');
      } catch (error) {
        console.error('Failed to load existing notifications:', error);
      }
    };
    
    loadExistingNotifications();

    // Start SignalR connection (uses cookies for auth)
    signalRService.startConnection();

    // Subscribe to notifications
    const unsubscribeNotification = signalRService.onNotification((notification: Notification) => {
      dispatch(addNotification(notification));
      
      // Show toast for new notifications
      const toastType = notification.type === 'error' ? 'error' 
        : notification.type === 'warning' ? 'warning'
        : notification.type === 'success' ? 'success'
        : 'info';
      
      toast[toastType](notification.title, {
        description: notification.message,
      });
    });

    // Subscribe to connection state changes
    const unsubscribeConnectionState = signalRService.onConnectionStateChange((state) => {
      const isConnected = state === signalR.HubConnectionState.Connected;
      dispatch(setConnectionStatus(isConnected));
      
      if (state === signalR.HubConnectionState.Reconnecting) {
        toast.warning('Connection lost', {
          description: 'Attempting to reconnect...',
        });
      }
    });

    // Cleanup on unmount
    return () => {
      unsubscribeNotification();
      unsubscribeConnectionState();
      signalRService.stopConnection();
      isInitialized.current = false;
    };
  }, [dispatch, isAuthorized]);

  return {
    getConnectionState: () => signalRService.getConnectionState(),
    markAsRead: (id: number) => signalRService.markAsRead(id),
  };
}