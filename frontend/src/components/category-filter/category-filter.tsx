import { Menu } from 'antd';
import { UnorderedListOutlined } from '@ant-design/icons';
import { RootState } from '../../service/state/store';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { ICategory } from '../../interfaces/ICategory';
import { setFilter } from '../../service/state/slices/filter-slice';

export const CategoryFilter = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.filters);
  const categories = useSelector((state: RootState) => state.categories.items);

  const handleCategoryChange = useCallback(
    (key: number) => {
      dispatch(
        setFilter({
          ...filters,
          category: key,
          limit: 24,
        }),
      );
    },
    [filters, dispatch],
  );

  return (
    <Menu
      mode="inline"
      onClick={({ key }) => handleCategoryChange(parseInt(key))}
      items={[
        {
          key: 'all',
          label: 'All Categories',
          icon: <UnorderedListOutlined />,
          children: categories.map((category: ICategory) => ({
            key: category.id,
            label: category.name,
          })),
        },
      ]}
    />
  );
};
