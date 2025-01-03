import React, { useEffect, useState } from 'react';
import { useReturn, useUpdateReturnSlip } from '../../service/hooks/useReturn';
import { IReturnSlip, ReturnStatus } from '../../interfaces/Order/IReturnSlip';
import { getColorStatusReturn } from '../../utils/getColorStatusReturn';
import { Button, DatePicker, Menu, message, Spin, Table, Tag } from 'antd';
import { stringToISOString } from '../../utils/date-convert';
import './ReturnRequest.css';
import ReturnRequestModal from './ReturnRequestsDetail';

const ManageReturnSlips: React.FC = () => {
  const [startDate, setStartDate] = useState<string | undefined>('');
  const [endDate, setEndDate] = useState<string | undefined>('');
  const [startDateTemp, setStartDateTemp] = useState<string | undefined>('');
  const [endDateTemp, setEndDateTemp] = useState<string | undefined>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentStatus, setCurrentStatus] = useState<string>('');
  const [filteredOrders, setFilteredOrders] = useState<string>('all');
  const [total, setTotal] = useState<number>(0);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const { data, isLoading, refetch } = useReturn({
    shopId: parseInt(localStorage.getItem('userId') || '0'),
    order: 'desc',
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    status: currentStatus,
    postAfter: startDate,
    postBefore: endDate,
  });

  const updateReturnSlipMutation = useUpdateReturnSlip();

  const [reason, setReason] = useState<string>('');

  const handleUpdateStatus = async (newStatus: ReturnStatus) => {
    if (selectedReturnSlip && reason.trim()) {
      updateReturnSlipMutation.mutate({
        returnId: selectedReturnSlip.returnId,
        status: newStatus,
        reason: reason,
      });
      setTimeout(() => {
        refetch();
      }, 3000);
      message.success('Update return request successful!');
      setIsUpdating(false);
      handleCloseModal();
    } else {
      message.error('Update return request failed!');
    }
  };

  useEffect(() => {
    changeFilteredOrders();
    setTotal(data?.count || 0);
    refetch();
  }, [filteredOrders, data]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReturnSlip, setSelectedReturnSlip] =
    useState<IReturnSlip | null>(null);

  const handleOpenModal = (returnSlip: IReturnSlip) => {
    setSelectedReturnSlip(returnSlip);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setSelectedReturnSlip(null);
    setReason('');
    setModalVisible(false);
  };

  const changeFilteredOrders = () => {
    if (filteredOrders === 'all') {
      setCurrentStatus('');
    } else if (filteredOrders === 'pending') {
      setCurrentStatus('PENDING');
    } else if (filteredOrders === 'accepted') {
      setCurrentStatus('ACCEPTED');
    } else if (filteredOrders === 'dismissed') {
      setCurrentStatus('DISMISSED');
    }
  };
  const menuItems = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'dismissed', label: 'Dismissed' },
    { key: 'accepted', label: 'Accepted' },
  ];

  const columns = [
    {
      title: '#',
      render: (_: any, __: IReturnSlip, index: number) => index + 1,
      key: 'index',
    },
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: ReturnStatus) => {
        return <Tag color={getColorStatusReturn(status)}>{status}</Tag>;
      },
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, returnSlipItem: IReturnSlip) => {
        if (returnSlipItem.status === ReturnStatus.PENDING) {
          return (
            <div>
              <Button
                type="default"
                danger
                onClick={() => handleOpenModal(returnSlipItem)}
              >
                Solve
              </Button>
            </div>
          );
        }
        return (
          <div>
            <Button
              type="default"
              onClick={() => handleOpenModal(returnSlipItem)}
            >
              View
            </Button>
          </div>
        );
      },
    },
  ];

  const handleChangeDateRange = () => {
    if (startDateTemp && endDateTemp) {
      setStartDate(stringToISOString(startDateTemp || ''));
      setEndDate(stringToISOString(endDateTemp || ''));
      setCurrentPage(1);
      setFilteredOrders('all');
      setCurrentStatus('');
    }
  };

  return (
    <>
      <div style={{ padding: '30px', color: 'black' }}>
        <h1
          style={{
            textAlign: 'left',
            marginLeft: '10px',
            marginBottom: '10px',
          }}
        >
          List return slips
        </h1>
        <hr />
        <div style={{ marginTop: '40px' }}>
          <div style={{ display: 'flex', marginBottom: '20px' }}>
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
            selectedKeys={[filteredOrders]}
            onClick={(e) => {
              setCurrentPage(1);
              setFilteredOrders(e.key);
            }}
            items={menuItems}
          />
          <Spin spinning={isLoading} tip="Loading return slips...">
            <Table
              dataSource={data?.items}
              columns={columns}
              rowKey="orderId"
              style={{ marginTop: '16px' }}
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                total: total,
                onChange: async (page, size) => {
                  setCurrentPage(page);
                  setPageSize(size);
                },
              }}
            />
          </Spin>
        </div>

        {selectedReturnSlip && (
          <ReturnRequestModal
            visible={modalVisible}
            returnSlip={selectedReturnSlip}
            onClose={handleCloseModal}
            reason={reason}
            setReason={setReason}
            acceptReturn={() => handleUpdateStatus(ReturnStatus.ACCEPTED)}
            dismissReturn={() => handleUpdateStatus(ReturnStatus.DISMISSED)}
            isSubmitting={false}
            isLoading={isUpdating}
            setIsLoading={setIsUpdating}
          />
        )}
      </div>
    </>
  );
};

export default ManageReturnSlips;
