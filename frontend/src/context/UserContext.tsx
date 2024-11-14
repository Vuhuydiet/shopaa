import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { getUserProfile } from '../service/userService';

interface UserProfile {
  fullname: string | null;
  dateOfBirth: string | null;
  phoneNumber: string | null;
  gender: string | null;
  avatar: string | null;
  role: string | null;
}

interface UserContextType {
  user: UserProfile | null;
  setUser: (user: UserProfile) => void;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const userID = localStorage.getItem('userId');
      if (token && userID) {
        const profile = await getUserProfile(parseInt(userID, 10), token);
        setUser({
          fullname: profile.metadata.profile?.fullname || null,
          dateOfBirth: profile.metadata.profile?.dateOfBirth || null,
          phoneNumber: profile.metadata.profile?.phoneNumber || null,
          gender: profile.metadata.profile?.gender || null,
          avatar: profile.metadata.profile.avatarImage?.url || null,
          role: profile.metadata.profile?.role || null,
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const refreshUser = async () => {
    await fetchUserData();
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
