import { Button, Form, Input, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';
import { KeyOutlined, UserOutlined } from '@ant-design/icons';

export const FormLogin = () => {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, []);

  const navigate = useNavigate();

  const login = async (values: any) => {
    try {
      const res = await axios.post('http://localhost:3000/sign-in', values);
      console.log(res.data);
      localStorage.setItem('token', res.data.metadata.token);
      navigate('/');
    } catch (error: any) {
      console.log(error?.response?.data);
      Modal.confirm({
        title: error?.response?.data?.message,
        okText: 'Oke',
        okType: 'danger',
        cancelText: 'Cancel',
      });
    }
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
      className="login__content-form"
    >
      <Form.Item
        name="username"
        className="login__content-form__item"
        hasFeedback
        required
        rules={[
          {
            required: true,
            message: 'Please enter your username',
          },
          // {
          //   validator: async (_, value) => {
          //     const emailPattern =
          //       /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
          //     const phonePattern = /^(0|84)(3|5|7|8|9)[0-9]{8}$/;

          //     if (!value) return Promise.resolve();

          //     if (emailPattern.test(value) || phonePattern.test(value)) {
          //       return Promise.resolve();
          //     }
          //     return Promise.reject(
          //       'Please enter a valid email or phone number',
          //     );
          //   },
          // },
        ]}
      >
        <Input prefix={<UserOutlined />} placeholder="Username" />
      </Form.Item>
      <Form.Item
        name="password"
        required
        className="login__content-form__item"
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
        <Input.Password prefix={<KeyOutlined />} placeholder="Password" />
      </Form.Item>
      <Form.Item className="login__content-form__item" style={{ margin: '0' }}>
        <Button type="primary" htmlType="submit" block>
          Log In
        </Button>
      </Form.Item>
    </Form>
  );
};
