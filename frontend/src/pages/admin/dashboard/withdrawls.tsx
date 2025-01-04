import { useMemo, useState } from 'react';
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
  DollarOutlined,
  SearchOutlined,
  ReloadOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { useWithdrawals } from '../../../service/hooks/useWithdrawals';

const { Title } = Typography;

const WithdrawalStatisticsTable = () => {
  const { setYear, withdrawals } = useWithdrawals();

  const [searchText, setSearchText] = useState('');
  const [filteredInfo, setFilteredInfo] = useState({});
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
    setFilteredInfo({});
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
      width: '25%',
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
      title: 'Total Withdrawal Amount',
      dataIndex: 'totalWithdrawalAmount',
      key: 'totalWithdrawalAmount',
      width: '25%',
      sorter: (a: any, b: any) =>
        a.totalWithdrawalAmount - b.totalWithdrawalAmount,
      sortOrder:
        sortedInfo.columnKey === 'totalWithdrawalAmount' && sortedInfo.order,
      render: (amount: any) => (
        <span style={{ color: '#52c41a', fontWeight: 'bold' }}>
          <DollarOutlined style={{ marginRight: 8 }} />
          {new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
          }).format(amount)}
        </span>
      ),
    },
    {
      title: 'Total Requests',
      dataIndex: 'totalRequests',
      key: 'totalRequests',
      width: '20%',
      sorter: (a: any, b: any) => a.totalRequests - b.totalRequests,
      sortOrder: sortedInfo.columnKey === 'totalRequests' && sortedInfo.order,
      render: (total: any) => (
        <span style={{ color: '#1890ff', fontWeight: 'bold' }}>
          <WalletOutlined style={{ marginRight: 8 }} />
          {total.toLocaleString()}
        </span>
      ),
    },
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
      width: '15%',
      filters: [
        { text: '2024', value: 2024 },
        { text: '2023', value: 2023 },
        { text: '2022', value: 2022 },
      ],
      onFilter: (value: any, record: any) => record.year === value,
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
    total: withdrawals?.length,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: any) => `Total ${total} shops`,
    pageSizeOptions: ['5', '10', '20', '50'],
    locale: {
      items_per_page: '/ page',
      jump_to: 'Jump to',
      page: '',
      prev_page: 'Previous page',
      next_page: 'Next page',
    },
  };

  const getTotalStats = () => {
    return withdrawals?.reduce(
      (acc, curr) => ({
        totalAmount: acc.totalAmount + curr.totalWithdrawalAmount,
        totalRequests: acc.totalRequests + curr.totalRequests,
      }),
      { totalAmount: 0, totalRequests: 0 },
    );
  };

  const totalStats = getTotalStats();

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
          <WalletOutlined style={{ marginRight: 12 }} />
          Withdrawal Statistics Report
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
        <Card size="small" style={{ marginRight: 8 }}>
          <Statistic
            title="Total Withdrawal Amount"
            value={totalStats.totalAmount}
            prefix={<DollarOutlined />}
            formatter={(value: any) =>
              new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
              }).format(value)
            }
          />
        </Card>
        <Card size="small">
          <Statistic
            title="Total Withdrawal Requests"
            value={totalStats.totalRequests}
            prefix={<WalletOutlined />}
            formatter={(value) => value.toLocaleString()}
          />
        </Card>
      </Space>

      <Table
        columns={columns}
        dataSource={withdrawals}
        rowKey={(record) => record.shopOwnerId}
        pagination={paginationConfig}
        bordered
        style={{ marginTop: 16 }}
        onChange={handleChange}
      />
    </Card>
  );
};

export default WithdrawalStatisticsTable;
