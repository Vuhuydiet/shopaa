import React, { useMemo, useState } from 'react';
import {
  Table,
  Card,
  Typography,
  Tag,
  Input,
  Space,
  Button,
  Select,
  Tooltip,
} from 'antd';
import {
  ShopOutlined,
  DollarOutlined,
  SearchOutlined,
  ReloadOutlined,
  TagOutlined,
} from '@ant-design/icons';
import { FilterDropdownProps } from 'antd/lib/table/interface';
import { useProductRevenue } from '../../../service/hooks/useProductRevenue';

const { Title } = Typography;

const ProductRevenueTable = () => {
  const { setYear, productRevenues } = useProductRevenue();

  const [searchText, setSearchText] = useState('');
  const [filteredInfo, setFilteredInfo] = useState({
    month: null,
  });
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
    setSearchText('');
    setFilteredInfo({
      month: null,
    });
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
          placeholder={`Search ${dataIndex}`}
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

  const columns = [
    {
      title: 'Shop ID',
      dataIndex: 'shopOwnerId',
      key: 'shopOwnerId',
      width: '8%',
      sorter: (a: any, b: any) => a.shopOwnerId - b.shopOwnerId,
      sortOrder: sortedInfo.columnKey === 'shopOwnerId' && sortedInfo.order,
      render: (id: any) => <Tag color="blue">{id}</Tag>,
    },
    {
      title: 'Shop Name',
      dataIndex: 'shopName',
      key: 'shopName',
      width: '15%',
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
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
      width: '30%',
      ...getColumnSearchProps('productName'),
      sorter: (a: any, b: any) => a.productName.localeCompare(b.productName),
      sortOrder: sortedInfo.columnKey === 'productName' && sortedInfo.order,
      render: (name: any) => (
        <Tooltip title={name}>
          <span>
            <TagOutlined style={{ marginRight: 8, color: '#722ed1' }} />
            {name.length > 50 ? `${name.substring(0, 50)}...` : name}
          </span>
        </Tooltip>
      ),
    },
    {
      key: 'month',
      title: 'Month',
      width: '12%',
      dataIndex: 'month',
      render: (_: any, record: any) => (
        <span>
          Month {record.month}/{record.year}
        </span>
      ),
      filters: Array.from({ length: 12 }, (_, i) => ({
        text: `Month ${i + 1}`,
        value: i + 1,
      })),
      onFilter: (value: string, record: any) => record.month === value,
    },
    {
      title: 'Revenue',
      dataIndex: 'totalRevenue',
      key: 'totalRevenue',
      width: '20%',
      sorter: (a: any, b: any) => a.totalRevenue - b.totalRevenue,
      sortOrder: sortedInfo.columnKey === 'totalRevenue' && sortedInfo.order,
      render: (revenue: any) => (
        <span style={{ color: '#52c41a', fontWeight: 'bold' }}>
          <DollarOutlined style={{ marginRight: 8 }} />
          {new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
          }).format(revenue)}
        </span>
      ),
    },
  ];

  const handleChange = (pagination: any, filters: any, sorter: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const paginationConfig = {
    current: currentPage,
    pageSize: pageSize,
    total: productRevenues.length,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: any) => `Total ${total} products`,
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
          Product Revenue Report
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
        dataSource={productRevenues}
        rowKey={(record) => `${record.shopOwnerId}-${record.productName}`}
        pagination={paginationConfig}
        bordered
        style={{ marginTop: 16 }}
        onChange={handleChange}
      />
    </Card>
  );
};

export default ProductRevenueTable;
