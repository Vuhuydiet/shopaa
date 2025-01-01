import { ContentLogin } from './content-login';
import { LogoLogin } from './logo-login';
import { Col, Row } from 'antd';
import './login.css';
import { NavLink } from 'react-router-dom';

export const LogIn = () => {
  return (
    <div className="login-page">
      <Row className="login-container">
        <Col className="login__logo" xs={0} sm={0} md={0} lg={12}>
          <NavLink to="/">
            <LogoLogin />
          </NavLink>
        </Col>
        <Col
          className="login__login login__content"
          xs={24}
          sm={24}
          md={24}
          lg={12}
          style={{
            maxWidth: '400px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <ContentLogin />
        </Col>
      </Row>
    </div>
  );
};
