import {
  Button,
  Card,
  Divider,
  Form,
  message,
  Modal,
  Rate,
  Row,
  Select,
  Typography,
} from 'antd';
import { useMemo, useState } from 'react';
import { RootState } from '../../../service/state/store';
import { useSelector } from 'react-redux';
import numberAbbreviation from '../../../utils/number-abbreviation';
import TextArea from 'antd/es/input/TextArea';
import { useReportReasons } from '../../../service/hooks/useReportReasons';
import { postReport } from '../../../service/api/report';
import { useUser } from '../../../context/UserContext';

export const ProductReview = () => {
  const product = useSelector((state: RootState) => state.product);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const reportReasons = useReportReasons('product');
  const { user } = useUser();

  const onClose = () => {
    setVisible(false);
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();

        postReport('product', {
          ...values,
          productId: product.id,
        })
          .then(() => {
            message.success('Report sent successfully!');
          })
          .catch((error) => {
            console.log(error);
            message.error('Report failed!');
          });

        onClose();
      })
      .catch((info) => {
        message.error('Report failed!');
        console.log('Validate Failed:', info);
      });
  };

  const averageRate = useMemo((): number => {
    return product?.totalRating && product?.numReviews
      ? parseFloat((product.totalRating / product.numReviews).toFixed(1))
      : 0;
  }, [product]);

  return (
    <>
      <Card style={{ marginTop: '20px' }}>
        <Row
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Row
            gutter={[8, 8]}
            style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}
          >
            <Typography.Text
              strong
              style={{ fontSize: '0.8rem', margin: '0 5px 0 5px' }}
            >
              {averageRate}
            </Typography.Text>
            <Rate
              disabled
              value={averageRate}
              allowHalf
              style={{ fontSize: '0.8rem' }}
            />

            <Divider type="vertical" style={{ height: '20px' }} />

            <Typography.Text strong italic style={{ fontSize: '0.8rem' }}>
              {product?.numReviews} reviews
            </Typography.Text>

            <Divider type="vertical" style={{ height: '20px' }} />
            <Typography.Text strong italic style={{ fontSize: '0.8rem' }}>
              {numberAbbreviation(product?.soldCount)} sales
            </Typography.Text>
          </Row>

          {user && user.role !== 'ADMIN' && (
            <Button type="text" onClick={() => setVisible(true)}>
              <Typography.Text underline type="warning">
                Report
              </Typography.Text>
            </Button>
          )}
        </Row>
      </Card>

      <Modal
        title="Report"
        open={visible}
        onCancel={onClose}
        footer={[
          <Button key="back" onClick={onClose}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSubmit}>
            Send Report
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" name="report_form">
          <Form.Item
            name="reportReason"
            label="Report Reason"
            rules={[{ required: true, message: 'Please select report reason' }]}
          >
            <Select
              placeholder="Select a reason"
              options={reportReasons?.map((reason: any) => {
                return { label: toUpperCase(reason), value: reason };
              })}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description!' }]}
          >
            <TextArea rows={4} placeholder="Enter description here..." />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

function toUpperCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
