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
  Statistic,
} from 'antd';
import {
  ShopOutlined,
  OrderedListOutlined,
  SearchOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useOrderStatistics } from '../../../service/hooks/useOrderStatistics';

const { Title } = Typography;

const OrderStatisticsTable = () => {
  const { setYear, orderStatistics } = useOrderStatistics();

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

  const getStatusColor = (status: string) => {
    const statusColors = {
      PENDING: 'gold',
      CANCELED: 'red',
      ACCEPTED: 'blue',
      REJECTED: 'volcano',
      DELIVERING: 'purple',
      DELIVERED: 'geekblue',
      RECEIVED: 'cyan',
      COMPLETED: 'green',
      RETURNED: 'orange',
      RETURN_REQUESTED: 'magenta',
    };
    return statusColors[status] || 'default';
  };

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

  const getColumnSearchProps = (dataIndex: any) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: any) => (
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
    filterIcon: (filtered: any) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value: any, record: any) =>
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
      width: '10%',
      sorter: (a: any, b: any) => a.shopOwnerId - b.shopOwnerId,
      sortOrder: sortedInfo.columnKey === 'shopOwnerId' && sortedInfo.order,
      render: (id: any) => <Tag color="blue">{id}</Tag>,
    },
    {
      title: 'Shop Name',
      dataIndex: 'shopName',
      key: 'shopName',
      width: '20%',
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
      title: 'Status',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      width: '15%',
      filters: [
        'PENDING',
        'CANCELED',
        'ACCEPTED',
        'REJECTED',
        'DELIVERING',
        'DELIVERED',
        'RECEIVED',
        'COMPLETED',
        'RETURNED',
        'RETURN_REQUESTED',
      ].map((status) => ({ text: status, value: status })),
      onFilter: (value: any, record: any) => record.orderStatus === value,
      render: (status: any) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: 'Month',
      key: 'month',
      width: '15%',
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
      title: 'Total Orders',
      dataIndex: 'totalOrders',
      key: 'totalOrders',
      width: '15%',
      sorter: (a: any, b: any) => a.totalOrders - b.totalOrders,
      sortOrder: sortedInfo.columnKey === 'totalOrders' && sortedInfo.order,
      render: (total: any) => (
        <span style={{ color: '#1890ff', fontWeight: 'bold' }}>
          <OrderedListOutlined style={{ marginRight: 8 }} />
          {total}
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
    total: orderStatistics?.length,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: any) => `Total ${total} orders`,
    pageSizeOptions: ['5', '10', '20', '50'],
    locale: {
      items_per_page: '/ page',
      jump_to: 'Jump to',
      page: '',
      prev_page: 'Previous page',
      next_page: 'Next page',
    },
  };

  const getTotalOrdersByttus = (status: any) => {
    return orderStatistics
      ?.filter((item) => item.orderStatus === status)
      ?.reduce((acc, curr) => acc + curr.totalOrders, 0);
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
          <OrderedListOutlined style={{ marginRight: 12 }} />
          Order Statistics Report
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
          </Select>
          <Button onClick={handleReset} icon={<ReloadOutlined />}>
            Reset filters
          </Button>
        </Space>
      </Space>

      <Space style={{ marginBottom: 16 }} wrap>
        {[
          'PENDING',
          'COMPLETED',
          'CANCELED',
          'RETURNED',
          'RETURN_REQUESTED',
        ].map((status) => (
          <Card key={status} size="small" style={{ marginRight: 8 }}>
            <Statistic
              title={status}
              value={getTotalOrdersByttus(status)}
              prefix={<Tag color={getStatusColor(status)}>{status}</Tag>}
            />
          </Card>
        ))}
      </Space>

      <Table
        columns={columns}
        dataSource={orderStatistics}
        rowKey={(record) =>
          `${record.shopOwnerId}-${record.orderStatus}-${record.month}`
        }
        pagination={paginationConfig}
        bordered
        style={{ marginTop: 16 }}
        onChange={handleChange}
      />
    </Card>
  );
};

export default OrderStatisticsTable;
