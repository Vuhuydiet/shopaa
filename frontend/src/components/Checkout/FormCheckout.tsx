import { Form, Input, Select, Row, Col, Typography } from 'antd';
import { useUser } from '../../context/UserContext';
import { useEffect, useState } from 'react';
import { forwardRef, useImperativeHandle } from 'react';
import { getTransportationInfo } from '../../service/orderService';

const { Option } = Select;
interface ShippingProvider {
  providerId: number;
  providerName: string;
  contactNumber: string;
  contactEmail: string;
  shippingFee: number;
}

export const CheckoutForm = forwardRef(
  (
    {
      onSubmit,
      onShippingFeeChange,
    }: {
      onSubmit?: (values: any) => void;
      onShippingFeeChange?: (fee: number) => void;
    },
    ref,
  ) => {
    const [form] = Form.useForm();
    const { user } = useUser();
    const [shippingProviders, setShippingProviders] = useState<
      ShippingProvider[]
    >([]);

    useEffect(() => {
      const fetchData = async () => {
        const res = await getTransportationInfo();
        setShippingProviders(res);
      };
      if (user) {
        form.setFieldsValue({
          name: user.fullname || 'User',
        });
      }
      fetchData();
    }, [user]);

    useImperativeHandle(ref, () => ({
      validateFields: () => form.validateFields(),
    }));

    const handleProviderChange = (value: number) => {
      const selectedProvider = shippingProviders.find(
        (p) => p.providerId === value,
      );
      if (selectedProvider && onShippingFeeChange) {
        onShippingFeeChange(selectedProvider.shippingFee);
      }
    };

    return (
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        style={{ background: '#fff', padding: 20, borderRadius: 8 }}
      >
        <Typography.Title
          level={2}
          style={{ marginBottom: 40, width: '100%', textAlign: 'center' }}
        >
          Checkout
        </Typography.Title>
        <Row gutter={[16, 16]}>
          <Col
            span={24}
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: 20,
            }}
          >
            <span
              style={{
                fontSize: '1rem',
                textAlign: 'center',
                fontStyle: 'italic',
              }}
            >
              Please fill in the following information to complete your order!
            </span>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item
              label="Name"
              name="name"
              initialValue={user?.fullname || 'User'}
            >
              <Input disabled style={{ color: 'black' }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Phone Number"
              name="phone"
              rules={[
                { required: true, message: 'Please enter your phone number!' },
                {
                  pattern: /^[0-9]{10,15}$/,
                  message: 'Phone number must be 10-15 digits.',
                },
              ]}
            >
              <Input placeholder="Enter your phone number" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="House Number and Street"
              name="houseNumberAndStreet"
              rules={[
                {
                  required: true,
                  message: 'Please enter your house number and street!',
                },
              ]}
            >
              <Input placeholder="Enter house number and street" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Ward/Commune"
              name="ward"
              rules={[
                { required: true, message: 'Please enter your ward/commune!' },
              ]}
            >
              <Input placeholder="Enter ward/commune" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="District"
              name="district"
              rules={[
                { required: true, message: 'Please enter your district!' },
              ]}
            >
              <Input placeholder="Enter district" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="City/Province"
              name="city"
              rules={[
                { required: true, message: 'Please enter your city/province!' },
              ]}
            >
              <Input placeholder="Enter city/province" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Country"
              name="country"
              rules={[
                { required: true, message: 'Please select your country!' },
              ]}
            >
              <Select placeholder="Select country">
                <Option value="Vietnam">Vietnam</Option>
                <Option value="USA">United States</Option>
                <Option value="Canada">Canada</Option>
                <Option value="Australia">Australia</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item
              label="Shipping Provider"
              name="shippingProviderId"
              rules={[
                {
                  required: true,
                  message: 'Please select a shipping provider!',
                },
              ]}
            >
              <Select
                placeholder="Select a shipping provider"
                onChange={handleProviderChange}
              >
                {shippingProviders?.map((provider) => (
                  <Option
                    key={provider?.providerId}
                    value={provider?.providerId}
                  >
                    {provider?.providerName} - $ {provider?.shippingFee}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  },
);
