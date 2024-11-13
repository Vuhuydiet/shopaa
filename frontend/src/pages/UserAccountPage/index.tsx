import { Outlet } from 'react-router-dom';
import AccountSidebar from '../../components/AccountSidebar';
import './UserAccountPageStyle.css';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useUser } from '../../context/UserContext';
import { useEffect } from 'react';

const UserAccountPage: React.FC = () => {
  const { user, refreshUser } = useUser();
  useEffect(() => {
    if (user) {
      refreshUser();
    }
  }, []);
  return (
    <>
      <div className="container">
        <div className="Sidebar">
          <div className="Sidebar__avatar">
            <Avatar
              src={user?.avatar || undefined}
              icon={user?.avatar ? null : <UserOutlined />}
              size={64}
              style={{
                marginBottom: '10px',
                fontSize: '42px',
              }}
            />
            <div style={{ marginBottom: '10px' }}>{user?.fullname}</div>
            <hr className="divider" />
          </div>
          <AccountSidebar />
        </div>
        <div className="Content">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default UserAccountPage;
