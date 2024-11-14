import React, { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { RegisterProvider } from './RegisterContext';
import { UserProvider } from './UserContext';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { store } from '../service/state/store';

interface GlobalProviderProps {
  children: ReactNode;
}

const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const queryClient = new QueryClient();

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RegisterProvider>
            <UserProvider>{children}</UserProvider>
          </RegisterProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default GlobalProvider;