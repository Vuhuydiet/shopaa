import { Space } from 'antd';
import { Link } from 'react-router-dom';

export const OtherLogin = () => {
  return (
    <Space
      direction="vertical"
      className="login__content__other"
      style={{ paddingBottom: '1.5rem' }}
    >
      <div
        className="login__content-form__item"
        style={{
          margin: '10px auto',
          display: 'flex',
          justifyContent: 'space-evenly',
          width: '100%',
        }}
      >
        <Link to="/reset-password" style={{ textDecoration: 'underline' }}>
          Forgot password
        </Link>
        <Link to="/register" style={{ textDecoration: 'underline' }}>
          Register
        </Link>
      </div>
    </Space>
  );
};
