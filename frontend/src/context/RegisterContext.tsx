import React, { createContext, useState, useContext, ReactNode } from 'react';

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface RegisterContextProps {
  registerData: RegisterData | null;
  setRegisterData: (data: RegisterData) => void;
}

const RegisterContext = createContext<RegisterContextProps | undefined>(
  undefined,
);

export const RegisterProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [registerData, setRegisterData] = useState<RegisterData | null>(null);

  return (
    <RegisterContext.Provider value={{ registerData, setRegisterData }}>
      {children}
    </RegisterContext.Provider>
  );
};

export const useRegisterContext = () => {
  const context = useContext(RegisterContext);

  if (context === undefined) {
    throw new Error(
      'useRegisterContext must be used within a RegisterProvider',
    );
  }

  return context;
};
