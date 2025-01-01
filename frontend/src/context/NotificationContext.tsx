import { createContext, useEffect, useRef, useState } from 'react';
import {
  SOCKET_URL,
  SOCKET_EVENTS,
  NOTIFICATION_API_ENDPOINTS,
} from '../config/API_config';
import { INotification } from '../interfaces/INotification';
import { io } from 'socket.io-client';
import { ReactNode } from 'react';
import axios from 'axios';

interface NotificationContextType {
  notifications: INotification[];
  markAsRead: (notificationId: number) => void;
}

const socket = io(SOCKET_URL, {
  auth: {
    token: localStorage.getItem('token'),
  },
  autoConnect: true,
  reconnection: true,
});

export const NotificationContext =
  createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<INotification[]>([]);

  useEffect(() => {
    socket.on(SOCKET_EVENTS.CONNECT, () => {
      console.log('Connected to socket');
      axios
        .get(NOTIFICATION_API_ENDPOINTS.NOTIFICATION, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then((response) => {
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
        });
    });

    socket.on(SOCKET_EVENTS.NEW_NOTIFICATION, (notification: any) => {
      console.log(SOCKET_EVENTS.NEW_NOTIFICATION, notification);

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

    socket.on(SOCKET_EVENTS.FLUSH_NOTIFICATION, (notification: any) => {
      console.log(SOCKET_EVENTS.FLUSH_NOTIFICATION, notification);

      setNotifications((prev) =>
        [
          {
            ...notification,
            payload: JSON.parse(notification.payload),
          },
          ...prev,
        ].sort(
          (a, b) =>
            new Date(b.payload.updatedAt).getTime() -
            new Date(a.payload.updatedAt).getTime(),
        ),
      );
    });

    return () => {
      socket.off(SOCKET_EVENTS.NEW_NOTIFICATION);
      socket.off(SOCKET_EVENTS.FLUSH_NOTIFICATION);

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
