import { Space, Typography } from 'antd';
import { FormLogin } from './form-login';
import { OtherLogin } from './other-login';

export const ContentLogin = () => {
  return (
    <Space
      className="content-login"
      size={0}
      direction="vertical"
      style={{
        width: '90%',
        height: '100%',
        margin: '0',
        gap: '0',
        borderRadius: '20px',
        background: 'transparent',
        backgroundImage: 'linear-gradient(to right, #cbcff5, #f2fcfe)',
      }}
    >
      <Typography.Title level={3} style={{ marginLeft: '20px', marginTop: '20px' }}>
        Log In
      </Typography.Title>
      <FormLogin />
      <OtherLogin />
    </Space>
  );
};
