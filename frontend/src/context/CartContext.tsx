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
import { createContext, ReactNode, useEffect, useState } from 'react';
import { useCart } from '../service/api/useCart';

interface CartContextType {
  shopColumns: any;
  productColumns: any;
  shopDataState: any;
  isLoading: boolean;
  expandTable: any;
  totalPrice: number;
}

export const CartContext = createContext<CartContextType>({
  shopColumns: [],
  productColumns: [],
  shopDataState: [],
  isLoading: false,
  expandTable: {},
  totalPrice: 0,
});

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cartParams, setCartParams] = useState({ limit: 10, offset: 0 });
  const { data, isLoading } = useCart(cartParams);
  const [shopDataState, setShopDataState] = useState<any>([]);
  const [selectedProducts, setSelectedProducts] = useState<
    {
      id: string;
      size: string;
      color: string;
      currentPrice: number;
      quantity: number;
    }[]
  >([]);
  const [selectedRowProductKeys, setSelectedRowProductKeys] = useState<
    string[]
  >([]);
  const [selectedRowShopKeys, setSelectedRowShopKeys] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    setShopDataState(data);
  }, [data]);

  const shopColumns = [
    {
      key: 'shopName',
      dataIndex: 'shopName',
    },
  ];

  const productColumns = [
    {
      key: 'image',
      title: 'Image',
      dataIndex: 'image',
      render: (text: any, record: any) => {
        return (
          <img
            key={`img-${record?.id}`}
            src={record?.image}
            alt="product"
            style={{ width: '60px' }}
          />
        );
      },
    },
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
      render: (text: any, record: any) => {
        return (
          <span
            key={`name-${record?.id}`}
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
            {record?.name}
          </span>
        );
      },
    },
    {
      key: 'attributes',
      title: 'Attributes',
      render: (text: any, record: any) => {
        return (
          <Tooltip
            key={record?.id}
            title={
              !selectedRowProductKeys.includes(record?.key as string)
                ? 'Please check the checkbox before selecting the attributes'
                : ''
            }
            color={'red'}
          >
            <Space direction="vertical" size={8}>
              <Select
                disabled={
                  !selectedRowProductKeys.includes(record?.key as string)
                }
                size="small"
                placeholder="Select size"
                onChange={(value) => {
                  setSelectedProducts((products) => {
                    const newProducts = [...products];
                    const productIndex = newProducts.findIndex(
                      (product) => product.id === record?.key,
                    );
                    newProducts[productIndex].size = value;
                    return newProducts;
                  });
                }}
                options={record?.sizes?.map((size: any) => ({
                  value: size,
                  label: size,
                  key: `${record?.id}-${size}`,
                }))}
                style={{ width: '100%' }}
              />
              <Select
                disabled={
                  !selectedRowProductKeys.includes(record?.key as string)
                }
                size="small"
                placeholder="Select color"
                optionFilterProp="label"
                onChange={(value) => {
                  setSelectedProducts((products) => {
                    const newProducts = [...products];
                    const productIndex = newProducts.findIndex(
                      (product) => product.id === record?.key,
                    );
                    newProducts[productIndex].color = value;
                    return newProducts;
                  });
                }}
                options={record?.colors?.map((color: any) => ({
                  value: color,
                  label: color,
                  key: `${record?.id}-${color}`,
                }))}
                style={{ width: '100%' }}
              />
            </Space>
          </Tooltip>
        );
      },
    },
    {
      key: 'price',
      title: 'Price',
      render: (text: any, record: any) => {
        return (
          <Space direction="vertical" size={8} key={record?.id}>
            <Typography.Text
              strong
              italic
              style={{ color: 'orange', fontSize: '0.8rem' }}
            >
              ${record?.currentPrice}
            </Typography.Text>
            <Typography.Text delete italic style={{ fontSize: '0.7rem' }}>
              ${record?.originalPrice}
            </Typography.Text>
          </Space>
        );
      },
    },
    {
      key: 'quantity',
      title: 'Quantity',
      dataIndex: 'quantity',
      render: (text: any, record: any) => {
        return (
          <Tooltip
            key={record?.id}
            title={
              !selectedRowProductKeys.includes(record.key as string)
                ? 'Please check the checkbox before updating the quantity'
                : ''
            }
            color={'red'}
          >
            <InputNumber
              disabled={!selectedRowProductKeys.includes(record.key as string)}
              size="middle"
              min={1}
              defaultValue={record.quantity || 1}
              onChange={(value) => {
                setShopDataState((data: any) => {
                  const newData = [...data];
                  const shopIndex = newData.findIndex(
                    (shop) => shop.key === record?.shopId,
                  );
                  const productIndex = newData[shopIndex].products.findIndex(
                    (product: any) => product.key === record?.key,
                  );
                  setTotalPrice((price) => {
                    return (
                      price +
                      record.currentPrice *
                        (value -
                          newData[shopIndex].products[productIndex].quantity)
                    );
                  });
                  newData[shopIndex].products[productIndex].quantity = value;
                  return newData;
                });
              }}
            />
          </Tooltip>
        );
      },
    },
    {
      key: 'totalPrice',
      title: 'Total price',
      render: (text: any, record: any) => {
        return (
          <Typography.Text
            key={record?.id}
            strong
            italic
            style={{ color: 'green', fontSize: '0.8rem' }}
          >
            ${record?.currentPrice * record?.quantity}
          </Typography.Text>
        );
      },
    },
    {
      render: (text: any, record: any) => {
        return (
          <Button
            key={record?.id}
            icon={<DeleteFilled />}
            type="text"
            danger
            onClick={() => {
              setShopDataState((data: any) => {
                let newData = [...data];
                const shopIndex = newData.findIndex(
                  (shop) => shop.key === record?.shopId,
                );
                newData[shopIndex].products = newData[
                  shopIndex
                ]?.products?.filter(
                  (product: any) => product.key !== record.key,
                );
                if (newData[shopIndex].products.length === 0) {
                  newData = newData.filter(
                    (shop: any) => shop.products.length > 0,
                  );
                }
                return newData;
              });

              if (selectedRowProductKeys.includes(record.key as string)) {
                setTotalPrice((price) => {
                  return price - record?.currentPrice * record?.quantity;
                });
              }

              setSelectedProducts((products) => {
                return products.filter((product) => product.id !== record?.key);
              });

              setSelectedRowProductKeys((keys) => {
                return keys.filter((key) => key !== record?.key);
              });

              if (
                selectedRowShopKeys &&
                selectedRowShopKeys === record?.shopId
              ) {
                setSelectedRowShopKeys('');
              }
            }}
          />
        );
      },
    },
  ];

  const expandTable = {
    expandedRowRender: (record: any) => {
      return (
        <Table
          rowKey={(record) => record?.key}
          columns={productColumns}
          dataSource={record.products}
          pagination={false}
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: selectedRowProductKeys,
            onChange: (keys: any, selectedRow: any) => {
              setSelectedRowProductKeys(keys as []);
              if (keys && keys.length > 0) {
                setSelectedRowShopKeys(record.key);
                setSelectedProducts((_) => {
                  return selectedRow.map((product: any) => {
                    return {
                      id: product.key,
                      size: product.size,
                      color: product.color,
                      currentPrice: product.currentPrice,
                      quantity: product.quantity,
                    };
                  });
                });

                setTotalPrice((price: any) => {
                  return selectedRow.reduce(
                    (total: any, product: any) =>
                      total + product.currentPrice * product.quantity,
                    0,
                  );
                });
              } else {
                setSelectedRowShopKeys('');
                setSelectedProducts([]);
                setTotalPrice(0);
              }
            },
            getCheckboxProps: (record: any) => ({
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
  };

  const value = {
    shopColumns: shopColumns,
    productColumns: productColumns,
    shopDataState: shopDataState,
    isLoading: isLoading,
    totalPrice: totalPrice,
    expandTable: expandTable,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
