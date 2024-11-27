import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Typography, Space, message, Spin } from 'antd';
import { useRegisterContext } from '../../context/RegisterContext';
import { sendOtp, signUp } from '../../service/authService';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import './FormStyle.css';
import { maskEmail } from '../../utils/emailUtils';

const { Title, Text } = Typography;

interface OtpFormProps {
  onBack: () => void;
}

const OtpForm: React.FC<OtpFormProps> = ({ onBack }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { registerData } = useRegisterContext();
  const [initialOtpSent, setInitialOtpSent] = useState(false);
  const email = registerData?.email || '';
  const username = registerData?.username || '';
  const password = registerData?.password || '';
  const [loading, setLoading] = useState<boolean>(false);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);

  const onFinish = async (values: { otp: string }) => {
    setIsRegistering(true);
    console.log('register');

    if (!registerData) {
      message.error('No registration data available.');
      return;
    }
    try {
      const response = await signUp(
        username,
        password,
        email,
        Number(values.otp),
      );
      message.success(response.message);
      navigate('/login');
      message.info('Please log in to continue.');
    } catch (error: any) {
      message.error(error.message || 'Failed to verify OTP.');
      console.log(error.message);
      onBack();
    }
    setIsRegistering(false);
  };

  const onResendOtp = async () => {
    setLoading(true);
    if (!email) {
      message.error('No email available.');
      return;
    }

    try {
      await sendOtp(email);
      message.info('OTP has been resent to your email.');
    } catch (error: any) {
      message.error(error.message || 'Failed to resend OTP.');
    }
    setLoading(false);
  };

  useEffect(() => {
    const sendInitialOtp = async () => {
      setLoading(true);
      if (email && !initialOtpSent) {
        try {
          await sendOtp(email);
          message.info('OTP has been sent to your email.');
          setInitialOtpSent(true);
        } catch (error: any) {
          message.error(error.message || 'Failed to sent OTP.');
        }
      }
      setLoading(false);
    };
    sendInitialOtp();
  }, [email, initialOtpSent]);

  return (
    <div
      style={{
        margin: '40px',
        marginTop: '50px',
        textAlign: 'center',
        position: 'relative',
      }}
      className="Register"
    >
      {isRegistering ? (
        <>
          <Title level={3} style={{ marginBottom: '40px' }}>
            OTP Verification
          </Title>
          <Spin />
          <Title level={5} style={{ marginTop: '20px', color: 'black' }}>
            Registering your account ...
          </Title>
        </>
      ) : (
        <>
          {' '}
          <div
            style={{
              textAlign: 'left',
              marginBottom: '16px',
              position: 'absolute',
              top: '-30px',
              left: '-40px',
            }}
          >
            <ArrowLeftOutlined
              onClick={onBack}
              style={{
                fontSize: '24px',
                color: 'black',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            />
          </div>
          <Title level={3} style={{ marginBottom: '20px' }}>
            OTP Verification
          </Title>
          <Text className="large-font">
            {loading
              ? 'Sending OTP to your email'
              : 'Please enter the OTP sent to your email:'}
          </Text>
          <br />
          <Text className="large-font">{maskEmail(email)}</Text>
          <Form
            form={form}
            onFinish={onFinish}
            layout="vertical"
            style={{ marginTop: 24 }}
            className="large-font"
          >
            <Form.Item
              label="OTP Code"
              name="otp"
              rules={[
                { required: true, message: 'Please input the OTP!' },
                { len: 6, message: 'OTP must be 6 digits' },
              ]}
            >
              <Input
                disabled={loading}
                placeholder="Enter OTP"
                maxLength={6}
                style={{ textAlign: 'center' }}
              />
            </Form.Item>

            <Form.Item style={{ marginTop: 16, marginBottom: 16 }}>
              {loading ? (
                <>
                  <Spin />
                  <div>Sending otp ...</div>
                </>
              ) : (
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: '70%', color: 'white' }}
                  className="large-button"
                >
                  Verify
                </Button>
              )}
            </Form.Item>
          </Form>
          {loading ? (
            <></>
          ) : (
            <Space
              style={{ marginTop: 16, marginBottom: 16 }}
              className="large-font"
            >
              <div style={{ color: 'black' }}>Didn't receive the code?</div>
              <Button type="link" onClick={onResendOtp}>
                Resend OTP
              </Button>
            </Space>
          )}
        </>
      )}
    </div>
  );
};

export default OtpForm;
