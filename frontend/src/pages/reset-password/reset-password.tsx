import { Col, Row } from 'antd';
import { LogoLogin } from '../login/logo-login';
import { FormResetPassword } from './form-reset-password';
import '../login/login.css';
import { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export const ResetPassword = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, []);

  return (
    <div className="login-page">
      <Row className="login-container">
        <Col className="login__logo" xs={0} sm={0} md={0} lg={12}>
          <NavLink to="/">
            <LogoLogin />
          </NavLink>
        </Col>
        <Col
          className="login__logo login__content"
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
          <FormResetPassword />
        </Col>
      </Row>
    </div>
  );
};
