import { Button, Select, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { filterAsync } from '../../service/state/actions/filter-action';
import { AppDispatch, RootState } from '../../service/state/store';

export const SortOptions = () => {
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [order, setOrder] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const filter = useSelector((state: RootState) => state.filters.filter);

  useEffect(() => {
    if (sortBy && order) {
      dispatch(
        filterAsync({
          ...filter,
          sortBy,
          order,
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
