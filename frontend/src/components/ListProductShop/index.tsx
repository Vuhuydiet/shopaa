import React from 'react';
import { Button, Table, TableProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useProducts } from '../../service/api/useProducts';
import { IProduct } from '../../interfaces/IProduct';

interface DataType {
  key: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const ListProductShop: React.FC = () => {
  const [shopId, setShopId] = useState<string>('');
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(5);
  // const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    const shopID = localStorage.getItem('userId') || '';
    setShopId(shopID);
  }, []);

  const { data, isLoading } = useProducts({
    shopId: parseInt(shopId ?? '0', 10),
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
  });
  // console.log('DATA SHOP', data);

  const columns: TableProps<DataType>['columns'] = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      render: (_: any, __: DataType, index: number) =>
        (currentPage - 1) * pageSize + index + 1,
    },
    {
      title: 'Image',
      dataIndex: 'image',
      render: (_: any, record: DataType) =>
        React.createElement('img', {
          src: record.image,
          alt: record.name,
          style: { width: '50px', height: '50px', objectFit: 'cover' },
        }),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
  ];
  const tableData: DataType[] =
    data?.items?.map((item: IProduct) => ({
      key: item.id.toString(),
      name: item.name,
      price: item.currentPrice,
      quantity: item.quantity,
      image: item.images[0]?.url || '',
    })) || [];

  const handleRowClick = (record: any) => {
    const productDetail = data?.items.find(
      (item: IProduct) => item.id.toString() === record.key,
    );
    if (productDetail) {
      // setSelectedProduct(productDetail);
      // console.log(productDetail);
      navigate(`/manager-shop/update-product/${productDetail.id}`, {
        state: { product: productDetail },
      });
    }
  };

  return (
    <>
      <div style={{ padding: '20px', color: 'black' }}>
        <h1 style={{ marginBottom: '10px' }}>List product</h1>
        <Button
          type="primary"
          onClick={() => navigate('/manager-shop/add-product')}
        >
          {' '}
          Add Product
        </Button>
        <Table<DataType>
          columns={columns}
          dataSource={tableData}
          loading={isLoading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: data?.count || 0,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
          }}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
        />
      </div>
    </>
  );
};

export default ListProductShop;
