import { DeleteFilled } from '@ant-design/icons';
import {
  Button,
  InputNumber,
  Select,
  Space,
  Table,
  Tooltip,
  Typography,
} from 'antd';
import { set } from 'lodash';
import { useEffect, useState } from 'react';

export const ProductCart = () => {
  const shopColumns = [
    {
      title: 'Shop name',
      dataIndex: 'shopName',
    },
  ];

  const shopData = [
    {
      key: 5,
      shopName: 'Shop thời trang 88',
      products: [
        {
          key: 1,
          shopId: 5,
          image:
            'https://res.cloudinary.com/dwkunsgly/image/upload/v1732177097/f650m5nom9eglokdvafv.webp',
          name: 'Áo thun nam thời trang số 1 Việt Nam',
          sizes: ['S', 'M', 'L', 'XL'],
          colors: ['Đỏ', 'Xanh', 'Vàng', 'Trắng'],
          originalPrice: 100000,
          currentPrice: 80000,
          quantity: 3,
        },
        {
          key: 2,
          shopId: 5,
          image:
            'https://res.cloudinary.com/dwkunsgly/image/upload/v1732177097/f650m5nom9eglokdvafv.webp',
          name: 'Áo thun nam thời trang số 1 Việt Nam',
          sizes: ['S', 'M', 'L', 'XL'],
          colors: ['Đỏ', 'Xanh', 'Vàng', 'Trắng'],
          originalPrice: 100000,
          currentPrice: 80000,
          quantity: 3,
        },
        {
          key: 3,
          shopId: 5,
          image:
            'https://res.cloudinary.com/dwkunsgly/image/upload/v1732177097/f650m5nom9eglokdvafv.webp',
          name: 'Áo thun nam thời trang số 1 Việt Nam',
          sizes: ['S', 'M', 'L', 'XL'],
          colors: ['Đỏ', 'Xanh', 'Vàng', 'Trắng'],
          originalPrice: 100000,
          currentPrice: 80000,
          quantity: 3,
        },
        {
          key: 100,
          shopId: 5,
          image:
            'https://res.cloudinary.com/dwkunsgly/image/upload/v1732177097/f650m5nom9eglokdvafv.webp',
          name: 'Áo thun nam thời trang số 1 Việt Nam',
          sizes: ['S', 'M', 'L', 'XL'],
          colors: ['Đỏ', 'Xanh', 'Vàng', 'Trắng'],
          originalPrice: 100000,
          currentPrice: 80000,
          quantity: 3,
        },
      ],
    },
    {
      key: 100,
      shopName: 'Shop điện thoại 99',
      products: [
        {
          key: 4,
          shopId: 100,
          image:
            'https://res.cloudinary.com/dwkunsgly/image/upload/v1732177097/f650m5nom9eglokdvafv.webp',
          name: 'Áo thun nam thời trang số 1 Việt Nam',
          sizes: ['S', 'M', 'L', 'XL'],
          colors: ['Đỏ', 'Xanh', 'Vàng', 'Trắng'],
          originalPrice: 100000,
          currentPrice: 80000,
          quantity: 3,
        },
        {
          key: 5,
          shopId: 100,
          image:
            'https://res.cloudinary.com/dwkunsgly/image/upload/v1732177097/f650m5nom9eglokdvafv.webp',
          name: 'Áo thun nam thời trang số 1 Việt Nam',
          sizes: ['S', 'M', 'L', 'XL'],
          colors: ['Đỏ', 'Xanh', 'Vàng', 'Trắng'],
          originalPrice: 100000,
          currentPrice: 80000,
          quantity: 3,
        },
      ],
    },
    {
      key: 50,
      shopName: 'Shop giày dép Logi',
      products: [
        {
          key: 6,
          shopId: 50,
          image:
            'https://res.cloudinary.com/dwkunsgly/image/upload/v1732177097/f650m5nom9eglokdvafv.webp',
          name: 'Áo thun nam thời trang số 1 Việt Nam Áo thun nam thời trang số 1 Việt NamÁo thun nam thời trang số 1 Việt NamÁo thun nam thời trang số 1 Việt NamÁo thun nam thời trang số 1 Việt NamÁo thun nam thời trang số 1 Việt Nam',
          sizes: ['S', 'M', 'L', 'XL'],
          colors: ['Đỏ', 'Xanh', 'Vàng', 'Trắng'],
          originalPrice: 100000,
          currentPrice: 80000,
          quantity: 3,
        },
      ],
    },
  ];

  const [shopDataState, setShopDataState] = useState(shopData);
  const [selectedProducts, setSelectedProducts] = useState<
    { id: string; size: string; color: string; quantity: number }[]
  >([]);

  const productColumns = [
    {
      title: 'Image',
      dataIndex: 'image',
      render: (text: any, record: any) => {
        return (
          <img src={record.image} alt="product" style={{ width: '60px' }} />
        );
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text: any, record: any) => {
        return (
          <span
            style={{
              fontSize: '0.8rem',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '250px',
            }}
          >
            {record.name}
          </span>
        );
      },
    },
    {
      title: 'Attributes',
      render: (text: any, record: any) => {
        return (
          <Tooltip
            title={
              !selectedRowProductKeys.includes(record.key as string)
                ? 'Please check the checkbox before selecting the attributes'
                : ''
            }
            color={'red'}
          >
            <Space direction="vertical" size={8}>
              <Select
                disabled={
                  !selectedRowProductKeys.includes(record.key as string)
                }
                size="small"
                placeholder="Select size"
                onChange={(value) => {
                  setSelectedProducts((products) => {
                    const newProducts = [...products];
                    const productIndex = newProducts.findIndex(
                      (product) => product.id === record.key,
                    );
                    newProducts[productIndex].size = value;
                    return newProducts;
                  });
                }}
                options={record.sizes.map((size: any) => ({
                  value: size,
                  label: size,
                }))}
                style={{ width: '100%' }}
              />
              <Select
                disabled={
                  !selectedRowProductKeys.includes(record.key as string)
                }
                size="small"
                placeholder="Select color"
                optionFilterProp="label"
                onChange={(value) => {
                  setSelectedProducts((products) => {
                    const newProducts = [...products];
                    const productIndex = newProducts.findIndex(
                      (product) => product.id === record.key,
                    );
                    newProducts[productIndex].color = value;
                    return newProducts;
                  });
                }}
                options={record.colors.map((color: any) => ({
                  value: color,
                  label: color,
                }))}
                style={{ width: '100%' }}
              />
            </Space>
          </Tooltip>
        );
      },
    },
    {
      title: 'Price',
      render: (text: any, record: any) => {
        return (
          <Space direction="vertical" size={8}>
            <Typography.Text
              strong
              italic
              style={{ color: 'orange', fontSize: '0.8rem' }}
            >
              ${record.currentPrice}
            </Typography.Text>
            <Typography.Text delete italic style={{ fontSize: '0.7rem' }}>
              ${record.originalPrice}
            </Typography.Text>
          </Space>
        );
      },
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      render: (text: any, record: any) => {
        return (
          <InputNumber
            size="middle"
            min={1}
            defaultValue={record.quantity || 1}
            onChange={(value) => {
              setShopDataState((data) => {
                const newData = [...data];
                const shopIndex = newData.findIndex(
                  (shop) => shop.key === record.shopId,
                );
                const productIndex = newData[shopIndex].products.findIndex(
                  (product) => product.key === record.key,
                );
                newData[shopIndex].products[productIndex].quantity = value;
                return newData;
              });
            }}
          />
        );
      },
    },
    {
      title: 'Total price',
      render: (text: any, record: any) => {
        return (
          <Typography.Text
            strong
            italic
            style={{ color: 'green', fontSize: '0.8rem' }}
          >
            ${record.currentPrice * record.quantity}
          </Typography.Text>
        );
      },
    },
    {
      render: (text: any, record: any) => {
        return (
          <Button
            icon={<DeleteFilled />}
            type="text"
            danger
            onClick={() => {
              setShopDataState((data) => {
                let newData = [...data];
                const shopIndex = newData.findIndex(
                  (shop) => shop.key === record.shopId,
                );
                newData[shopIndex].products = newData[
                  shopIndex
                ].products.filter((product: any) => product.key !== record.key);
                if (newData[shopIndex].products.length === 0) {
                  newData = newData.filter(
                    (shop: any) => shop.products.length > 0,
                  );
                }
                return newData;
              });
            }}
          />
        );
      },
    },
  ];

  const [selectedRowProductKeys, setSelectedRowProductKeys] = useState<
    string[]
  >([]);
  const [selectedRowShopKeys, setSelectedRowShopKeys] = useState('');

  return (
    <Table
      columns={shopColumns}
      dataSource={shopDataState}
      expandable={{
        // rowExpandable: (record: any) => !selectedRowShopKeys ? true : record.key === selectedRowShopKeys,
        expandedRowRender: (record: any) => {
          return (
            <Table
              columns={productColumns}
              dataSource={record.products}
              pagination={false}
              rowSelection={{
                type: 'checkbox',
                selectedRowKeys: selectedRowProductKeys,
                onChange: (keys) => {
                  setSelectedRowProductKeys(keys as []);
                  if (keys && keys.length > 0) {
                    setSelectedRowShopKeys(record.key);
                  } else {
                    setSelectedRowShopKeys('');
                    setSelectedProducts([]);
                  }
                },
                onSelect: (record, selected, selectedRows) => {
                  if (selected) {
                    setSelectedProducts((products) => {
                      return [
                        ...products,
                        {
                          id: record.key,
                          size: '',
                          color: '',
                          quantity: record.quantity,
                        },
                      ];
                    });
                  } else {
                    setSelectedProducts((products) => {
                      return products.filter(
                        (product) => product.id !== record.key,
                      );
                    });
                  }
                },
                getCheckboxProps: (record) => ({
                  disabled: !selectedRowShopKeys
                    ? false
                    : record.shopId !== selectedRowShopKeys,
                }),
                selections:
                  selectedRowShopKeys === record.key || !selectedRowShopKeys
                    ? [
                        Table.SELECTION_ALL,
                        Table.SELECTION_NONE,
                        Table.SELECTION_INVERT,
                      ]
                    : [],
              }}
            />
          );
        },
        expandRowByClick: true,
        defaultExpandAllRows: true,
      }}
      pagination={false}
    />
  );
};
