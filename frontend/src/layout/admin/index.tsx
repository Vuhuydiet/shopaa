import { Outlet, useLocation, useNavigate } from 'react-router-dom';
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
  ContactsOutlined,
  DashboardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  QuestionOutlined,
} from '@ant-design/icons';
import Sider from 'antd/es/layout/Sider';
import { Content } from 'antd/es/layout/layout';
import { useState } from 'react';

type MenuItem = Required<MenuProps>['items'][number];

export const LayoutAdmin = () => {
  const [collapsed, setCollapsed] = useState(true);
  const location = useLocation();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const navigate = useNavigate();

  const items: MenuItem[] = [
    {
      key: '1',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      className:
        location.pathname === '/admin/dashboard'
          ? 'ant-menu-item-selected'
          : '',
      onClick: () => navigate('/admin/dashboard'),
    },
    {
      key: '2',
      icon: <ContactsOutlined />,
      label: 'Report',
      className:
        location.pathname === '/admin/report' ? 'ant-menu-item-selected' : '',
      onClick: () => navigate('/admin/report'),
    },
    {
      key: '3',
      icon: <QuestionOutlined />,
      label: 'Withdraw Request',
      className:
        location.pathname === '/admin/withdraw-request'
          ? 'ant-menu-item-selected'
          : '',
      onClick: () => navigate('/admin/withdraw-request'),
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

              <Menu mode="inline" inlineCollapsed={collapsed} items={items} />
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
