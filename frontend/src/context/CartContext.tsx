import { createContext, ReactNode } from 'react';

interface CartContextType {}

export const CartContext = createContext<CartContextType | undefined>(
  undefined,
);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return <CartContext.Provider value={{}}>{children}</CartContext.Provider>;
};
