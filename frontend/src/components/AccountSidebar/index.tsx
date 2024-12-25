import {
  ProfileOutlined,
  HomeOutlined,
  UserOutlined,
  ShopOutlined,
  FileTextOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const { Sider } = Layout;

const AccountSidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useUser();

  const defaultOpenKeys = ['account'];

  const menuItems = [
    {
      key: 'account',
      icon: <UserOutlined style={{ color: '#EE4000' }} />,
      title: 'My account',
      label: 'My account',
      children: [
        {
          key: '/user/account/profile',
          icon: <ProfileOutlined style={{ color: '#FF6A6A' }} />,
          label: <NavLink to="/user/account/profile">Profile</NavLink>,
        },
        // {
        //   key: '/user/account/address',
        //   icon: <HomeOutlined style={{ color: '#F4A460' }} />,
        //   label: <NavLink to="/user/account/address">Address</NavLink>,
        // },
        {
          key: '/user/account/setting',
          icon: <SettingOutlined style={{ color: '#32CD32' }} />,
          label: <NavLink to="/user/account/setting">Setting</NavLink>,
        },
      ],
    },
    user?.role && user?.role === 'USER'
      ? {
          key: '/user/orders',
          icon: <FileTextOutlined style={{ color: '#FFD700' }} />,
          label: <NavLink to="/user/orders">Order</NavLink>,
        }
      : null,
    {
      key: '/user/myshop',
      icon: <ShopOutlined style={{ color: '#CD3333' }} />,
      label: <NavLink to="/user/myshop">Shop</NavLink>,
    },
  ];

  return (
    <Sider width="100%" style={{ background: 'transparent' }}>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        style={{ height: '100%', borderRight: 0, background: 'transparent' }}
        defaultOpenKeys={defaultOpenKeys}
        items={menuItems}
      />
    </Sider>
  );
};

export default AccountSidebar;
