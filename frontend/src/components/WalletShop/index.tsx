import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Tag,
  message,
  DatePicker,
} from 'antd';
import {
  createWithdrawRequest,
  getWithdrawForShop,
} from '../../service/withdrawService';
import { getShop } from '../../service/shopService';
import { WalletFilled } from '@ant-design/icons';
import { IWithdraw } from '../../interfaces/IWithDraw';
import { formatDateString } from '../../utils/formatDateString';
import { stringToISOString } from '../../utils/date-convert';

const { Option } = Select;

const ShopWithdraw: React.FC = () => {
  const [shopInfo, setShopInfo] = useState<any>(null);
  const [data, setData] = useState<any>([]);

  const [startDate, setStartDate] = useState<string | undefined>('');
  const [endDate, setEndDate] = useState<string | undefined>('');
  const [startDateTemp, setStartDateTemp] = useState<string | undefined>('');
  const [endDateTemp, setEndDateTemp] = useState<string | undefined>('');

  const sortDataByCreatedAt = (data: IWithdraw[]) => {
    return data.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
  };
  const fetchData = async () => {
    const rs = await getWithdrawForShop();
    setData(sortDataByCreatedAt(rs));
    setFilteredData(sortDataByCreatedAt(rs));
  };

  useEffect(() => {
    const fetchDataShop = async () => {
      try {
        const rs = await getShop(
          parseInt(localStorage.getItem('userId') || ''),
          localStorage.getItem('token') || '',
        );

        setShopInfo(rs);
      } catch (error) {
        console.error('Error fetching shop info:', error);
      }
    };
    fetchDataShop();
    fetchData();
  }, []);
  const [filteredData, setFilteredData] = useState(data);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');

  const columns = [
    {
      title: '#',
      render: (_: any, __: IWithdraw, index: number) => index + 1,
      key: 'index',
    },
    { title: 'Request ID', dataIndex: 'requestId', key: 'id' },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (text: number) => `$ ${text}`,
    },
    {
      title: 'Create Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => {
        return formatDateString(text);
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string | undefined) => {
        const currentStatus = status || 'PENDING';

        const color =
          currentStatus === 'PENDING'
            ? 'orange'
            : currentStatus === 'ACCEPTED'
              ? 'green'
              : currentStatus === 'DISMISSED'
                ? 'red'
                : 'default';

        return <Tag color={color}>{currentStatus}</Tag>;
      },
    },
  ];

  const handleCreateRequest = async (values: any) => {
    const { amount } = values;
    if (amount < 1) {
      return;
    }

    try {
      await createWithdrawRequest({ amount });
      message.success('Withdraw request created successfully');
    } catch (error) {
      console.error('Error creating withdraw request:', error);
      message.error('Error creating withdraw request');
    }
    await fetchData();
    setIsModalVisible(false);
  };

  const handleFilterStatus = (value: string) => {
    setStatusFilter(value);
    filterData(value);
  };
  const handleChangeDateRange = () => {
    if (startDateTemp && endDateTemp) {
      setStartDate(stringToISOString(startDateTemp || ''));
      setEndDate(stringToISOString(endDateTemp || ''));
      filterData(statusFilter, startDate, endDate);
    }
  };

  const filterData = (status: string, startDate?: string, endDate?: string) => {
    console.log(
      'status:',
      status,
      'startDate:',
      startDate,
      'endDate:',
      endDate,
    );

    const filtered = data.filter((item: IWithdraw) => {
      const statusMatch =
        status === 'PENDING'
          ? item.status === undefined
          : status
            ? item.status === status
            : true;

      const date = new Date(item.createdAt);
      const startMatch = startDate ? date >= new Date(startDate) : true;
      const endMatch = endDate ? date <= new Date(endDate) : true;

      return statusMatch && startMatch && endMatch;
    });

    setFilteredData(filtered);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const paginationConfig = {
    current: currentPage,
    pageSize: pageSize,
    total: filteredData.length,
    onChange: (page: any, pageSize: any) => {
      setCurrentPage(page);
      setPageSize(pageSize);
    },
    showSizeChanger: true,
    pageSizeOptions: ['3', '5', '10'],
  };

  return (
    <div style={{ padding: '30px', color: 'black' }}>
      <h1
        style={{
          textAlign: 'left',
          marginLeft: '10px',
          marginBottom: '10px',
        }}
      >
        Wallet shop
      </h1>
      <hr />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 20,
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 10,
            alignItems: 'center',
            fontSize: '1.2rem',
          }}
        >
          <WalletFilled style={{ color: 'green' }} />
          <p>Balance: $ {shopInfo?.bankBalance}</p>
        </div>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Create new request
        </Button>
      </div>
      <div
        style={{
          marginBottom: '20px',
          marginTop: '20px',
        }}
      >
        <div style={{ display: 'flex' }}>
          <div style={{ marginRight: '10px' }}>
            <label style={{ marginRight: '10px' }}>From:</label>
            <DatePicker
              placeholder="Start Date"
              value={startDateTemp || ''}
              onChange={(date: any) => setStartDateTemp(date)}
            />
          </div>
          <div style={{ marginRight: '10px' }}>
            <label style={{ marginRight: '10px' }}>To:</label>
            <DatePicker
              placeholder="End Date"
              value={endDateTemp || ''}
              onChange={(date: any) => setEndDateTemp(date)}
            />
          </div>
          <Button
            type="primary"
            style={{ marginRight: '10px' }}
            onClick={() => handleChangeDateRange()}
          >
            Apply
          </Button>
          <Button
            type="default"
            onClick={() => {
              setEndDate('');
              setStartDate('');
              setStartDateTemp('');
              setEndDateTemp('');
            }}
          >
            Clear
          </Button>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 10,
            marginTop: 20,
            alignItems: 'center',
          }}
        >
          <label>Filter by status:</label>
          <Select
            placeholder="Filter by status"
            style={{ width: 200 }}
            onChange={handleFilterStatus}
            allowClear
          >
            <Option value="PENDING" style={{ color: 'orange' }}>
              PENDING
            </Option>
            <Option value="ACCEPTED" style={{ color: 'green' }}>
              ACCEPTED
            </Option>
            <Option value="DISMISSED" style={{ color: 'red' }}>
              DISMISSED
            </Option>
          </Select>
        </div>
      </div>
      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey="requestId"
        pagination={paginationConfig}
      />

      <Modal
        title=""
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        centered // Căn giữa modal theo cả chiều ngang và dọc
      >
        <Form layout="vertical" onFinish={handleCreateRequest}>
          <h2 style={{ textAlign: 'center', marginBottom: 20 }}>
            Create new withdraw request
          </h2>
          <div style={{ marginBottom: 20, textAlign: 'center' }}>
            <p>Current balance: $ {shopInfo?.bankBalance}</p>
          </div>
          <Form.Item
            label="Amount"
            name="amount"
            rules={[
              { required: true, message: 'Please enter amount' },
              {
                validator: (_, value) => {
                  if (value === undefined || value === null) {
                    return Promise.resolve();
                  }
                  if (value <= 0) {
                    return Promise.reject(
                      new Error('Amount must be greater than 0'),
                    );
                  }
                  if (value > shopInfo?.bankBalance) {
                    return Promise.reject(
                      new Error('Amount cannot exceed current balance'),
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input type="number" placeholder="Enter amount" />
          </Form.Item>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 50,
            }}
          >
            <Button onClick={() => setIsModalVisible(false)}>Close</Button>
            <Button type="primary" htmlType="submit">
              Send request
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ShopWithdraw;
