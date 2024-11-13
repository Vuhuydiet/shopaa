import { Pagination } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../service/state/store';
import { setPagination } from '../../service/state/slices/pagination-slice';
import { useEffect } from 'react';
import { setFilter } from '../../service/state/slices/filter-slice';

export const PaginationProduct = () => {
  const { totalItems, currentPage, itemsPerPage } = useSelector(
    (state: RootState) => state.pagination,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setFilter({ offset: (currentPage - 1) * itemsPerPage }));
  }, [currentPage, currentPage, itemsPerPage, dispatch]);

  return (
    <Pagination
      total={totalItems}
      current={currentPage}
      pageSize={itemsPerPage}
      showSizeChanger={false}
      showQuickJumper={true}
      onChange={(page, pageSize) => {
        dispatch(setPagination({ currentPage: page, itemsPerPage: pageSize }));
      }}
    />
  );
};
