import React, { createContext, useContext, ReactNode } from 'react';
import { notification } from 'antd';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationContextType {
  openNotification: (
    type: NotificationType,
    message: string,
    description?: string,
    placement?: 'topRight' | 'bottomRight' | 'topLeft' | 'bottomLeft',
  ) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const openNotification = (
    type: NotificationType,
    message: string,
    description?: string,
    placement:
      | 'topRight'
      | 'bottomRight'
      | 'topLeft'
      | 'bottomLeft' = 'topRight',
  ) => {
    notification[type]({
      message,
      description,
      placement,
    });
  };

  return (
    <NotificationContext.Provider value={{ openNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotification must be used within a NotificationProvider',
    );
  }
  return context;
};
