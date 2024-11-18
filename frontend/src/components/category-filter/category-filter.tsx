import { Button, InputNumber, Menu } from 'antd';
import { MoneyCollectOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { RootState } from '../../service/state/store';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useState } from 'react';
import { ICategory } from '../../interfaces/ICategory';
import { setFilter } from '../../service/state/slices/filter-slice';
import { setPagination } from '../../service/state/slices/pagination-slice';

export const CategoryFilter = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.filters);
  const categories = useSelector((state: RootState) => state.categories.items);

  const handleCategoryChange = useCallback(
    (key: number) => {
      dispatch(
        setFilter({
          ...filters,
          category: key || undefined,
          limit: 24,
        }),
      );
    },
    [filters, dispatch],
  );

  const handleChangePriceRange = useCallback(
    (minPrice: number | null, maxPrice: number | null) => {
      if (minPrice != null && maxPrice != null && minPrice < maxPrice) {
        console.log(minPrice, maxPrice);
        dispatch(
          setFilter({
            ...filters,
            minPrice: minPrice,
            maxPrice: maxPrice,
            limit: 24,
          }),
        );
        dispatch(setPagination({ currentPage: 1 }));
      }
    },
    [filters, dispatch],
  );

  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  return (
    <Menu
      mode="inline"
      items={[
        {
          key: 'all',
          label: 'All Categories',
          icon: <UnorderedListOutlined />,
          children: categories.map((category: ICategory) => ({
            key: category.id,
            label: category.name,
            onClick: () => handleCategoryChange(category.id),
          })),
        },
        {
          key: 'price-range',
          label: 'Price Range',
          icon: <MoneyCollectOutlined />,
          children: [
            {
              key: 'price',
              style: { height: 'auto' },
              label: (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    padding: '8px 0',
                    height: 'auto',
                    minHeight: '150px',
                  }}
                >
                  <InputNumber
                    placeholder="From"
                    min={0}
                    step={10000}
                    size="large"
                    value={minPrice}
                    onChange={(value) => setMinPrice(value)}
                    style={{ marginBottom: 8, width: '100%' }}
                  />
                  <InputNumber
                    placeholder="To"
                    min={0}
                    step={10000}
                    size="large"
                    value={maxPrice}
                    onChange={(value) => setMaxPrice(value)}
                    style={{ marginBottom: 8, width: '100%' }}
                  />
                  <Button
                    type="primary"
                    onClick={() => handleChangePriceRange(minPrice, maxPrice)}
                    style={{ width: '100%', marginTop: 8 }}
                  >
                    Apply
                  </Button>
                </div>
              ),
            },
          ],
        },
      ]}
    />
  );
};
