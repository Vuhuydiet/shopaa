import { Button, Form, Input, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';
import { KeyOutlined, UserOutlined } from '@ant-design/icons';
import { jwtDecode } from 'jwt-decode';
import { AUTH_API_ENDPOINTS } from '../../config/API_config';
import { useAuthContext } from '../../context/AuthContext';

export const FormLogin = () => {
  const { setStateAuthenticated } = useAuthContext();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      if (localStorage.getItem('isAdmin') === 'true') {
        navigate('/admin/report');
      } else {
        navigate('/');
      }
    }
  }, []);

  const navigate = useNavigate();

  const login = async (values: any) => {
    try {
      console.log(values);
      const res = await axios.post(AUTH_API_ENDPOINTS.SIGN_IN, values);
      // In ra message từ phản hồi trả về
      console.log(res.data.message);
      localStorage.setItem('token', res.data.metadata.token);
      localStorage.setItem('isAdmin', res.data.metadata.isAdmin);
      const decoded = jwtDecode(res.data.metadata.token);
      if (!decoded.sub) {
        throw Error('token.sub is undefined');
      }
      const { userId } = decoded.sub as any;
      localStorage.setItem('userId', userId);
      setStateAuthenticated();

      console.log('isAdmin', res.data.metadata.isAdmin);
      if (res.data.metadata.isAdmin) {
        navigate('/admin/report');
      } else {
        navigate('/');
      }
    } catch (error: any) {
      console.log(error);
      Modal.confirm({
        title: error?.response?.data?.message || 'Login failed',
        okText: 'Oke',
        okType: 'danger',
        cancelText: 'Cancel',
      });
    }
  };

  const onFinish = (values: any) => {
    login(values);
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
