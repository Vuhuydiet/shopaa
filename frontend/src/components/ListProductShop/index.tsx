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

const parseData = async (data: any) => {
  const products = data.map((product: any): IProduct => {
    return {
      id: product?.productId,
      name: product?.productName,
      originalPrice: product?.originalPrice,
      currentPrice: product?.currentPrice,
      brand: product?.brand,
      description: product?.productDescription,
      quantity: product?.quantity,
      sellerId: product?.sellerId,
      soldCount: product?.numSoldProduct,
      material: product?.material,
      origin: product?.origin,
      colors: product?.colors,
      sizes: product?.sizes,
      publishedAt: product?.publishedAt,
      categories: product.categories.map((category: any) => {
        return {
          id: category?.categoryId,
          name: category?.categoryName,
          description: category?.description,
        };
      }),
      images: product?.productImages?.map((image: any) => {
        return {
          id: image.image.imageId,
          publicId: image.image.publicId,
          url: image.image.url,
          createdAt: image.image.createdAt,
        };
      }),
    };
  });
  return products;
};

const ListProductShop: React.FC = () => {
  const [shopId, setShopId] = useState<string>('');
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [tableData, setTableData] = useState<DataType[]>([]);
  const [searching, setSearching] = useState<boolean>(false);
  const [action, setAction] = useState<string>('all');
  // search
  const [searchValue, setSearchValue] = useState<string>('');
  const [dataSearch, setDataSearch] = useState<[]>([]);
  const [searchPage, setSearchPage] = useState(1);

  const { data, isLoading, refetch } = useProducts({
    shopId: parseInt(shopId ?? '0', 10),
    sortBy: 'publishedAt',
    order: 'desc',
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
          setSearchPage(parseInt(sessionStorage.getItem('searchPage') || '1'));
          setSearchValue(sessionStorage.getItem('searchValue') || '');
        } else {
          setCurrentPage(
            parseInt(sessionStorage.getItem('currentPage') || '1'),
          );
        }
        sessionStorage.clear();
      }

      if (action === 'search') {
        console.log(dataSearch);
        handleSearch(searchValue);
      } else if (action === 'all') {
        setTotalPage(data?.count);
        await refreshDataTable(data?.items);
      }
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
    let productDetail;
    if (action === 'all') {
      productDetail = data?.items.find(
        (item: IProduct) => item.id.toString() === record.key,
      );
    } else if (action === 'search') {
      productDetail = dataSearch.find(
        (item: IProduct) => item.id.toString() === record.key,
      );
    }
    if (productDetail) {
      sessionStorage.setItem('action', action);
      sessionStorage.setItem('currentPage', currentPage.toString());
      sessionStorage.setItem('searchValue', searchValue);
      sessionStorage.setItem('searchPage', searchPage.toString());

      navigate(`/manager-shop/update-product/${productDetail.id}`, {
        state: {
          product: productDetail,
          keyword: searchValue,
          action: action,
          currentPage: currentPage,
          pageSize: pageSize,
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

  const handleSearchPagination = async (page: number, pageSize: number) => {
    setSearchPage(page);
    setPageSize(pageSize);
    handleSearch(searchValue);
  };

  const handleDefaultPagination = async (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const handleSearch = async (value: string) => {
    setSearching(true);
    setSearchValue(value);
    setAction('search');
    console.log('Value search: ', value);
    try {
      const response = await axios.get(
        `${PRODUCT_API_ENDPOINTS.PRODUCTS}/search`,
        {
          params: {
            keyword: value,
            shopId,
            limit: pageSize,
            offset: (currentPage - 1) * pageSize,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      );

      if (response.status === 200) {
        console.log('Result: ', response);
        if (
          response.data?.metadata?.count &&
          response.data?.metadata?.products
        ) {
          const products = await parseData(response.data.metadata?.products);
          console.log('PRODUCTS SEARCH: ', products);

          setTotalPage(response.data?.metadata?.count);
          await refreshDataTable(products);
          setDataSearch(products);
        } else {
          setCurrentPage(1);
          setTotalPage(0);
          setTableData([]);
        }
        message.success('Search product successfully!');
      }
    } catch (error) {
      console.error('Error search product:', error);
      // message.error('Failed to search the product.');
    } finally {
      setSearching(false);
    }
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
                  refreshDataTable(data?.items);
                  setCurrentPage(1);
                  setTotalPage(data?.count);
                  message.info('Showing all products');
                }}
              />
              <Input.Search
                placeholder="Search product by keyword"
                enterButton
                onSearch={handleSearch}
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
            loading={(isLoading && !searching) || (searching && !isLoading)}
            pagination={{
              current: action === 'all' ? currentPage : searchPage,
              pageSize: pageSize,
              total: totalPage,
              onChange: async (page, size) => {
                if (action === 'all') {
                  await handleDefaultPagination(page, size);
                } else {
                  await handleSearchPagination(page, size);
                }
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
