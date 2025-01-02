import React, { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { RegisterProvider } from './RegisterContext';
import { UserProvider } from './UserContext';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { store } from '../service/state/store';
import { persistQueryClient } from 'react-query/persistQueryClient-experimental';
import { createWebStoragePersistor } from 'react-query/createWebStoragePersistor-experimental';
import { NotificationProvider } from './NotificationContext';

interface GlobalProviderProps {
  children: ReactNode;
}

const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const queryClient = new QueryClient();

  const localStoragePersistor = createWebStoragePersistor({
    storage: window.localStorage,
  });
  persistQueryClient({ queryClient, persistor: localStoragePersistor });

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RegisterProvider>
            <UserProvider>
              <NotificationProvider>{children} </NotificationProvider>
            </UserProvider>
          </RegisterProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default GlobalProvider;
