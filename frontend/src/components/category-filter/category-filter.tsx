import './styles.css';
import { Button, DatePicker, InputNumber, Menu, Space } from 'antd';
import {
  CalculatorOutlined,
  CalendarOutlined,
  MoneyCollectOutlined,
  RestOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useState } from 'react';
import { ICategory } from '../../interfaces/ICategory';
import { serializeDate } from '../../utils/date-convert';
import { useCategories } from '../../service/hooks/useCategories';
import { filterAsync } from '../../service/state/actions/filter-action';
import { resetInitialState } from '../../service/state/reducers/filter-reducer';
import { AppDispatch, RootState } from '../../service/state/store';
import { PRODUCTS_FILTER } from '../../config/constants';

export const CategoryFilter = () => {
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [minQuantity, setMinQuantity] = useState<number | null>(null);
  const [maxQuantity, setMaxQuantity] = useState<number | null>(null);
  const [postedAfter, setPostedAfter] = useState<Date | null>(null);
  const [postedBefore, setPostedBefore] = useState<Date | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { data: categories } = useCategories();
  const filter = useSelector((state: RootState) => state.filters.filter);

  const handleCategoryChange = (key: number | undefined) => {
    console.log('category', key);
    dispatch(
      filterAsync({
        ...filter,
        offset: 0,
        category: key,
      }),
    );
  };

  const handleChangePriceRange = (
    minPrice: number | null,
    maxPrice: number | null,
  ) => {
    if (minPrice !== null && maxPrice !== null && minPrice < maxPrice) {
      dispatch(
        filterAsync({
          ...filter,
          minPrice,
          maxPrice,
          offset: 0,
        }),
      );
    }
  };

  const handleChangeQuantityRange = (
    minQuantity: number | null,
    maxQuantity: number | null,
  ) => {
    if (
      minQuantity != null &&
      maxQuantity != null &&
      minQuantity < maxQuantity
    ) {
      dispatch(
        filterAsync({
          ...filter,
          minQuantity,
          maxQuantity,
          offset: 0,
        }),
      );
    }
  };

  const handleChangeDateRange = (
    postedAfter: Date | null,
    postedBefore: Date | null,
  ) => {
    if (postedAfter != null && postedBefore != null) {
      dispatch(
        filterAsync({
          ...filter,
          postedAfter: serializeDate(postedAfter),
          postedBefore: serializeDate(postedBefore),
          offset: 0,
        }),
      );
    }
  };

  return (
    <Menu
      mode="inline"
      items={[
        {
          key: 'all',
          label: 'All Categories',
          icon: <UnorderedListOutlined />,
          children: [
            {
              key: 'all-categories',
              label: 'All',
              onClick: () => handleCategoryChange(undefined),
            },
            ...(categories?.map((category: ICategory) => ({
              key: category?.id,
              label: category?.name,
              onClick: () => handleCategoryChange(category?.id),
            })) ?? []),
          ],
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
        {
          key: 'reset-filter',
          label: 'Reset Filter',
          icon: <RestOutlined />,
          onClick: () => {
            setMinPrice(null);
            setMaxPrice(null);
            setMinQuantity(null);
            setMaxQuantity(null);
            setPostedAfter(null);
            setPostedBefore(null);
            const order = filter.order;
            const sortBy = filter.sortBy;

            dispatch(
              filterAsync({
                keyword: undefined,
                shopId: undefined,
                category: undefined,
                brand: undefined,
                postedAfter: undefined,
                postedBefore: undefined,
                minPrice: undefined,
                maxPrice: undefined,
                minQuantity: undefined,
                maxQuantity: undefined,
                order,
                sortBy,
                offset: 0,
                limit: PRODUCTS_FILTER.ITEMS_PER_PAGE,
              }),
            );
          },
        },
      ]}
    />
  );
};
