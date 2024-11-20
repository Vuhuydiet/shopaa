import { Button, Card, Col, Form, Row, Typography } from 'antd';
import { maskEmail } from '../../utils/emailUtils';
import './ProfileStyle.css';
import { useEffect, useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import ChangePWForm from './ChangePWForm';

const { Title } = Typography;

const Account: React.FC = () => {
  const [form] = Form.useForm();
  const { username, email } = useAuthContext();
  const [changePW, setchangePW] = useState<boolean>(false);
  const [curUsername, setUsername] = useState<string>('Username');
  const [curEmail, setEmail] = useState<string>('Username@gmail.com');

  useEffect(() => {
    setEmail(email || 'Username@gmail.com');
    setUsername(username || 'Username');
  }, [form]);

  const handleChangePassword = () => {
    setchangePW(true);
  };
  const handleBack = () => {
    setchangePW(false);
  };

  return (
    <>
      {changePW ? (
        <ChangePWForm onBack={handleBack} />
      ) : (
        <div>
          <Card style={{ padding: '20px' }}>
            <Title level={2} style={{ textAlign: 'left', marginLeft: '40px' }}>
              My Account
            </Title>
            <Form
              form={form}
              layout="inline"
              style={{ width: '100%' }}
              initialValues={{}}
            >
              <Row gutter={16} style={{ width: '100%' }}>
                <Col span={16}>
                  <Form.Item
                    label="Username"
                    labelCol={{ flex: '120px' }}
                    wrapperCol={{ flex: 'auto' }}
                    style={{ margin: '30px' }}
                    className="custom-label"
                  >
                    <Typography.Text className="custom-text">
                      {curUsername}
                    </Typography.Text>
                  </Form.Item>

                  <Form.Item
                    label="Email"
                    labelCol={{ flex: '120px' }}
                    wrapperCol={{ flex: 'auto' }}
                    style={{ margin: '30px' }}
                    className="custom-label"
                  >
                    <Typography.Text className="custom-text">
                      {maskEmail(curEmail)}
                    </Typography.Text>
                  </Form.Item>

                  <Form.Item
                    label="Password"
                    labelCol={{ flex: '120px' }}
                    wrapperCol={{ flex: 'auto' }}
                    style={{ margin: '30px' }}
                    className="custom-label"
                  >
                    <Typography.Text className="custom-text">
                      ************
                    </Typography.Text>
                  </Form.Item>
                </Col>
              </Row>
            </Form>

            <Col
              span={12}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Button
                type="primary"
                onClick={handleChangePassword}
                style={{
                  marginTop: '10px',
                  padding: '20px',
                  fontSize: '14px',
                }}
              >
                Change Password
              </Button>
            </Col>
          </Card>
        </div>
      )}
    </>
  );
};

export default Account;
