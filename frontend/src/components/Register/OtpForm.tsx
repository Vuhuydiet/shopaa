import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Typography, Space, message } from 'antd';
import { useRegisterContext } from '../../context/RegisterContext';
import { sendOtp, signUp } from '../../service/authService';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import './FormStyle.css';

const { Title, Text } = Typography;

interface OtpFormProps {
  onBack: () => void;
}

const OtpForm: React.FC<OtpFormProps> = ({ onBack }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { registerData } = useRegisterContext();
  const [initalOtpSent, setInitalOtpSent] = useState(false);
  const email = registerData?.email || ''; // Sử dụng optional chaining
  const username = registerData?.username || '';
  const password = registerData?.password || '';

  const onFinish = async (values: { otp: string }) => {
    if (!registerData) {
      message.error('No registeration dât available.');
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
    }
  };

  const onResendOtp = async () => {
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
  };

  useEffect(() => {
    const sendInitialOtp = async () => {
      if (email && !initalOtpSent) {
        try {
          await sendOtp(email);
          message.info('OTP has been sent to your email.');
          setInitalOtpSent(true);
        } catch (error: any) {
          message.error(error.message || 'Failed to sent OTP.');
        }
      }
    };
    sendInitialOtp();
  }, [email, initalOtpSent]);

  return (
    <div
      style={{
        margin: '40px',
        marginTop: '50px',
        textAlign: 'center',
        position: 'relative',
      }}
    >
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
          style={{ fontSize: '24px', fontWeight: '500', cursor: 'pointer' }}
        />
      </div>
      <Title level={2}>OTP Verification</Title>
      <Text className="large-font">
        Please enter the OTP sent to your email:
      </Text>
      <br />
      <Text className="large-font">{email}</Text>
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
            placeholder="Enter OTP"
            maxLength={6}
            style={{ textAlign: 'center' }}
          />
        </Form.Item>

        <Form.Item style={{ marginTop: 16, marginBottom: 16 }}>
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: '70%' }}
            className="large-button"
          >
            Verify
          </Button>
        </Form.Item>
      </Form>

      <Space style={{ marginTop: 16, marginBottom: 16 }} className="large-font">
        <div>Didn't receive the code?</div>
        <Button type="link" onClick={onResendOtp}>
          Resend OTP
        </Button>
      </Space>
    </div>
  );
};

export default OtpForm;
