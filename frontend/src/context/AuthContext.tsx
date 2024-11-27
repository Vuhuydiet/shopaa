import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { getAccount } from '../service/authService';

interface AuthContextProps {
  isAuthenticated: boolean;
  userID: string | null;
  username: string | null;
  email: string | null;
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
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        setIsAuthenticated(true);
        setUserID(localStorage.getItem('userId'));
        loadAccount();
      }
      setLoading(false);
    };
    checkAuthentication();
  }, []);

  const loadAccount = async () => {
    const token = localStorage.getItem('token') || '';
    const accountData = await getAccount(token);
    if ('metadata' in accountData && accountData.metadata.user) {
      console.log('User data:', accountData.metadata.user);
      setUsername(accountData.metadata.user.username);
      setEmail(accountData.metadata.user.email);
    }
  };

  const setStateAuthenticated = async () => {
    setIsAuthenticated(true);
    setUserID(localStorage.getItem('userId'));
    loadAccount();
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
        email,
        username,
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
