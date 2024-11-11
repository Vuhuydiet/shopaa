import { Button, Card, Col, Form, Input, message, Row, Typography } from 'antd';
import logo from '../../images/logo.png';
import { registerShop } from '../../service/shopService';

const { Title } = Typography;

const RegisterShopForm: React.FC = () => {
  const [form] = Form.useForm();

  const handleRegister = async () => {
    try {
      const values = await form.validateFields();
      const token = localStorage.getItem('token') || '';
      if (token) {
        const data = {
          shopName: values.shopName,
          shopDescription: values.description,
          address: values.address,
        };
        const res = await registerShop(token, data);
        if (res) {
          message.success('Shop registered successfully!');
          // link den trang quan ly shop
        }
      }
    } catch (error) {
      message.error('Failed to register shop. Please try again.');
    }
  };
  return (
    <>
      <Card style={{ padding: '20px' }}>
        <Title level={2} style={{ textAlign: 'left', marginLeft: '10px' }}>
          Register Shop
        </Title>
        <hr />

        <Row
          gutter={16}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '30px',
          }}
        >
          <Col
            span={8}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ width: '80%' }}>
              <img
                src={logo}
                alt="logo"
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
          </Col>
          <Col span={15} className="RegisterShop__Form">
            <Form form={form} layout="vertical" style={{ width: '80%' }}>
              <Title level={3} style={{ textAlign: 'center', margin: '10px' }}>
                Create Shop
              </Title>
              <Form.Item
                label="Your shop name"
                name="shopName"
                style={{ margin: '15px' }}
                className="custom-label"
                rules={[
                  {
                    required: true,
                    message: 'Please enter your shop name',
                  },
                  {
                    pattern: /^[a-zA-Z][a-zA-Z0-9\s]*$/,
                    message:
                      'Shop name must start with an uppercase letter and only contain alphanumeric characters and spaces',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Shop Description"
                name="description"
                style={{ margin: '15px' }}
                className="custom-label"
                rules={[
                  {
                    required: true,
                    message: 'Please enter a description',
                  },
                ]}
              >
                <Input.TextArea autoSize={{ minRows: 2, maxRows: 6 }} />
              </Form.Item>
              <Form.Item
                label="Address"
                name="address"
                style={{ margin: '15px' }}
                className="custom-label"
                rules={[
                  {
                    required: true,
                    message: 'Please enter a description',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Bank Name"
                name="bankName"
                style={{ margin: '15px' }}
                className="custom-label"
                rules={[
                  {
                    required: true,
                    message: 'Please enter a description',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Bank Account Number"
                name="accountNumber"
                style={{ margin: '15px' }}
                className="custom-label"
                rules={[
                  {
                    required: true,
                    message: 'Please enter the bank account number',
                  },
                  {
                    pattern: /^[0-9]{6,16}$/,
                    message: 'Bank account number must be between 6-16 digits',
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Form>
            <Button
              type="primary"
              style={{
                marginTop: '20px',
                padding: '20px',
                fontSize: '14px',
              }}
              onClick={handleRegister}
            >
              Register
            </Button>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default RegisterShopForm;
