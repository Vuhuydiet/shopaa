import React, { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { RegisterProvider } from './RegisterContext';
import { UserProvider } from './UserContext';

interface GlobalProviderProps {
  children: ReactNode;
}

const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  return (
    <AuthProvider>
      <RegisterProvider>
        <UserProvider>{children}</UserProvider>
      </RegisterProvider>
    </AuthProvider>
  );
};

export default GlobalProvider;
