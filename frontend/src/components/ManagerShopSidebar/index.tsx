import { ProfileOutlined, ProfileFilled } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { useLocation } from 'react-router-dom';

const { Sider } = Layout;

const ManagerShopSidebar: React.FC = () => {
  const location = useLocation();

  const defaultOpenKeys = ['list-product'];

  const menuItems = [
    {
      key: '/manager-shop/info',
      icon: <ProfileOutlined style={{ color: '#FFD700' }} />,
      title: 'Information',
      label: 'Information',
    },
    {
      key: '/manager-shop/list-product',
      icon: <ProfileFilled style={{ color: '#EE4000' }} />,
      title: 'List product',
      label: 'List product',
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

export default ManagerShopSidebar;
