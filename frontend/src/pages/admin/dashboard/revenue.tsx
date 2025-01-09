import { Key, useMemo, useState } from 'react';
import {
  Table,
  Card,
  Typography,
  Tag,
  Input,
  Space,
  Button,
  Select,
} from 'antd';
import {
  ShopOutlined,
  DollarOutlined,
  SearchOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { FilterDropdownProps } from 'antd/lib/table/interface';
import { useRevenue } from '../../../service/hooks/useRevenue';
import { formatCurrency } from '../../../utils/format-number';

const { Title } = Typography;

const RevenueTable = () => {
  const { setYear, revenues } = useRevenue();

  const [sortedInfo, setSortedInfo] = useState({
    columnKey: '',
    order: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const currentYear = useMemo(() => {
    return new Date().getFullYear();
  }, []);

  const handleReset = () => {
    setSortedInfo({
      columnKey: '',
      order: '',
    });
    setCurrentPage(1);
  };

  const getColumnSearchProps = (dataIndex: string) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: FilterDropdownProps) => (
      <div style={{ padding: 8 }}>
        <Input
          autoFocus
          placeholder={`Search Shop Name`}
          value={selectedKeys[0]}
          onChange={(e) => {
            setSelectedKeys(e.target.value ? [e.target.value] : []);
            confirm({ closeDropdown: false });
          }}
          onPressEnter={() => confirm()}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => {
              setSelectedKeys([]);
              clearFilters?.();
              confirm();
            }}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value: string, record: any) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : '',
  });

  const columns: any = [
    {
      title: 'ID',
      dataIndex: 'shopOwnerId',
      key: 'shopOwnerId',
      width: '10%',
      sorter: (a: any, b: any) => a.shopOwnerId - b.shopOwnerId,
      sortOrder: sortedInfo.columnKey === 'shopOwnerId' && sortedInfo.order,
      render: (id: any) => <Tag color="blue">{id}</Tag>,
    },
    {
      title: 'Shop Name',
      dataIndex: 'shopName',
      key: 'shopName',
      width: '30%',
      ...getColumnSearchProps('shopName'),
      sorter: (a: any, b: any) => a.shopName.localeCompare(b.shopName),
      sortOrder: sortedInfo.columnKey === 'shopName' && sortedInfo.order,
      render: (name: any) => (
        <span>
          <ShopOutlined style={{ marginRight: 8, color: '#1890ff' }} />
          {name}
        </span>
      ),
    },
    {
      key: 'month',
      title: 'Month',
      width: '25%',
      dataIndex: 'month',
      render: (_: any, record: any) => (
        <span>
          Month {record.month}/{record.year}
        </span>
      ),
      filters: Array.from({ length: 12 }, (_, i) => ({
        text: `Month ${i + 1}`,
        value: (i + 1).toString(),
      })),
      onFilter: (value: any, record: any) => record.month === value,
    },
    {
      title: 'Revenue',
      dataIndex: 'totalRevenue',
      key: 'totalRevenue',
      width: '35%',
      sorter: (a: any, b: any) => a.totalRevenue - b.totalRevenue,
      sortOrder: sortedInfo.columnKey === 'totalRevenue' && sortedInfo.order,
      render: (revenue: any) => (
        <span style={{ color: '#52c41a', fontWeight: 'bold' }}>
          {formatCurrency(revenue)}
        </span>
      ),
    },
  ];

  const handleChange = (pagination: any, _: any, sorter: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
    setSortedInfo(sorter);
  };

  const paginationConfig = {
    current: currentPage,
    pageSize: pageSize,
    total: revenues?.length,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: any) => `Total ${total} records`,
    pageSizeOptions: ['5', '10', '20', '50'],
    locale: {
      items_per_page: '/ page',
      jump_to: 'Jump to',
      page: '',
      prev_page: 'Previous page',
      next_page: 'Next page',
    },
  };

  return (
    <Card
      style={{
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        margin: '24px',
      }}
    >
      <Space
        style={{
          marginBottom: 16,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
          <DollarOutlined style={{ marginRight: 12 }} />
          Report Revenue
        </Title>
        <Space>
          <Select
            defaultValue={currentYear}
            placeholder="Year"
            onChange={(value) => setYear(value)}
          >
            <Select.Option value={currentYear}>{currentYear}</Select.Option>
            <Select.Option value={currentYear - 1}>
              {currentYear - 1}
            </Select.Option>
            <Select.Option value={currentYear - 2}>
              {currentYear - 2}
            </Select.Option>
            <Select.Option value={currentYear - 3}>
              {currentYear - 3}
            </Select.Option>
            <Select.Option value={currentYear - 4}>
              {currentYear - 4}
            </Select.Option>
          </Select>
          <Button onClick={handleReset} icon={<ReloadOutlined />}>
            Reset filters
          </Button>
        </Space>
      </Space>

      <Table
        columns={columns}
        dataSource={revenues}
        rowKey="shopOwnerId"
        pagination={paginationConfig}
        bordered
        style={{ marginTop: 16 }}
        onChange={handleChange}
      />
    </Card>
  );
};

export default RevenueTable;
