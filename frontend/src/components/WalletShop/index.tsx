import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Tag } from 'antd';

const { Option } = Select;
const { Search } = Input;

const ShopWithdraw: React.FC = () => {
  const [data, setData] = useState([
    {
      id: 'REQ123',
      amount: 500,
      date: '2024-12-01',
      method: 'Bank',
      status: 'Pending',
    },
    {
      id: 'REQ124',
      amount: 300,
      date: '2024-12-10',
      method: 'E-wallet',
      status: 'Success',
    },
  ]);

  const [filteredData, setFilteredData] = useState(data);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const columns = [
    { title: 'Request ID', dataIndex: 'id', key: 'id' },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (text: number) => `${text} USD`,
    },
    { title: 'Request date', dataIndex: 'date', key: 'date' },
    { title: 'Method', dataIndex: 'method', key: 'method' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag
          color={
            status === 'Pending'
              ? 'orange'
              : status === 'Success'
                ? 'green'
                : 'red'
          }
        >
          {status}
        </Tag>
      ),
    },
  ];

  const handleCreateRequest = (values: any) => {
    const newRequest = {
      ...values,
      id: `REQ${Date.now()}`,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
    };
    setData([...data, newRequest]);
    setFilteredData([...data, newRequest]);
    setIsModalVisible(false);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    filterData(value, statusFilter);
  };

  const handleFilterStatus = (value: string) => {
    setStatusFilter(value);
    filterData(searchTerm, value);
  };

  const filterData = (search: string, status: string) => {
    const filtered = data.filter(
      (item) =>
        (item.id.toLowerCase().includes(search.toLowerCase()) ||
          item.method.toLowerCase().includes(search.toLowerCase())) &&
        (status ? item.status === status : true),
    );
    setFilteredData(filtered);
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
        style={{ marginBottom: 20, display: 'flex', gap: 10, marginTop: 30 }}
      >
        <Search
          placeholder="Search by ID or method"
          onSearch={handleSearch}
          allowClear
          style={{ width: 300 }}
        />
        <Select
          placeholder="Filter by status"
          style={{ width: 200 }}
          onChange={handleFilterStatus}
          allowClear
        >
          <Option value="Pending">Pending</Option>
          <Option value="Success">Success</Option>
          <Option value="Rejected">Rejected</Option>
        </Select>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Create new request
        </Button>
      </div>
      <Table dataSource={filteredData} columns={columns} rowKey="id" />

      <Modal
        title="Create new withdraw request"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleCreateRequest}>
          <Form.Item
            label="Amount"
            name="amount"
            rules={[{ required: true, message: 'Please enter amount' }]}
          >
            <Input type="number" placeholder="Enter amount" />
          </Form.Item>
          <Form.Item
            label="Phương thức rút tiền"
            name="method"
            rules={[{ required: true, message: 'Vui lòng chọn phương thức' }]}
          >
            <Select placeholder="Chọn phương thức">
              <Option value="Bank">Bank</Option>
              <Option value="E-wallet">E-wallet</Option>
            </Select>
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Send request
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default ShopWithdraw;
