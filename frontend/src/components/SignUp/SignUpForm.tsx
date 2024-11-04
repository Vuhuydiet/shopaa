import { Button, Form, Input, Space } from 'antd';

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const tailLayout = {
  wrapperCol: { span: 24 },
};

const SignUpForm: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log(values);
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <Form
      {...layout} // Sử dụng layout ở đây
      form={form}
      name="control-hooks"
      onFinish={onFinish}
      style={{ maxWidth: 600 }}
    >
      <Form.Item
        label="Your Name"
        name="name"
        rules={[{ required: true, message: 'Please input your name!' }]}
      >
        <Input placeholder="Enter your name" />
      </Form.Item>

      <Form.Item
        label="Email Address"
        name="email"
        rules={[{ required: true, message: 'Please input your email!' }]}
      >
        <Input placeholder="Enter your email" />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password placeholder="Enter your password" />
      </Form.Item>

      <Form.Item
        label="Re-password"
        name="rePassword"
        rules={[
          { required: true, message: 'Please re-enter your password!' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Passwords do not match!'));
            },
          }),
        ]}
      >
        <Input.Password placeholder="Re-enter your password" />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Space style={{ width: '100%', justifyContent: 'center', gap: '40px' }}>
          <Button type="primary" htmlType="submit" style={{ width: '120%' }}>
            Continue
          </Button>
          <Button htmlType="button" onClick={onReset} style={{ width: '75%' }}>
            Reset
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default SignUpForm;
