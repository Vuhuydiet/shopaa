import { Button, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';

export const FormLogin = () => {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, []);

  const navigate = useNavigate();

  const login = async (values: any) => {
    const res = await axios.post('http://localhost:3000/sign-in', values);
    console.log(res.data);
    localStorage.setItem('token', res.data.metadata.token);
  };

  const onFinish = (values: any) => {
    login(values);
    navigate('/');
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        margin: '10px auto',
      }}
    >
      <Form.Item
        name="username"
        style={{ width: '80%' }}
        hasFeedback
        required
        rules={[
          {
            required: true,
            message: 'Please enter your email',
          },
          {
            validator: async (_, value) => {
              const emailPattern =
                /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
              const phonePattern = /^(0|84)(3|5|7|8|9)[0-9]{8}$/;

              if (!value) return Promise.resolve();

              if (emailPattern.test(value) || phonePattern.test(value)) {
                return Promise.resolve();
              }
              return Promise.reject(
                'Please enter a valid email or phone number',
              );
            },
          },
        ]}
      >
        <Input placeholder="Email/Phone number" />
      </Form.Item>
      <Form.Item
        name="password"
        required
        style={{ width: '80%' }}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please enter your password',
          },
          {
            min: 8,
            message: 'Password must be at least 8 characters long',
          },
          {
            validator: async (_, value: string) => {
              return RegExp(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*_]{8,}$/,
              ).test(value)
                ? Promise.resolve()
                : Promise.reject(
                    new Error(
                      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
                    ),
                  );
            },
          },
        ]}
      >
        <Input.Password placeholder="Password" />
      </Form.Item>
      <Form.Item style={{ width: '80%', margin: '0' }}>
        <Button type="primary" htmlType="submit" block>
          Log In
        </Button>
      </Form.Item>
    </Form>
  );
};
