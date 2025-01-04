import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import HeaderComponent from '../../components/Header';
import {
  Button,
  ConfigProvider,
  Layout,
  Menu,
  MenuProps,
  Space,
  Typography,
} from 'antd';
import {
  AppstoreOutlined,
  ContactsOutlined,
  DashboardOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons';
import Sider from 'antd/es/layout/Sider';
import { Content } from 'antd/es/layout/layout';
import { useState } from 'react';

type MenuItem = Required<MenuProps>['items'][number];

export const LayoutAdmin = () => {
  const [collapsed, setCollapsed] = useState(true);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const navigate = useNavigate();

  const items: MenuItem[] = [
    {
      key: '1',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/admin/dashboard'),
    },
    {
      key: '2',
      icon: <ContactsOutlined />,
      label: 'Report',
      onClick: () => navigate('/admin/report'),
    },
    { key: '3', icon: <UserOutlined />, label: 'User' },
    {
      key: '4',
      label: 'Mail',
      icon: <MailOutlined />,
      children: [
        { key: '5', label: 'Option 5' },
        { key: '6', label: 'Option 6' },
        { key: '7', label: 'Option 7' },
        { key: '8', label: 'Option 8' },
      ],
    },
    {
      key: 'sub2',
      label: 'Navigation Two',
      icon: <AppstoreOutlined />,
      children: [
        { key: '9', label: 'Option 9' },
        { key: '10', label: 'Option 10' },
        {
          key: 'sub3',
          label: 'Submenu',
          children: [
            { key: '11', label: 'Option 11' },
            { key: '12', label: 'Option 12' },
          ],
        },
      ],
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {},
      }}
    >
      <div className="layout">
        <HeaderComponent />
        <main className="layout__content">
          <Layout style={{ margin: '10px 5px' }}>
            <Sider collapsed={collapsed} style={{ borderRadius: '10px' }}>
              <Space direction="horizontal" size={16}>
                <Button
                  type="default"
                  onClick={toggleCollapsed}
                  style={{ margin: '5px 5px 0 5px' }}
                >
                  {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                </Button>
                {!collapsed && (
                  <Typography.Text
                    style={{ color: 'black', fontWeight: 'bold' }}
                  >
                    Administrator
                  </Typography.Text>
                )}
              </Space>

              <Menu
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                mode="inline"
                inlineCollapsed={collapsed}
                items={items}
              />
            </Sider>
            <Layout style={{ margin: '0 0 0 5px' }}>
              <Content>
                <Outlet />
              </Content>
            </Layout>
          </Layout>
        </main>
      </div>
    </ConfigProvider>
  );
};
