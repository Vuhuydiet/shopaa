import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, message, DatePicker, Menu, Spin } from 'antd';
import { createWithdrawHistory } from '../../service/withdrawService';
import { IWithdraw } from '../../interfaces/IWithDraw';
import { formatDateString } from '../../utils/formatDateString';
import DetailRequestModal from './RequestDetail';
import { useWithdraw } from '../../service/api/useWithdraw';
import { stringToISOString } from '../../utils/date-convert';

const AdminWithdraw: React.FC = () => {
  const [startDate, setStartDate] = useState<string | undefined>('');
  const [endDate, setEndDate] = useState<string | undefined>('');
  const [startDateTemp, setStartDateTemp] = useState<string | undefined>('');
  const [endDateTemp, setEndDateTemp] = useState<string | undefined>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentStatus, setCurrentStatus] = useState<string>('');
  const [filteredRequest, setFilteredRequest] = useState<string>('all');

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(
    null,
  );

  const { data, isLoading, refetch } = useWithdraw({
    order: 'desc',
    status: currentStatus,
    postAfter: startDate,
    postBefore: endDate,
  });

  useEffect(() => {
    changeFilteredRequest();
    refetch();
  }, [filteredRequest, data]);

  const changeFilteredRequest = () => {
    if (filteredRequest === 'all') {
      setCurrentStatus('');
    } else if (filteredRequest === 'accepted') {
      setCurrentStatus('ACCEPTED');
    } else if (filteredRequest === 'dismissed') {
      setCurrentStatus('DISMISSED');
    }
  };
  const menuItems = [
    { key: 'all', label: 'All' },
    { key: 'dismissed', label: 'Dismissed' },
    { key: 'accepted', label: 'Accepted' },
  ];

  const handleChangeDateRange = () => {
    if (startDateTemp && endDateTemp) {
      setStartDate(stringToISOString(startDateTemp || ''));
      setEndDate(stringToISOString(endDateTemp || ''));
      setCurrentPage(1);
      setFilteredRequest('all');
      setCurrentStatus('');
    }
  };

  const columns = [
    {
      title: '#',
      render: (_: any, __: IWithdraw, index: number) => index + 1,
      key: 'index',
    },
    { title: 'Request ID', dataIndex: 'requestId', key: 'id' },
    { title: 'Shop ID', dataIndex: 'shopId', key: 'shopId' },
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
    {
      title: '',
      key: 'action',
      render: (_: any, record: any) => (
        <Button onClick={() => handleViewDetails(record.requestId)}>
          Detail
        </Button>
      ),
    },
  ];

  const handleViewDetails = (record: any) => {
    setSelectedRequestId(record);
    setIsModalVisible(true);
  };
  const handleUpdateStatus = async (
    requestId: number,
    status: string,
    note: string,
  ) => {
    console.log('Update request:', { requestId, status, note });
    const data = {
      status: status.toLocaleUpperCase(),
      note,
    };
    try {
      const response = await createWithdrawHistory(requestId, data);
      console.log('response:', response);
      setTimeout(() => {
        refetch();
      }, 3000);
      message.success('Update status successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      message.error('Failed to update status');
    }
  };

  const paginationConfig = {
    current: currentPage,
    pageSize: pageSize,
    total: data?.count,
    onChange: (page: any, pageSize: any) => {
      setCurrentPage(page);
      setPageSize(pageSize);
    },
    showSizeChanger: true,
    pageSizeOptions: ['3', '5', '10'],
  };

  return (
    <div style={{ padding: '30px', color: 'black' }}>
      <h2
        style={{
          textAlign: 'left',
          marginLeft: '10px',
          marginBottom: '10px',
        }}
      >
        List request withdraw from shop
      </h2>
      <hr />
      <div style={{ marginTop: '40px' }}>
        <div
          style={{ display: 'flex', marginBottom: '20px', marginTop: '20px' }}
        >
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

        <Menu
          mode="horizontal"
          selectedKeys={[filteredRequest]}
          onClick={(e) => {
            setCurrentPage(1);
            setFilteredRequest(e.key);
          }}
          items={menuItems}
        />
        <Spin spinning={isLoading} tip="Loading data...">
          <Table
            dataSource={data?.items}
            columns={columns}
            rowKey="requestId"
            pagination={paginationConfig}
          />
        </Spin>
      </div>

      <DetailRequestModal
        requestId={selectedRequestId}
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};

export default AdminWithdraw;
