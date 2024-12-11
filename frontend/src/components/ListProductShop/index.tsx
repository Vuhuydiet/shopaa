import React from 'react';
import {
  Button,
  Input,
  message,
  Popconfirm,
  Spin,
  Table,
  TableProps,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useProducts } from '../../service/api/useProducts';
import { IProduct } from '../../interfaces/IProduct';
import {
  AppstoreOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusSquareOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import { PRODUCT_API_ENDPOINTS } from '../../config/API_config';

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
  const [total, setTotal] = useState<number>(0);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [tableData, setTableData] = useState<DataType[]>([]);
  const [action, setAction] = useState<string>('all');
  // search
  const [searchValue, setSearchValue] = useState<string>('');
  const [keywordSearch, setKeywordSearch] = useState<string>('');

  const { data, isLoading, refetch } = useProducts({
    shopId: parseInt(shopId ?? '0', 10),
    sortBy: 'publishedAt',
    order: 'desc',
    keyword: keywordSearch,
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
  });

  const refreshDataTable = async (dt: []) => {
    const formattedData = dt.map((item: IProduct) => ({
      key: item.id.toString(),
      name: item.name,
      price: item.currentPrice,
      quantity: item.quantity,
      image: item.images[0]?.url || '',
    }));
    setTableData(formattedData);
  };

  useEffect(() => {
    const fetchData = async () => {
      const shopID = localStorage.getItem('userId') || '';
      setShopId(shopID);

      const actionTemp = sessionStorage.getItem('action');
      if (actionTemp) {
        setAction(actionTemp);
        if (actionTemp === 'search') {
          setSearchValue(sessionStorage.getItem('searchValue') || '');
          setKeywordSearch(sessionStorage.getItem('searchValue') || '');
        } else {
          setSearchValue('');
        }
        setCurrentPage(parseInt(sessionStorage.getItem('currentPage') || '1'));
        sessionStorage.clear();
      }

      setTotal(data?.count);
      await refreshDataTable(data?.items);
    };
    fetchData();
  }, [data]);

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
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: DataType) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          {/* Icon Edit */}
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              handleRowClick(record);
            }}
          />
          {/* Icon Delete */}
          <Popconfirm
            title={`Are you sure you want to delete product ${record.name}?`}
            onConfirm={(e) => {
              e?.stopPropagation();
              handleDelete(record);
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={(e) => e.stopPropagation()}
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleRowClick = (record: any) => {
    console.log('CLICK ROW');
    console.log('ACTION row: ', action);
    let productDetail;
    productDetail = data?.items.find(
      (item: IProduct) => item.id.toString() === record.key,
    );
    if (productDetail) {
      sessionStorage.setItem('action', action);
      sessionStorage.setItem('currentPage', currentPage.toString());
      sessionStorage.setItem('searchValue', searchValue);

      navigate(`/manager-shop/update-product/${productDetail.id}`, {
        state: {
          product: productDetail,
        },
      });
    }
  };
  const handleDelete = async (record: any) => {
    setIsDeleting(true);
    const confirmed = true;
    if (confirmed) {
      try {
        const response = await axios.delete(
          `${PRODUCT_API_ENDPOINTS.PRODUCTS}/${record.key}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          },
        );

        if (response.status === 200) {
          message.success('Product deleted successfully!');
          setTableData((prevData) =>
            prevData.filter((item) => item.key !== record.key),
          );
          refetch();
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        message.error('Failed to delete the product.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleSearch = async (value: string) => {
    setKeywordSearch(value);
  };

  return (
    <>
      <Spin spinning={isDeleting} tip="Deleting product...">
        <div style={{ padding: '30px', color: 'black' }}>
          <h1
            style={{
              textAlign: 'left',
              marginLeft: '10px',
              marginBottom: '10px',
            }}
          >
            List product
          </h1>
          <hr />

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Icon */}
              <AppstoreOutlined
                style={{ fontSize: '24px', cursor: 'pointer' }}
                onClick={() => {
                  setAction('all');
                  setKeywordSearch('');
                  setSearchValue('');
                  setCurrentPage(1);
                  refreshDataTable(data?.items);
                  setTotal(data?.count);
                  message.info('Showing all products');
                }}
              />
              <Input.Search
                placeholder="Search product by keyword"
                enterButton
                onSearch={async (value) => {
                  setAction('search');
                  if (currentPage !== 1) {
                    setCurrentPage(1);
                  }

                  await handleSearch(value);
                }}
                style={{ width: '250px' }}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                padding: '20px',
                gap: '10px',
              }}
            >
              <Button
                type="primary"
                onClick={() => navigate('/manager-shop/add-product')}
              >
                {' '}
                <PlusSquareOutlined />
                Add Product
              </Button>
            </div>
          </div>

          <Table<DataType>
            columns={columns}
            dataSource={tableData}
            loading={isLoading}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: total,
              onChange: async (page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              },
            }}
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
            })}
          />
        </div>
      </Spin>
    </>
  );
};

export default ListProductShop;
