import { Card, Space, Typography } from 'antd';
import React from 'react';
import { RootState } from '../../../service/state/store';
import { useSelector } from 'react-redux';
import { formatCurrency } from '../../../utils/format-number';

export const ProductPrice = React.memo(() => {
  const product = useSelector((state: RootState) => state.product);

  return (
    <Card
      style={{
        margin: '10px 0',
        width: '40%',
        padding: '5px',
      }}
    >
      <Space
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-evenly',
        }}
      >
        <Typography.Text
          strong
          italic
          style={{
            fontSize: '1.2rem',
            color: 'red',
          }}
        >
          {formatCurrency(product.currentPrice, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Typography.Text>

        <Typography.Text
          italic
          delete
          style={{
            fontSize: '0.6rem',
            color: 'gray',
          }}
        >
          {formatCurrency(product.originalPrice, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Typography.Text>
      </Space>
    </Card>
  );
});
