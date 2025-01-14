import { Row, Space, Typography } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '../../service/state/store';

export const ProductDescription = () => {
  const product = useSelector((state: RootState) => state.product);

  return (
    <Space
      style={{
        backgroundColor: 'white',
        color: 'black',
        padding: '10px 40px',
        width: '100%',
      }}
      direction="vertical"
      size={12}
    >
      <Row>
        <Typography.Text
          style={{
            padding: '5px 0',
            color: 'gray',
            fontWeight: 'bold',
            fontSize: '1.3rem',
          }}
        >
          Product Description
        </Typography.Text>
      </Row>

      <Row style={{ marginLeft: '20px', whiteSpace: 'pre-line' }}>
        {product?.description}
      </Row>
    </Space>
  );
};
