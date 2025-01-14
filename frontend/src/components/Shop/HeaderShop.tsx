import { ProductOutlined, StarOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Form, message, Modal, Select, Typography } from 'antd';
import './HeaderShopStyle.css';
import TextArea from 'antd/es/input/TextArea';
import { useReportReasons } from '../../service/hooks/useReportReasons';
import { useUser } from '../../context/UserContext';
import { postReport } from '../../service/api/report';
import { useEffect, useState } from 'react';

interface HeaderShopProps {
  shopInfo: any;
  shopManagerInfo: any;
}

const HeaderShop: React.FC<HeaderShopProps> = ({
  shopInfo,
  shopManagerInfo,
}) => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const reportReasons = useReportReasons('shop');
  const { user } = useUser();

  useEffect(() => {
    console.log(shopInfo, shopManagerInfo);
  }, [shopInfo, shopManagerInfo]);

  const onClose = () => {
    setVisible(false);
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();

        postReport('shop', {
          ...values,
          shopId: shopInfo.shopOwnerId,
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

  return (
    <>
      <div className="HeaderShop">
        <div className="HeaderShop__info">
          <Avatar
            src={
              shopManagerInfo && shopManagerInfo?.avatarImage?.url
                ? shopManagerInfo?.avatarImage?.url
                : '#'
            }
            icon={shopManagerInfo?.avatarImage?.url ? null : <UserOutlined />}
            style={{ background: '#ddd', color: '#000' }}
            className="logo-shop"
          />
          <div style={{ color: '#fff' }}>{shopInfo.shopName}</div>
        </div>
        <div className="HeaderShop__infoDetail">
          <div className="HeaderShop__item">
            <ProductOutlined
              style={{ color: '#FF6600', fontSize: '24px' }}
              className="icon-header-shop"
            />
            <div>Product {shopInfo?.numProducts}</div>
          </div>
          <div className="HeaderShop__item">
            <StarOutlined
              style={{ color: '#FFFF00', fontSize: '24px' }}
              className="icon-header-shop"
            />
            <div>
              {shopInfo?.numReviews
                ? Number(shopInfo?.totalRating / shopInfo?.numReviews).toFixed(
                    1,
                  )
                : 0}{' '}
              ({shopInfo?.numReviews} reviews)
            </div>
          </div>
          <div className="HeaderShop__item">
            <ProductOutlined
              style={{ color: '#0033FF', fontSize: '24px' }}
              className="icon-header-shop"
            />
            <div>Sold Orders {shopInfo?.numSoldOrders}</div>
          </div>

          <div>
            {user && user.role !== 'ADMIN' && (
              <Button type="text" onClick={() => setVisible(true)}>
                <Typography.Text underline type="warning">
                  Report
                </Typography.Text>
              </Button>
            )}
          </div>
        </div>
      </div>

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

const toUpperCase = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export default HeaderShop;
