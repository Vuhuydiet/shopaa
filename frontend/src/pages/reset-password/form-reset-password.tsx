import { Button, Col, Form, Input, Space, Typography } from 'antd';
import { useState } from 'react';
import { KeyOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';

export const FormResetPassword = () => {
  const [email, setEmail] = useState('');

  const onFinishEmail = async (values: any) => {
    setEmail(values.email);
    console.log(values);
    const res = await axios.post('http://localhost:3000/send-otp', values, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(res.data);
  };

  const onFinishResetPassword = async (values: any) => {
    const data = { ...values, email: email };
    console.log(data);
    const res = await axios.post(
      'http://localhost:3000/forgot-password',
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    console.log(res.data);
  };

  const resendOTP = async () => {
    const values = {
      email: email
    }
    const res = await axios.post("http://localhost:3000/send-otp", values, {
      headers: {
        'Content-type': 'application/json'
      }
    })
    console.log(res)
  };

  return (
    <Space
      className="content-login"
      size={0}
      direction="vertical"
      style={{
        width: '90%',
        height: '100%',
        margin: '0',
        gap: '0',
        borderRadius: '20px',
        background: 'transparent',
        backgroundImage: 'linear-gradient(to right, #cbcff5, #f2fcfe)',
      }}
    >
      <Typography.Title
        level={3}
        style={{ marginLeft: '20px', marginTop: '20px' }}
      >
        Reset Password
      </Typography.Title>
      {email ? (
        <Form
          onFinish={onFinishResetPassword}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            margin: '10px auto',
          }}
        >
          <Col
            className="reset-password"
            span={24}
            style={{ width: '80%', display: 'flex', marginBottom: '24px' }}
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
              <Input.OTP length={6} autoFocus />
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
            style={{ width: '80%' }}
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
          <Form.Item style={{ width: '80%' }}>
            <Button type="primary" htmlType="submit" block>
              Reset
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <Form
          onFinish={onFinishEmail}
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
            name="email"
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
          <Form.Item style={{ width: '80%' }}>
            <Button type="primary" htmlType="submit" block>
              Next
            </Button>
          </Form.Item>
        </Form>
      )}
    </Space>
  );
};
