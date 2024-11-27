import { Button, Divider, Space, Col, Row, Typography } from 'antd';
import FacebookIcon from '../../assets/images/logo_facebook.png';
import GoogleIcon from '../../assets/images/logo_google.png';
import { Link } from 'react-router-dom';

export const OtherLogin = () => {
  return (
    <Space direction="vertical" className="login__content__other">
      <div className="login__content-form__item" style={{ margin: '0 auto' }}>
        <Link to="/reset-password" style={{ textDecoration: 'underline' }}>
          Forgot password
        </Link>
      </div>

      <div className="login__content-form__item" style={{ margin: '0 auto' }}>
        <Divider style={{ borderColor: 'black' }}>OR</Divider>
      </div>

      <Row className="login__content__button-container">
        <Col span={11} className="login__content__button-child-container">
          <Button className="login__content__button" block>
            <img
              src={FacebookIcon}
              alt="Facebook"
              style={{
                width: '2.8rem',
                background: 'transparent',
              }}
            />
            Facebook
          </Button>
        </Col>

        <Col
          span={11}
          offset={2}
          className="login__content__button-child-container"
        >
          <Button className="login__content__button" block>
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

      <div
        className="login__content-form__item"
        style={{ margin: '30px auto' }}
      >
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
