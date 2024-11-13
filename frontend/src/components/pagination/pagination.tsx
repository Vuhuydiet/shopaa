import { Pagination } from 'antd';

export const PaginationProduct = () => {
  return (
    <Pagination
      total={120}
      current={1}
      pageSize={24}
      showSizeChanger = {false}
      showQuickJumper = {true}
      onChange={(page, pageSize) => {}}
    />
  );
};
