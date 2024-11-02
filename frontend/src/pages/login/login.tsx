import { ContentLogin } from './content-login';
import { LogoLogin } from './logo-login';
import { Col, Row } from 'antd';

export const LogIn = () => {
  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: 'linear-gradient(to left, #8edbe8bf, #fef3ff, #ed8bf0)',
      }}
    >
      <Row
        className="login"
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Col
          className="logo"
          span={10}
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <LogoLogin />
        </Col>
        <Col
          className="content"
          span={12}
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ContentLogin />
        </Col>
      </Row>
    </div>
  );
};