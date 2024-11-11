import { Link } from 'react-router-dom';
import { Button, Form, Input, Space, Row, Col } from 'antd';
import { useRegisterContext } from '../../context/RegisterContext';
import { useEffect } from 'react';
import './FormStyle.css';

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

interface RegisterFormProps {
  onContinue: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onContinue }) => {
  const { registerData, setRegisterData } = useRegisterContext();
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFields([
      { name: 'name', value: registerData?.username },
      { name: 'email', value: registerData?.email },
      { name: 'password', value: registerData?.password },
      { name: 'rePassword', value: registerData?.password },
    ]);
  }, [form, registerData]);

  const onFinish = (values: any) => {
    setRegisterData({
      username: values.name,
      email: values.email,
      password: values.password,
    });
    onContinue();
  };

  const onReset = () => {
    form.resetFields();
  };
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
        <div style={{ margin: '20px' }}>
          <h1 style={{ color: 'black' }}>Create account</h1>
        </div>
        <Form
          {...layout}
          form={form}
          name="control-hooks"
          onFinish={onFinish}
          style={{ maxWidth: 600 }}
          className="large-font "
        >
          <Form.Item
            label="Username"
            name="name"
            rules={[
              { required: true, message: 'Please input your name!' },
              {
                pattern: /^[A-Za-z][A-Za-z0-9]*$/,
                message:
                  'Username must start with a letter and contain no spaces!',
              },
              {
                min: 5,
                message: 'Username must be at least 5 characters long!',
              },
            ]}
          >
            <Input placeholder="Enter your username" />
          </Form.Item>

          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email address!' },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              {
                pattern:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*_]{8,}$/,
                message:
                  'Password must be 8+ chars, include upper, lower, and a number.',
              },
            ]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item
            label="Re-password"
            name="rePassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please re-enter your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Re-enter your password" />
          </Form.Item>

          <Form.Item>
            <Row justify="center" gutter={16} style={{ marginTop: '20px' }}>
              <Col span={13}>
                {' '}
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    width: '100%',
                    color: '#ffff',
                  }}
                  className="large-button"
                >
                  Register
                </Button>
              </Col>
              <Col span={7}>
                {' '}
                <Button
                  htmlType="button"
                  onClick={onReset}
                  style={{
                    width: '100%',
                  }}
                  className="large-button-white"
                >
                  Reset
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
        <div style={{ marginBottom: '20px' }}>
          <Space>
            <h4 style={{ color: 'black' }}>Do you have an account?</h4>
            <Link to="/login" style={{ fontSize: '16px' }}>
              Log in
            </Link>
          </Space>
        </div>
      </div>
    </>
  );
};

export default RegisterForm;
