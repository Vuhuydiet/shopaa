import { Button, Divider, Space, Col, Row, Typography } from 'antd';
import FacebookIcon from '../../images/logo_facebook.png';
import GoogleIcon from '../../images/logo_google.png';
import { Link } from 'react-router-dom';

export const OtherLogin = () => {
  return (
    <Space
      direction="vertical"
      style={{ width: '100%', margin: '0 auto', gap: '0px' }}
    >
      <div style={{ width: '80%', margin: '0 auto' }}>
        <Link to="/forgot-password" style={{ textDecoration: 'underline' }}>
          Forgot password
        </Link>
      </div>

      <div style={{ width: '80%', margin: '0 auto' }}>
        <Divider style={{ borderColor: 'black' }}>OR</Divider>
      </div>

      <Row
        className="btnLogin"
        style={{
          width: '80%',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Col span={11} className="btnFacebook">
          <Button style={{ padding: '20px', fontSize: '1rem' }} block>
            <img
              src={FacebookIcon}
              alt="Facebook"
              style={{
                width: '2rem',
                background: 'transparent',
              }}
            />
            Facebook
          </Button>
        </Col>

        <Col span={11} offset={2} className="btnFacebook">
          <Button style={{ padding: '20px', fontSize: '1rem' }} block>
            <img
              src={GoogleIcon}
              alt="Google"
              style={{
                width: '2rem',
                background: 'transparent',
              }}
            />
            Google
          </Button>
        </Col>
      </Row>

      <div style={{ width: '80%', margin: '30px auto' }}>
        <div style={{ textAlign: 'center' }}>
          <Typography.Text style={{ fontWeight: 'lighter', fontSize: '1rem' }}>
            Do you have an account yet?{' '}
            <Link
              to="/register"
              style={{ fontWeight: 'normal', textDecoration: 'underline' }}
            >
              Register
            </Link>
          </Typography.Text>
        </div>
      </div>
    </Space>
  );
};
