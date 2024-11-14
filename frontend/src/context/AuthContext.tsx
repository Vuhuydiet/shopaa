import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

interface AuthContextProps {
  isAuthenticated: boolean;
  userID: string | null;
  setStateAuthenticated: () => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userID, setUserID] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        setIsAuthenticated(true);
        setUserID(localStorage.getItem('userId'));
      }
      setLoading(false);
    };
    checkAuthentication();
  }, []);

  const setStateAuthenticated = () => {
    setIsAuthenticated(true);
    setUserID(localStorage.getItem('userId'));
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
    setUserID(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userID,
        setStateAuthenticated,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
