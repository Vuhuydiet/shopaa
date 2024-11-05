import { Space, Typography } from 'antd';
import { FormLogin } from './form-login';
import { OtherLogin } from './other-login';

export const ContentLogin = () => {
  return (
    <Space className="login__content-container" size={0} direction="vertical">
      <Typography.Title level={3} className="login__content-title">
        Log In
      </Typography.Title>
      <FormLogin />
      <OtherLogin />
    </Space>
  );
};
