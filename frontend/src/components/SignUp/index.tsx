import { Link } from 'react-router-dom';
import SignUpForm from './SignUpForm';
import { Space } from 'antd';

const SignUp: React.FC = () => {
  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0',
        }}
      >
        <div>
          <h1>Create account</h1>
        </div>
        <SignUpForm />
        <div>
          <Space>
            <h4>Do you have an account?</h4>
            <Link to="/login">Log in</Link>
          </Space>
        </div>
      </div>
    </>
  );
};

export default SignUp;
