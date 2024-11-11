import { Outlet } from 'react-router-dom';
import AccountSidebar from '../../components/AccountSidebar';
import './UserAccountPageStyle.css';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const UserAccountPage: React.FC = () => {
  const username = 'thanhtruc';
  return (
    <>
      <div className="container">
        <div className="Sidebar">
          <div className="Sidebar__avatar">
            <Avatar
              icon={<UserOutlined />}
              size={64}
              style={{
                marginBottom: '10px',
                fontSize: '42px',
              }}
            />
            <div style={{ marginBottom: '10px' }}>{username}</div>
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
