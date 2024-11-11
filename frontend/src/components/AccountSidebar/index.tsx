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

const { Sider } = Layout;

const AccountSidebar = () => {
  const location = useLocation();

  const defaultOpenKeys = ['account'];

  return (
    <Sider width="100%" style={{ background: 'transparent' }}>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        style={{ height: '100%', borderRight: 0, background: 'transparent' }}
        defaultOpenKeys={defaultOpenKeys}
      >
        <Menu.SubMenu
          key="account"
          icon={<UserOutlined style={{ color: '#EE4000' }} />}
          title="My account"
        >
          <Menu.Item
            key="/user/account/profile"
            icon={<ProfileOutlined style={{ color: '#FF6A6A' }} />}
          >
            <NavLink to="/user/account/profile">Profile</NavLink>
          </Menu.Item>
          <Menu.Item
            key="/user/account/address"
            icon={<HomeOutlined style={{ color: '#F4A460' }} />}
          >
            <NavLink to="/user/account/address">Address</NavLink>
          </Menu.Item>
          <Menu.Item
            key="/user/account/setting"
            icon={<SettingOutlined style={{ color: '#32CD32' }} />}
          >
            <NavLink to="/user/account/setting">Setting</NavLink>
          </Menu.Item>
        </Menu.SubMenu>

        <Menu.Item
          key="/user/orders"
          icon={<FileTextOutlined style={{ color: '#FFD700' }} />}
        >
          <NavLink to="/user/orders">Order</NavLink>
        </Menu.Item>

        <Menu.Item
          key="/user/myshop"
          icon={<ShopOutlined style={{ color: '#CD3333' }} />}
        >
          <NavLink to="/user/myshop">Shop</NavLink>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default AccountSidebar;
