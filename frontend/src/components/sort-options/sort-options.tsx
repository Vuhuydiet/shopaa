import { Button, Select, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setFilter } from '../../service/state/slices/filter-slice';

export const SortOptions = () => {
  const [sortBy, setSortBy] = useState('currentPrice');
  const [order, setOrder] = useState('asc');
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setFilter({ sortBy: sortBy, order: order }));
  }, [sortBy, order]);

  return (
    <Space
      direction="horizontal"
      style={{ backgroundColor: 'gray', padding: '16px', width: '100%' }}
    >
      <Typography.Text>Sort by</Typography.Text>
      <Button
        onClick={() => setSortBy('currentPrice')}
        style={
          sortBy === 'currentPrice'
            ? { color: 'white', backgroundColor: 'blue' }
            : {}
        }
      >
        Price
      </Button>
      <Button
        onClick={() => setSortBy('quantity')}
        style={
          sortBy === 'quantity'
            ? { color: 'white', backgroundColor: 'blue' }
            : {}
        }
      >
        Quantity
      </Button>
      <Button
        onClick={() => setSortBy('publishedAt')}
        style={
          sortBy === 'publishedAt'
            ? { color: 'white', backgroundColor: 'blue' }
            : {}
        }
      >
        Time
      </Button>
      <Select defaultValue="asc" onChange={(value) => setOrder(value)}>
        <Select.Option value="asc">Ascending</Select.Option>
        <Select.Option value="desc">Descending</Select.Option>
      </Select>
    </Space>
  );
};
