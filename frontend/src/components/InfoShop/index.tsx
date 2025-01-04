import { useEffect, useState } from 'react';
import { getShop, updateShop } from '../../service/shopService';
import { Form, Input, Button, Typography, message, Spin } from 'antd';
import {
  ShoppingCartOutlined,
  ShoppingOutlined,
  CommentOutlined,
  StarFilled,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const InfoShop: React.FC = () => {
  const [shop, setShop] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getShop(
          parseInt(localStorage.getItem('userId') || '0'),
        );
        setShop(result);
      } catch (error) {
        message.error('Failed to fetch shop data!');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFinish = async (values: any) => {
    try {
      const token = localStorage.getItem('token') || '';
      console.log('shopData: ', values);
      await updateShop(token, values);
      setShop({ ...shop, ...values });
      message.success('Shop information updated successfully!');
      setIsEditing(false);
    } catch (error) {
      message.error('Failed to update shop information!');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    form.setFieldsValue({
      shopName: shop.name,
      shopDescription: shop.description,
      address: shop.address,
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.resetFields();
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Spin tip="Loading Shop Information..." />
      </div>
    );
  }

  if (!shop) {
    return (
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Text type="danger">Failed to load shop information.</Text>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px 40px', color: 'black' }}>
      <h1
        style={{
          textAlign: 'left',
          marginLeft: '10px',
          marginBottom: '10px',
        }}
      >
        Shop Information
      </h1>
      <hr />
      <div style={{ marginTop: '40px' }}>
        {isEditing ? (
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <Title level={4} style={{ textAlign: 'center' }}>
              Edit Shop Information
            </Title>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleFinish}
              initialValues={{
                shopName: shop.name,
                shopDescription: shop.description,
                address: shop.address,
              }}
            >
              <Form.Item
                name="shopName"
                label="Shop Name"
                rules={[
                  { required: true, message: 'Please input the shop name!' },
                ]}
              >
                <Input placeholder="Enter shop name" />
              </Form.Item>

              <Form.Item
                name="shopDescription"
                label="Shop Description"
                rules={[
                  {
                    required: true,
                    message: 'Please input the shop description!',
                  },
                ]}
              >
                <Input.TextArea placeholder="Enter shop description" rows={4} />
              </Form.Item>

              <Form.Item
                name="address"
                label="Address"
                rules={[
                  { required: true, message: 'Please input the shop address!' },
                ]}
              >
                <Input placeholder="Enter shop address" />
              </Form.Item>

              <div style={{ textAlign: 'right' }}>
                <Button onClick={handleCancel} style={{ marginRight: 8 }}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit">
                  Save Changes
                </Button>
              </div>
            </Form>
          </div>
        ) : (
          <div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '200px 1fr',
                gap: '20px',
                alignItems: 'center',
                marginBottom: '25px',
                fontSize: '1rem',
              }}
            >
              <div>
                <strong>Shop Name:</strong>
              </div>
              <div>{shop.name}</div>

              <div>
                <strong>Shop Description:</strong>
              </div>
              <div>{shop.description}</div>

              <div>
                <strong>Address:</strong>
              </div>
              <div>{shop.address}</div>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                fontSize: '1rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: 10,
                }}
              >
                <ShoppingOutlined
                  style={{ fontSize: 20, color: '#1890ff', marginRight: 8 }}
                />
                <div style={{ marginRight: 8 }}>
                  <strong>Products:</strong>
                </div>
                <p style={{ margin: 0 }}>{shop.numProducts}</p>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: 10,
                }}
              >
                <ShoppingCartOutlined
                  style={{ fontSize: 20, color: '#52c41a', marginRight: 8 }}
                />
                <div style={{ marginRight: 8 }}>
                  <strong>Sold Orders:</strong>
                </div>
                <p style={{ margin: 0 }}>{shop.numSoldOrders}</p>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: 10,
                }}
              >
                <CommentOutlined
                  style={{ fontSize: 20, color: '#faad14', marginRight: 8 }}
                />

                <div style={{ marginRight: 8 }}>
                  <strong>Reviews:</strong>
                </div>
                <p style={{ margin: 0 }}>{shop.numReviews}</p>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: 10,
                }}
              >
                <StarFilled
                  style={{ fontSize: 20, color: 'yellow', marginRight: 8 }}
                />
                <div style={{ marginRight: 8 }}>
                  <strong>Average Rating:</strong>
                </div>
                <p style={{ margin: 0 }}>
                  {(shop?.totalRating / shop?.numReviews).toFixed(1)} / 5
                </p>
              </div>
            </div>

            <div
              style={{
                textAlign: 'left',
                marginTop: '30px',
                marginBottom: '20px',
              }}
            >
              <Button type="primary" onClick={handleEdit}>
                Edit Information
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoShop;
