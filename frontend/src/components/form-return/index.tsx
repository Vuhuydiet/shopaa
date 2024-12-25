import { Form, Input, Card, Select } from 'antd';
import { useReasons } from '../../service/api/useReasons';

const { TextArea } = Input;

export const FormReturn = ({
  form,
  handleSubmitReturn,
}: {
  form: any;
  handleSubmitReturn: any;
}) => {
  const { data: reasons } = useReasons();

  return (
    <Card
      style={{ maxWidth: 600, margin: 'auto', marginTop: 50, padding: '1rem' }}
      bordered={true}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmitReturn}>
        <Form.Item
          name="reason"
          label="Reason for return"
          rules={[{ required: true, message: 'Please enter reason' }]}
        >
          <Select placeholder="Please select a reason for return">
            {reasons?.map((reason) => (
              <Select.Option
                key={reason.categoryName}
                value={reason.categoryName}
              >
                {reason.categoryName}
              </Select.Option>
            ))}
          </Select>
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
      </Form>
    </Card>
  );
};
