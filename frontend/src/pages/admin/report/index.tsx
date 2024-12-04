import React, { useEffect, useState } from 'react';
import {
  AppstoreOutlined,
  ContactsOutlined,
  ContainerOutlined,
  DashboardOutlined,
  DesktopOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Col, Layout, Menu, Row, Space, Typography } from 'antd';
import { ReportTable } from '../../../components/report-table';
import Sider from 'antd/es/layout/Sider';
import { Content } from 'antd/es/layout/layout';
import { ReportProvider } from '../../../context/ReportContext';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  { key: '1', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '2', icon: <ContactsOutlined />, label: 'Report' },
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

export const ReportPage = () => {
  const [collapsed, setCollapsed] = useState(true);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
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
            <Typography.Text style={{ color: 'black', fontWeight: 'bold' }}>
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
          <ReportProvider>
            <ReportTable />
          </ReportProvider>
        </Content>
      </Layout>
    </Layout>
  );
};
