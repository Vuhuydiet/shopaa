import { DeleteFilled } from '@ant-design/icons';
import {
  Button,
  Col,
  InputNumber,
  Row,
  Select,
  Space,
  Table,
  Tooltip,
  Typography,
} from 'antd';
import { CartContext } from '../../context/CartContext';
import { useContext } from 'react';

export const ProductCartTable = () => {
  const {
    shopColumns,
    shopDataState,
    expandTable,
    isLoading,
    totalPrice,
    totalItems,
  } = useContext(CartContext);

  return (
    <>
      <Table
        loading={isLoading}
        columns={shopColumns}
        dataSource={shopDataState}
        expandable={expandTable}
        pagination={false}
      />
      <Col
        span={24}
        style={{ margin: '10px', display: 'flex', justifyContent: 'end' }}
      >
        <Row
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
          }}
        >
          <Typography.Text strong style={{ color: 'red' }}>
            Total ({totalItems} items): ${totalPrice}
          </Typography.Text>
          <Button style={{ backgroundColor: 'purple', color: 'white' }}>
            Checkout
          </Button>
        </Row>
      </Col>
    </>
  );
};
