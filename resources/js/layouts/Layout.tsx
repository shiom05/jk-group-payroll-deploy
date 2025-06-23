import { type SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import { 
  DashboardOutlined,
  SafetyOutlined,
  CalendarOutlined,
  DollarCircleOutlined,
  ScheduleOutlined,
  AppstoreOutlined,
  PayCircleOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { Layout as AntDLayout, Menu, theme, Button, message } from 'antd';

const { Header, Sider, Content } = AntDLayout;

const Layout = ({ children }: { children: React.ReactNode }) => {
  const {
    auth: { user }
  } = usePage<SharedData>().props;

  const currentPath = usePage().url;

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken();

  const pathToKeyMap: Record<string, string> = {
    '/dashboard': '1',
    '/security-management': '2',
    '/leave-management': '3',
    '/expense-management': '4',
    '/shift-management': '5',
    '/inventory-management': '6',
    '/payroll-management': '7'
  };

  const keyToPathMap: Record<string, string> = Object.fromEntries(
    Object.entries(pathToKeyMap).map(([path, key]) => [key, path])
  );

  const selectedKey = pathToKeyMap[currentPath] || '1';

  const handleLogout = () => {
    router.post('/logout', {}, {
      onSuccess: () => {
        message.success('Logged out successfully');
        router.visit('/login');
      },
      onError: (errors) => {
        message.error('Logout failed. Please try again.');
        console.error('Logout error:', errors);
      }
    });
  };

  const menuItems = [
    {
      key: '1',
      icon: <DashboardOutlined />,
      label: 'Dashboard'
    },
    {
      key: '2',
      icon: <SafetyOutlined />,
      label: 'Security'
    },
    {
      key: '3',
      icon: <CalendarOutlined />,
      label: 'Leave'
    },
    {
      key: '4',
      icon: <DollarCircleOutlined />,
      label: 'Expense'
    },
    {
      key: '5',
      icon: <ScheduleOutlined />,
      label: 'Shift'
    },
    {
      key: '6',
      icon: <AppstoreOutlined />,
      label: 'Inventory'
    },
    {
      key: '7',
      icon: <PayCircleOutlined />,
      label: 'Payroll'
    }
  ];

  return (
    <AntDLayout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0
        }}
      >
        <div
          className="demo-logo-vertical"
          style={{
            height: 64,
            margin: 16,
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div className="text-center text-xl font-bold text-white">JK SECURITY</div>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={({ key }) => {
            const path = keyToPathMap[key];
            if (path) {
              router.get(path);
            }
          }}
          items={menuItems}
        />
      </Sider>

      <AntDLayout
        style={{
          marginLeft: collapsed ? 80 : 200,
          minHeight: '100vh'
        }}
      >
        <Header
          style={{ padding: 0, background: colorBgContainer }}
          className="flex"
        >
          <nav className="flex w-full items-center justify-between bg-gradient-to-r from-gray-100 to-gray-300 p-4 text-white">
            {user && (
              <Button
                type="primary"
                danger
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                className="flex items-center"
              >
                {!collapsed && 'Logout'}
              </Button>
            )}
          </nav>
        </Header>

        <Content
          style={{
            margin: '0px',
            overflow: 'auto',
            height: 'calc(100vh - 64px)',
            background: colorBgContainer,
            borderRadius: borderRadiusLG
          }}
        >
          {children}
        </Content>
      </AntDLayout>
    </AntDLayout>
  );
};

export default Layout;