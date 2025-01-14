import { Pagination } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../service/state/store';
import { PRODUCTS_FILTER } from '../../config/constants';
import { filterAsync } from '../../service/state/actions/filter-action';

export const PaginationProduct = () => {
  const dispatch = useDispatch<AppDispatch>();
  const totalItems = useSelector(
    (state: RootState) => state.filters.totalItems,
  );
  const currentPage = useSelector(
    (state: RootState) =>
      state.filters.filter.offset / PRODUCTS_FILTER.ITEMS_PER_PAGE + 1,
  );
  const filter = useSelector((state: RootState) => state.filters.filter);

  return (
    <Pagination
      total={totalItems}
      current={currentPage}
      pageSize={PRODUCTS_FILTER.ITEMS_PER_PAGE}
      showSizeChanger={false}
      showQuickJumper={true}
      onChange={(page: number, pageSize: number) => {
        dispatch(
          filterAsync({
            ...filter,
            offset: (page - 1) * pageSize,
            limit: pageSize,
          }),
        );
      }}
    />
  );
};
