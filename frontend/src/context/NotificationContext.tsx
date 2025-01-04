import { createContext, useEffect, useMemo, useState } from 'react';
import {
  SOCKET_URL,
  SOCKET_EVENTS,
  NOTIFICATION_API_ENDPOINTS,
} from '../config/API_config';
import { INotification } from '../interfaces/INotification';
import { io } from 'socket.io-client';
import { ReactNode } from 'react';
import axios from 'axios';
import { useQuery, useQueryClient } from 'react-query';
import { message } from 'antd';
import { useUser } from './UserContext';

interface NotificationContextType {
  notifications: INotification[];
  markAsRead: (notificationId: number) => void;
}

export const NotificationContext =
  createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const queryClient = useQueryClient();

  const { refetch } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await axios.get(
        NOTIFICATION_API_ENDPOINTS.NOTIFICATION,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      );

      setNotifications(
        response.data.metadata.notifications
          .map((notification: any) => ({
            ...notification,
            payload: JSON.parse(notification.payload),
          }))
          .sort(
            (a: INotification, b: INotification) =>
              new Date(b.payload.updatedAt).getTime() -
              new Date(a.payload.updatedAt).getTime(),
          ),
      );
    },
  });

  const socket = useMemo(() => {
    refetch();

    return io(SOCKET_URL, {
      auth: {
        token: localStorage.getItem('token'),
      },
      autoConnect: true,
      reconnection: true,
    });
  }, [localStorage.getItem('token')]);

  useEffect(() => {
    socket.on(SOCKET_EVENTS.CONNECT, () => {
      console.log('Connected to socket');
    });

    socket.on(SOCKET_EVENTS.NEW_NOTIFICATION, (notification: any) => {
      console.log(SOCKET_EVENTS.NEW_NOTIFICATION, notification);

      message.info('You have a new notification');

      setNotifications((prev) =>
        [
          ...prev,
          {
            ...notification,
            payload: JSON.parse(notification.payload),
          },
        ].sort(
          (a, b) =>
            new Date(b.payload.updatedAt).getTime() -
            new Date(a.payload.updatedAt).getTime(),
        ),
      );
    });

    return () => {
      socket.off(SOCKET_EVENTS.NEW_NOTIFICATION);

      console.log('Disconnecting from socket');
      socket.disconnect();
    };
  }, []);

  const markAsRead = (notificationId: number) => {
    console.log(SOCKET_EVENTS.READ_NOTIFICATION, notificationId);

    socket.emit(SOCKET_EVENTS.READ_NOTIFICATION, notificationId);
    setNotifications((prev: any) =>
      prev.map((notification: INotification) =>
        notification.notificationId === notificationId
          ? { ...notification, status: 'READ' }
          : notification,
      ),
    );
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        markAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
