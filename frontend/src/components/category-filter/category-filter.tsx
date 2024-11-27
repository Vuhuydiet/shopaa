import './styles.css';
import { Button, DatePicker, InputNumber, Menu, Space } from 'antd';
import {
  CalculatorOutlined,
  CalendarOutlined,
  MoneyCollectOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { RootState } from '../../service/state/store';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { ICategory } from '../../interfaces/ICategory';
import { setFilter } from '../../service/state/slices/filter-slice';
import { setPagination } from '../../service/state/slices/pagination-slice';
import { serializeDate } from '../../utils/date-convert';
import { useCategories } from '../../service/api/useCategories';
import { setCategories } from '../../service/state/slices/category-slice';

export const CategoryFilter = () => {
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [minQuantity, setMinQuantity] = useState<number | null>(null);
  const [maxQuantity, setMaxQuantity] = useState<number | null>(null);
  const [postedAfter, setPostedAfter] = useState<Date | null>(null);
  const [postedBefore, setPostedBefore] = useState<Date | null>(null);
  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.filters);
  const { data: categories } = useCategories();

  useEffect(() => {
    if (categories) {
      dispatch(setCategories(categories));
    }
  }, [categories]);

  const handleCategoryChange = useCallback(
    (key: number) => {
      dispatch(
        setFilter({
          category: key || undefined,
        }),
      );
    },
    [filters.category, dispatch],
  );

  const handleChangePriceRange = useCallback(
    (minPrice: number | null, maxPrice: number | null) => {
      if (minPrice != null && maxPrice != null && minPrice < maxPrice) {
        dispatch(
          setFilter({
            minPrice: minPrice,
            maxPrice: maxPrice,
          }),
        );
        dispatch(setPagination({ currentPage: 1 }));
      }
    },
    [minPrice, maxPrice, dispatch],
  );

  const handleChangeQuantityRange = useCallback(
    (minQuantity: number | null, maxQuantity: number | null) => {
      if (
        minQuantity != null &&
        maxQuantity != null &&
        minQuantity < maxQuantity
      ) {
        dispatch(
          setFilter({
            minQuantity: minQuantity,
            maxQuantity: maxQuantity,
          }),
        );
        dispatch(setPagination({ currentPage: 1 }));
      }
    },
    [minQuantity, maxQuantity, dispatch],
  );

  const handleChangeDateRange = useCallback(
    (postedAfter: Date | null, postedBefore: Date | null) => {
      if (postedAfter != null && postedBefore != null) {
        dispatch(
          setFilter({
            postedAfter: serializeDate(postedAfter),
            postedBefore: serializeDate(postedBefore),
          }),
        );
        dispatch(setPagination({ currentPage: 1 }));
      }
    },
    [postedAfter, postedBefore, dispatch],
  );

  return (
    <Menu
      mode="inline"
      items={[
        {
          key: 'all',
          label: 'All Categories',
          icon: <UnorderedListOutlined />,
          children: categories?.map((category: ICategory) => ({
            key: category?.id,
            label: category?.name,
            onClick: () => handleCategoryChange(category?.id),
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
        {
          key: 'quantity-range',
          label: 'Quantity Range',
          icon: <CalculatorOutlined />,
          children: [
            {
              key: 'quantity',
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
                    step={1}
                    size="large"
                    value={minQuantity}
                    onChange={(value) => setMinQuantity(value)}
                    style={{ marginBottom: 8, width: '100%' }}
                  />
                  <InputNumber
                    placeholder="To"
                    min={0}
                    step={1}
                    size="large"
                    value={maxQuantity}
                    onChange={(value) => setMaxQuantity(value)}
                    style={{ marginBottom: 8, width: '100%' }}
                  />
                  <Button
                    type="primary"
                    onClick={() =>
                      handleChangeQuantityRange(minQuantity, maxQuantity)
                    }
                    style={{ width: '100%', marginTop: 8 }}
                  >
                    Apply
                  </Button>
                </div>
              ),
            },
          ],
        },
        {
          key: 'time-range',
          label: 'Time Range',
          icon: <CalendarOutlined />,
          children: [
            {
              key: 'time',
              style: { height: 'auto' },
              label: (
                <Space direction="vertical" style={{ width: '100%' }}>
                  <DatePicker
                    placeholder="Start Date"
                    onChange={(date: Date | null) => {
                      console.log(date);
                      setPostedAfter(date);
                    }}
                    style={{ width: '100%' }}
                  />
                  <DatePicker
                    placeholder="End Date"
                    onChange={(date: Date | null) => {
                      console.log(date);
                      setPostedBefore(date);
                    }}
                    style={{ width: '100%' }}
                  />
                  <Button
                    type="primary"
                    style={{ width: '100%' }}
                    onClick={() =>
                      handleChangeDateRange(postedAfter, postedBefore)
                    }
                  >
                    Apply
                  </Button>
                </Space>
              ),
            },
          ],
        },
      ]}
    />
  );
};
