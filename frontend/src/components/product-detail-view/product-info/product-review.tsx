import { Divider, Rate, Row, Typography } from 'antd';
import React from 'react';
import { RootState } from '../../../service/state/store';
import { useSelector } from 'react-redux';
import numberAbbreviation from '../../../utils/number-abbreviation';

export const ProductReview = React.memo(() => {
  const product = useSelector((state: RootState) => state.product);

  return (
    <Row
      gutter={[8, 8]}
      style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}
    >
      <Typography.Text
        strong
        style={{ fontSize: '0.8rem', margin: '0 5px 0 5px' }}
      >
        4.7
      </Typography.Text>
      <Rate
        disabled
        defaultValue={4.7}
        allowHalf
        style={{ fontSize: '0.8rem' }}
      />
      <Divider type="vertical" style={{ height: '20px' }} />
      <Typography.Text strong italic style={{ fontSize: '0.8rem' }}>
        3.6k reviews
      </Typography.Text>
      <Divider type="vertical" style={{ height: '20px' }} />
      <Typography.Text strong italic style={{ fontSize: '0.8rem' }}>
        {numberAbbreviation(product?.soldCount)} sales
      </Typography.Text>
    </Row>
  );
});
