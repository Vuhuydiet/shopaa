import { Card, Divider, Rate, Row, Typography } from 'antd';
import React, { useMemo } from 'react';
import { RootState } from '../../../service/state/store';
import { useSelector } from 'react-redux';
import numberAbbreviation from '../../../utils/number-abbreviation';

export const ProductReview = () => {
  const product = useSelector((state: RootState) => state.product);

  const averageRate = useMemo((): number => {
    return product?.totalRating && product?.numReviews
      ? parseFloat((product.totalRating / product.numReviews).toFixed(1))
      : 0;
  }, [product]);

  return (
    <Card style={{ marginTop: '20px' }}>
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
    </Card>
  );
};
