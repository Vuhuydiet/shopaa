import { ContentLogin } from './content-login';
import { LogoLogin } from './logo-login';
import { Col, Row } from 'antd';
import './login.css';

export const LogIn = () => {
  return (
    <div className="login-page">
      <Row className="login-container">
        <Col className="login__logo" span={10}>
          <LogoLogin />
        </Col>
        <Col className="login__login login__content" span={12}>
          <ContentLogin />
        </Col>
      </Row>
    </div>
  );
};
