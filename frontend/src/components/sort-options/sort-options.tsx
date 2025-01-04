import { Button, Select, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setFilter } from '../../service/state/reducers/filter-reducer';

export const SortOptions = () => {
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [order, setOrder] = useState<string | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (sortBy && order) {
      dispatch(
        setFilter({
          sortBy: sortBy,
          order: order,
        }),
      );
    }
  }, [sortBy, order]);

  return (
    <Space
      direction="horizontal"
      style={{
        background: `linear-gradient(
          to right,
          rgb(231, 222, 250),
          #9999ff,
          rgb(255, 255, 255)
        )`,
        padding: '16px',
        width: '100%',
        borderRadius: '10px',
        marginBottom: '10px',
      }}
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
      <Select placeholder="Order" onChange={(value) => setOrder(value)}>
        <Select.Option value="asc">Ascending</Select.Option>
        <Select.Option value="desc">Descending</Select.Option>
      </Select>
    </Space>
  );
};
