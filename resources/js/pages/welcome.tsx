import { SafetyOutlined, LoginOutlined } from '@ant-design/icons';
import { Button, Card, Layout, Typography, theme, Space, Alert } from 'antd';
import { usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';

const { Title, Text } = Typography;
const { Content } = Layout;

export default function Welcome() {
  const {
    token: { colorBgContainer, borderRadiusLG, colorPrimary },
  } = theme.useToken();
  const { auth } = usePage<SharedData>().props;

  const handleLogin = () => {
    window.location.href = '/login'; // Triggers WorkOS auth flow
  };

  return (
    <Layout  style={{ background: 'linear-gradient(135deg, #f0f2f5 0%, #e6f7ff 100%)', minHeight: '100vh' }}>
      <Content className="flex items-center justify-center p-4">
        <Card
          style={{
            width: '100%',
            maxWidth: 480,
            borderRadius: borderRadiusLG,
            boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
            border: 'none',
            overflow: 'hidden'
          }}
        >
          {/* Card Header */}
          <div style={{ 
            background: colorPrimary,
            padding: '32px 24px',
            textAlign: 'center'
          }}>
            <Space direction="vertical" size="middle">
              <SafetyOutlined style={{ 
                fontSize: 48, 
                color: 'white',
                display: 'block'
              }} />
              <Title level={2} style={{ color: 'white', margin: 0 }}>
                JK Security Group
              </Title>
              <Text style={{ color: 'rgba(255,255,255,0.8)' }}>
                Secure Access Portal
              </Text>
            </Space>
          </div>

          {/* Card Body */}
          <div style={{ padding: 40 }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Alert
                message="Enterprise Authentication"
                description="You'll be redirected to your organization's secure login portal"
                type="info"
                showIcon
              />
              
              <Button
                type="primary"
                block
                size="large"
                icon={<LoginOutlined />}
                onClick={handleLogin}
                style={{
                  height: 48,
                  fontSize: 16,
                  fontWeight: 500
                }}
              >
                Continue with WorkOS
              </Button>

              <div style={{ textAlign: 'center', marginTop: 24 }}>
                <Text type="secondary">
                  <SafetyOutlined style={{ marginRight: 8 }} />
                  Secure authentication powered by WorkOS
                </Text>
              </div>
            </Space>
          </div>
        </Card>
      </Content>
    </Layout>
  );
}