import { Descriptions, DescriptionsProps, Modal, Table } from 'antd';
import { ReportContext } from '../../context/ReportContext';
import { useContext } from 'react';

const shopDetail: DescriptionsProps['items'] = [
  {
    label: 'Shop ID',
    children: '1',
    span: { xs: 3, sm: 3, md: 1, lg: 1, xl: 1, xxl: 1 },
  },
  {
    label: 'Shop name',
    children: 'Dong Fang Ben Shi',
    span: { xs: 3, sm: 3, md: 2, lg: 2, xl: 2, xxl: 2 },
  },
  {
    label: 'Address',
    children: 'Tan Phu - Dakdjrang - Mang Yang - Gia Lai',
    span: 3,
  },
  {
    label: 'Banking balance',
    children: '$80000.00',
    span: { xs: 3, sm: 3, md: 3, lg: 1, xl: 1, xxl: 1 },
  },
  {
    label: 'Shop owner name',
    children: 'Tran Quang Tuyen',
    span: { xs: 3, sm: 3, md: 3, lg: 1, xl: 1, xxl: 1 },
  },
  {
    label: 'Phone number',
    children: '0988123782',
    span: { xs: 3, sm: 3, md: 3, lg: 1, xl: 1, xxl: 1 },
  },
  {
    label: 'Shop Description',
    children: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea eaque quis nobis
     qui accusantium ab veritatis rerum voluptates fugiat, perspiciatis consequuntur quaerat
     quae reprehenderit blanditiis praesentium fuga? Distinctio, totam corporis.`,
    span: 3,
  },
];

const productDetail: DescriptionsProps['items'] = [
  {
    label: 'Product ID',
    children: 1,
    span: { xs: 3, sm: 3, md: 1, lg: 1, xl: 1, xxl: 1 },
  },
  {
    label: 'Product name',
    children: 'Dong Fang Ben Shi Watch',
    span: { xs: 3, sm: 3, md: 2, lg: 2, xl: 1, xxl: 1 },
  },
  {
    label: 'Current price',
    children: '$80.00',
    span: { xs: 3, sm: 3, md: 1, lg: 1, xl: 1, xxl: 1 },
  },
  {
    label: 'Original price',
    children: '$100.00',
    span: { xs: 3, sm: 3, md: 2, lg: 1, xl: 1, xxl: 1 },
  },
  {
    label: 'Quantity',
    children: 100654,
    span: { xs: 3, sm: 3, md: 1, lg: 1, xl: 1, xxl: 1 },
  },
  {
    label: 'Published at',
    children: '2021-08-01T00:00:00Z',
    span: { xs: 3, sm: 3, md: 2, lg: 1, xl: 1, xxl: 1 },
  },
  {
    label: 'Brand',
    span: { xs: 3, sm: 3, md: 1, lg: 1, xl: 1, xxl: 1 },
    children: 'Gucci',
  },
  {
    label: 'Material',
    span: { xs: 3, sm: 3, md: 2, lg: 1, xl: 2, xxl: 2 },
    children: 'Leather',
  },
  {
    label: 'Product Description',
    span: 3,
    children: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea eaque quis nobis`,
  },
];

const reportResult: DescriptionsProps['items'] = [
  {
    label: 'Reporter ID',
    children: 1,
    span: { xs: 3, sm: 3, md: 1, lg: 1, xl: 1, xxl: 1 },
  },
  {
    label: 'Created At',
    children: '2018-04-24 18:00:00',
    span: { xs: 3, sm: 3, md: 2, lg: 2, xl: 2, xxl: 2 },
  },
  {
    label: 'Reporter Role',
    children: 'Shop Manager',
    span: { xs: 3, sm: 3, md: 3, lg: 1, xl: 1, xxl: 1 },
  },
  {
    label: 'Reporter Name',
    children: 'Tran Quang Tuyen',
    span: { xs: 3, sm: 3, md: 3, lg: 1, xl: 1, xxl: 1 },
  },
  {
    label: 'Phone number',
    children: '0988123782',
    span: { xs: 3, sm: 3, md: 2, lg: 1, xl: 1, xxl: 1 },
  },
  {
    label: 'Result',
    children: 'accepted',
    span: { xs: 3, sm: 3, md: 1, lg: 1, xl: 1, xxl: 1 },
  },
];

export const ReportTable = () => {
  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Report ID',
      children: '1',
    },
    {
      key: '2',
      label: 'Reporter ID',
      children: '10',
    },
    {
      key: '3',
      label: 'Created At',
      children: '2018-04-24 18:00:00',
      span: { xs: 4, sm: 4, md: 1, lg: 1, xl: 1, xxl: 1 },
    },
    {
      key: '5',
      label: 'Type',
      children: 'shop',
    },
    {
      key: '6',
      label: 'Category',
      children: 'fake',
      span: 2,
    },
    {
      key: '4',
      label: 'Description',
      span: 4,
      children:
        'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Alias a aliquam optio, odio provident beatae, repellat eos totam enim iste quisquam! Nesciunt nobis non distinctio enim soluta, odit ullam? At!',
    },
    {
      key: '7',
      label: 'Reportee',
      children: <Descriptions items={productDetail} />,
      span: 4,
    },
    {
      key: '8',
      label: 'Result',
      children: <Descriptions items={reportResult} />,
      span: 4,
    },
  ];

  const { reports, isLoading, isOpenModal, columnReport, toggleModal } =
    useContext(ReportContext);

  return (
    <>
      <Modal
        open={isOpenModal}
        title={'Report Detail'}
        onOk={() => {}}
        onCancel={toggleModal}
        footer={[]}
        width={1100}
      >
        <Descriptions title="User Info" bordered items={items} />
      </Modal>
      <Table columns={columnReport} dataSource={reports} loading={isLoading} />
    </>
  );
};
