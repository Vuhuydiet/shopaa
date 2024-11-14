import { Button, Card, Col, Form, Row, Typography } from 'antd';
import { maskEmail } from '../../utils/emailUtils';
import './ProfileStyle.css';

const { Title } = Typography;

const Account: React.FC = () => {
  const [form] = Form.useForm();
  const username = 'thanhtruc';
  const email = 'thanhtruc@gmail.com';

  const handleChangePassword = () => {
    console.log('solve logic change password here');
  };
  return (
    <>
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
                    {username}
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
                    {maskEmail(email)}
                  </Typography.Text>
                </Form.Item>

                <Form.Item
                  label="Password"
                  labelCol={{ flex: '120px' }}
                  wrapperCol={{ flex: 'auto' }}
                  style={{ margin: '30px' }}
                  className="custom-label"
                >
                  <Typography.Text className="custom-text">{}</Typography.Text>
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
    </>
  );
};

export default Account;
