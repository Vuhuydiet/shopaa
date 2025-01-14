import { Button, Col, Form, Input, message, Row, Spin, Typography } from 'antd';
import { changePW } from '../../service/authService';
import { useState } from 'react';

const { Title } = Typography;

interface ChangePWFormProps {
  onBack: () => void;
}
const ChangePWForm: React.FC<ChangePWFormProps> = ({ onBack }) => {
  const [updating, setUpdating] = useState<boolean>(false);
  const [errorMgs, setErrorMgs] = useState<String>('');
  const onFinish = async (values: {
    oldPassword: string;
    newPassword: string;
  }) => {
    setUpdating(true);
    try {
      const token = localStorage.getItem('token') || '';
      if (token) {
        const response = await changePW(
          token,
          values.oldPassword,
          values.newPassword,
        );
        message.success(response.message);
        console.log(response.message);
        onBack();
        console.log(response);
      }
    } catch (error: any) {
      message.error(error.message || 'Failed to change password.');
      console.log(error.message);
      setErrorMgs(error.message);
    }
    setUpdating(false);
  };
  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '30px',
        }}
      >
        <div
          style={{
            width: '60%',
            margin: '20px',
            marginTop: '20px',
            textAlign: 'center',
            position: 'relative',
            border: '1px solid #ddd',
            padding: '30px 50px',
            borderRadius: '5px',
          }}
        >
          {' '}
          <Title level={3} style={{ marginBottom: '40px' }}>
            Change Password
          </Title>
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Present password"
              name="oldPassword"
              rules={[
                {
                  required: true,
                  message: 'Please input your present password!',
                },
                {
                  pattern:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*_]{8,}$/,
                  message:
                    'Password must be 8+ chars, include upper, lower, and a number.',
                },
              ]}
            >
              <Input.Password placeholder="Enter your present password" />
            </Form.Item>
            <Form.Item
              label="New password"
              name="newPassword"
              rules={[
                { required: true, message: 'Please input your new password!' },
                {
                  pattern:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*_]{8,}$/,
                  message:
                    'Password must be 8+ chars, include upper, lower, and a number.',
                },
              ]}
            >
              <Input.Password placeholder="Confirm your new password" />
            </Form.Item>

            <Form.Item
              label="Confirm new password"
              name="confirmNewPassword"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Please re-enter your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Re-enter your new password" />
            </Form.Item>
            {errorMgs === '' ? (
              <></>
            ) : (
              <Title level={5} style={{ color: 'red' }}>
                {errorMgs}
              </Title>
            )}
            <Form.Item>
              <Row justify="center" gutter={16} style={{ marginTop: '20px' }}>
                {updating ? (
                  <Spin />
                ) : (
                  <>
                    <Col span={7}>
                      {' '}
                      <Button
                        htmlType="submit"
                        style={{
                          width: '100%',
                          padding: '15px 10px',
                        }}
                        onClick={onBack}
                      >
                        Back
                      </Button>
                    </Col>
                    <Col span={12}>
                      {' '}
                      <Button
                        type="primary"
                        htmlType="submit"
                        style={{
                          width: '100%',
                          color: '#ffff',
                          padding: '15px 10px',
                        }}
                      >
                        Change password
                      </Button>
                    </Col>
                  </>
                )}
              </Row>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default ChangePWForm;
