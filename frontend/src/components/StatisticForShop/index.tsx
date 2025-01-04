import { useEffect } from 'react';
import {
  getOrderStatusByYear,
  getProductRevenueByYear,
  getRevenueByYear,
} from '../../service/statisticService';

import React, { useState } from 'react';
import { Table, Tabs, Select, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  ResponsiveContainer,
} from 'recharts';
import {
  IOrderStatsData,
  IProductStatsData,
  IRevenueData,
} from '../../interfaces/IStatisticOfShop';
import { getOrderStatusColor } from '../../utils/getColorStatusOrder';
import { OrderStatus } from '../../interfaces/Order/OrderEnums';

const { TabPane } = Tabs;
const { Option } = Select;

const StatisticForShop: React.FC = () => {
  const [revenueData, setRevenueData] = useState<IRevenueData[]>([]);
  const [productData, setProductData] = useState<IProductStatsData[]>([]);
  const [orderData, setOrderData] = useState<IOrderStatsData[]>([]);

  const fetchData = async (year: number) => {
    const revenueDataTemp = await getRevenueByYear(year);
    const productDataTemp = await getProductRevenueByYear(year);
    const orderDataTemp = await getOrderStatusByYear(year);
    setRevenueData(revenueDataTemp || []);
    setProductData(productDataTemp || []);
    setOrderData(orderDataTemp || []);
  };
  useEffect(() => {
    fetchData(parseInt(selectedYear));
  }, []);
  const [selectedYear, setSelectedYear] = useState('2024');

  const currentMonth = new Date().getMonth() + 1;

  const [selectedProductMonth, setSelectedProductMonth] =
    useState<number>(currentMonth);
  const [selectedOrderMonth, setSelectedOrderMonth] =
    useState<number>(currentMonth);

  const handleYearChange = (value: string) => {
    setSelectedYear(value);
    fetchData(parseInt(value));
  };

  const filteredRevenueData = revenueData.filter(
    (item) => item.year === selectedYear,
  );

  const filteredProductData = productData.filter(
    (item) =>
      item.year === selectedYear &&
      (!selectedProductMonth || item.month === selectedProductMonth.toString()),
  );

  const filteredOrderData = orderData.filter(
    (item) =>
      item.year === selectedYear &&
      (!selectedOrderMonth || item.month === selectedOrderMonth.toString()),
  );

  const revenueColumns: ColumnsType<IRevenueData> = [
    { title: 'Month', dataIndex: 'month', key: 'month' },
    { title: 'Total Revenue', dataIndex: 'totalRevenue', key: 'totalRevenue' },
  ];

  const productColumns: ColumnsType<IProductStatsData> = [
    { title: 'Month', dataIndex: 'month', key: 'month' },
    { title: 'Product Name', dataIndex: 'productName', key: 'productName' },
    { title: 'Total Revenue', dataIndex: 'totalRevenue', key: 'totalRevenue' },
  ];

  const orderColumns: ColumnsType<IOrderStatsData> = [
    { title: 'Month', dataIndex: 'month', key: 'month' },
    {
      title: 'Order Status',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      render: (status: OrderStatus) => {
        return <Tag color={getOrderStatusColor(status)}>{status}</Tag>;
      },
    },
    { title: 'Total Orders', dataIndex: 'totalOrder', key: 'totalOrder' },
  ];
  const sortedRevenueData = [...filteredRevenueData].sort(
    (a, b) => Number(a.month) - Number(b.month),
  );

  const handleProductMonthChange = (value: number) => {
    setSelectedProductMonth(value);
  };

  const handleOrderMonthChange = (value: number) => {
    setSelectedOrderMonth(value);
  };

  return (
    <>
      <div style={{ padding: '30px 40px', color: 'black' }}>
        <h1
          style={{
            textAlign: 'left',
            marginLeft: '10px',
            marginBottom: '10px',
          }}
        >
          Statistic Shop
        </h1>
        <hr />
        <div style={{ marginTop: '40px' }}>
          <div
            style={{
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'start',
            }}
          >
            <span>Select Year: </span>
            <Select
              defaultValue={selectedYear}
              style={{ width: 200, marginLeft: 10 }}
              onChange={handleYearChange}
            >
              <Option value="2025">2025</Option>
              <Option value="2024">2024</Option>
              <Option value="2023">2023</Option>
              <Option value="2022">2022</Option>
            </Select>
          </div>

          <Tabs defaultActiveKey="1">
            <TabPane tab="Revenue Statistics" key="1" style={{ padding: 20 }}>
              {filteredRevenueData.length > 0 ? (
                <>
                  <div
                    style={{
                      width: '100%',
                      height: '400px',
                      margin: '0 auto',
                    }}
                  >
                    {' '}
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={sortedRevenueData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="totalRevenue"
                          stroke="#8884d8"
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div style={{ padding: '0 20px', marginTop: 20 }}>
                    <Table
                      columns={revenueColumns}
                      dataSource={filteredRevenueData}
                      rowKey={(record) =>
                        `${record.month}-${record.totalRevenue}`
                      }
                      pagination={false}
                    />
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', marginTop: 50 }}>
                  No data available for the selected filters.
                </div>
              )}
            </TabPane>

            <TabPane tab="Product Statistics" key="2" style={{ padding: 20 }}>
              <div
                style={{
                  marginBottom: 30,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'start',
                }}
              >
                <span>Select Month: </span>
                <Select
                  value={selectedProductMonth}
                  style={{ width: 200, marginLeft: 10 }}
                  onChange={handleProductMonthChange}
                >
                  {[...Array(12)].map((_, index) => (
                    <Option key={index + 1} value={index + 1}>
                      {new Date(0, index).toLocaleString('en-US', {
                        month: 'long',
                      })}
                    </Option>
                  ))}
                </Select>
              </div>
              {filteredProductData.length > 0 ? (
                <>
                  <div
                    style={{
                      width: '100%',
                      height: '400px',
                      margin: '0 auto',
                    }}
                  >
                    {' '}
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={filteredProductData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 50 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="productName"
                          angle={45}
                          textAnchor="start"
                          interval={0}
                          tickMargin={5}
                        />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="totalRevenue" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      marginTop: '10px',
                      marginBottom: '40px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginRight: '20px',
                      }}
                    >
                      <div
                        style={{
                          width: '15px',
                          height: '15px',
                          backgroundColor: '#82ca9d',
                          marginRight: '5px',
                        }}
                      ></div>
                      <span style={{ color: '#82ca9d' }}>totalRevenue</span>
                    </div>
                  </div>
                  <div style={{ padding: '0 20px', marginTop: 20 }}>
                    <Table
                      columns={productColumns}
                      dataSource={filteredProductData}
                      rowKey={(record) =>
                        `${record.month}-${record.productName}`
                      }
                      pagination={false}
                    />
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', marginTop: 50 }}>
                  No data available for the selected filters.
                </div>
              )}
            </TabPane>

            <TabPane tab="Order Statistics" key="3" style={{ padding: 10 }}>
              <div
                style={{
                  marginBottom: 30,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'start',
                }}
              >
                <span>Select Month: </span>
                <Select
                  value={selectedOrderMonth}
                  style={{ width: 200, marginLeft: 10 }}
                  onChange={handleOrderMonthChange}
                >
                  {[...Array(12)].map((_, index) => (
                    <Option key={index + 1} value={index + 1}>
                      {new Date(0, index).toLocaleString('en-US', {
                        month: 'long',
                      })}
                    </Option>
                  ))}
                </Select>
              </div>
              {filteredOrderData.length > 0 ? (
                <>
                  <div
                    style={{
                      width: '100%',
                      height: '400px',
                      margin: '0 auto',
                    }}
                  >
                    {' '}
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={filteredOrderData}
                        margin={{ top: 20, right: 20, bottom: 50, left: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="orderStatus"
                          angle={45}
                          textAnchor="start"
                          interval={0}
                          tickMargin={5}
                        />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="totalOrder" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      marginTop: '10px',
                      marginBottom: '40px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginRight: '20px',
                      }}
                    >
                      <div
                        style={{
                          width: '15px',
                          height: '15px',
                          backgroundColor: '#8884d8',
                          marginRight: '5px',
                        }}
                      ></div>
                      <span style={{ color: '#8884d8' }}>totalOrder</span>
                    </div>
                  </div>

                  <div style={{ padding: '0 20px' }}>
                    <Table
                      columns={orderColumns}
                      dataSource={filteredOrderData}
                      rowKey={(record) =>
                        `${record.month}-${record.orderStatus}`
                      }
                      pagination={false}
                    />
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', marginTop: 50 }}>
                  No data available for the selected filters.
                </div>
              )}
            </TabPane>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default StatisticForShop;
