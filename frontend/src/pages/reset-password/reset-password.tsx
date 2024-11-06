import { Col, Row } from 'antd';
import { LogoLogin } from '../login/logo-login';
import { FormResetPassword } from './form-reset-password';
import '../login/login.css';

export const ResetPassword = () => {
  return (
    <div className="login-page">
      <Row className="login-container">
        <Col className="login__logo" span={10}>
          <LogoLogin />
        </Col>
        <Col className="login__logo login__content" span={12}>
          <FormResetPassword />
        </Col>
      </Row>
    </div>
  );
};
