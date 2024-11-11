import { Button, Select, Space, Typography } from 'antd';

export const SortOptions = () => {
  return (
    <Space
      direction="horizontal"
      style={{ backgroundColor: 'gray', padding: '16px', width: '100%' }}
    >
      <Typography.Text>Sort by</Typography.Text>
      <Button>Price</Button>
      <Button>Quantity</Button>
      <Select defaultValue="asc">
        <Select.Option value="asc">Ascending</Select.Option>
        <Select.Option value="desc">Descending</Select.Option>
      </Select>
    </Space>
  );
};
