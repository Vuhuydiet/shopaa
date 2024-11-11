import { Button, Col, Form, Input, Space, Typography, Modal } from 'antd';
import { useState } from 'react';
import { KeyOutlined, RollbackOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AUTH_API_ENDPOINTS } from '../../config/API_config';

export const FormResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const onFinishEmail = async (values: any) => {
    try {
      setEmail(values.email);
      const res = await axios.post(AUTH_API_ENDPOINTS.SEND_OTP, values, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(res);
    } catch (error: any) {
      console.log(error?.response?.data);
    }
  };

  const onFinishResetPassword = async (values: any) => {
    const data = { ...values, email: email };
    console.log(data);
    try {
      const res = await axios.post(
        AUTH_API_ENDPOINTS.FORGOT_PASSWORD,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      console.log(res.data);
      navigate('/login');
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

  const resendOTP = async () => {
    try {
      const values = {
        email: email,
      };
      const res = await axios.post(AUTH_API_ENDPOINTS.SEND_OTP, values, {
        headers: {
          'Content-type': 'application/json',
        },
      });
      console.log(res);
      Modal.confirm({
        title: 'OTP has been sent',
        okText: 'Oke',
        type: 'success',
        okType: 'primary',
      });
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

  const onClickBack = () => {
    setEmail('');
  };

  return (
    <Space className="login__content-container" size={0} direction="vertical">
      <Typography.Title level={3} className="login__content-title">
        Reset Password
      </Typography.Title>
      {email ? (
        <>
          <Button
            icon={
              <RollbackOutlined
                style={{
                  fontSize: '1.2rem',
                  color: 'black',
                }}
              />
            }
            className="login__content-back"
            onClick={onClickBack}
          >
            Back
          </Button>
          <Form
            onFinish={onFinishResetPassword}
            className="login__content-form"
          >
            <Col
              className="login__content-form__item reset-password"
              span={24}
              style={{ display: 'flex', marginBottom: '24px' }}
            >
              <Form.Item
                style={{ margin: '0' }}
                name="otp"
                required
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: 'Please enter your OTP',
                  },
                  {
                    len: 6,
                    message: 'OTP must be 6 characters long',
                  },
                  {
                    validator: async (_, value: string) => {
                      return RegExp(/^\d{6}$/).test(value)
                        ? Promise.resolve()
                        : Promise.reject(
                            new Error('OTP must contain only numbers'),
                          );
                    },
                  },
                ]}
              >
                <Input.OTP
                  length={6}
                  autoFocus
                />
              </Form.Item>
              <Form.Item style={{ margin: '0' }}>
                <Button
                  type="link"
                  style={{ margin: '0' }}
                  onClick={() => resendOTP()}
                >
                  Resend OTP
                </Button>
              </Form.Item>
            </Col>
            <Form.Item
              name="newPassword"
              required
              className="login__content-form__item"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: 'Please enter your new password',
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
              <Input.Password
                prefix={<KeyOutlined />}
                placeholder="New Password"
              />
            </Form.Item>
            <Form.Item className="login__content-form__item">
              <Button type="primary" htmlType="submit" block>
                Reset
              </Button>
            </Form.Item>
          </Form>
        </>
      ) : (
        <Form onFinish={onFinishEmail} className="login__content-form">
          <Form.Item
            name="email"
            className="login__content-form__item"
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

                  if (!value) return Promise.resolve();

                  if (emailPattern.test(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject('Please enter a valid email');
                },
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item className="login__content-form__item">
            <Button type="primary" htmlType="submit" block>
              Next
            </Button>
          </Form.Item>
        </Form>
      )}
    </Space>
  );
};
