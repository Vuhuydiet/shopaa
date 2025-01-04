import { Pagination } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../service/state/store';
import { setPagination } from '../../service/state/reducers/pagination-reducer';
import { useEffect } from 'react';
import { setFilter } from '../../service/state/reducers/filter-reducer';

export const PaginationProduct = () => {
  const { totalItems, currentPage, itemsPerPage } = useSelector(
    (state: RootState) => state.pagination,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setFilter({ offset: (currentPage - 1) * itemsPerPage }));
  }, [currentPage, itemsPerPage]);

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
