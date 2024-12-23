import { Form, Input, Button, Card, Space, message } from 'antd';
import { RETURN_API_ENDPOINTS } from '../../config/API_config';
import axios from 'axios';

const { TextArea } = Input;

export const FormReturn = (orderId: number) => {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    console.log('Form values: ', values);
    const request = {
      orderId: orderId,
      ...values,
    };
    try {
      axios.post(RETURN_API_ENDPOINTS.RETURN, request, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
    } catch (error: any) {
      message.error(error?.message);
    }
  };

  return (
    <Card
      title="Request Return"
      style={{ maxWidth: 600, margin: 'auto', marginTop: 50, padding: '1rem' }}
      bordered={true}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="reason"
          label="Reason for return"
          rules={[{ required: true, message: 'Please enter reason' }]}
        >
          <Input placeholder="Briefly describe the reason" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[
            { required: true, message: 'Please enter description' },
            { max: 500, message: 'Description must not exceed 500 characters' },
          ]}
        >
          <TextArea
            rows={4}
            placeholder="Please describe the problem you are having with the product."
          />
        </Form.Item>

        <Form.Item>
          <Space style={{ width: '100%', justifyContent: 'center' }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};
