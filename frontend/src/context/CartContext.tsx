import { DeleteFilled } from '@ant-design/icons';
import {
  Button,
  InputNumber,
  message,
  Select,
  Space,
  Table,
  Tooltip,
  Typography,
} from 'antd';
import { createContext, ReactNode, useEffect, useState } from 'react';
import { useCart } from '../service/hooks/useCart';
import { CART_PRODUCTS_FILTER } from '../config/constants';
import { AxiosResponse } from 'axios';
import { formatCurrency } from '../utils/format-number';

interface CartContextType {
  shopColumns: any;
  productColumns: any;
  shopDataState: any;
  isLoading: boolean;
  expandTable: any;
  totalPrice: number;
  totalItems: number;
  setCartParams: (params: any) => void;
  selectedProducts: {
    key: number;
    id: number;
    size: string;
    color: string;
    currentPrice: number;
    quantity: number;
    name: string;
  }[];
}

export const CartContext = createContext<CartContextType>({
  shopColumns: [],
  productColumns: [],
  shopDataState: {
    cart: [],
    count: 0,
  },
  isLoading: false,
  expandTable: {},
  totalPrice: 0,
  totalItems: 0,
  selectedProducts: [],
  setCartParams: () => {},
});

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cartParams, setCartParams] = useState({
    limit: CART_PRODUCTS_FILTER.ITEMS_PER_PAGE,
    offset: 0,
  });
  const {
    cart: { data, isLoading },
    deleteItem,
  } = useCart(cartParams);

  const [shopDataState, setShopDataState] = useState<any>({
    cart: [],
    count: 0,
  });
  const [selectedProducts, setSelectedProducts] = useState<
    {
      key: number;
      id: number;
      size: string;
      color: string;
      currentPrice: number;
      quantity: number;
      name: string;
    }[]
  >([]);
  const [selectedRowProductKeys, setSelectedRowProductKeys] = useState<
    string[]
  >([]);
  const [selectedRowShopKeys, setSelectedRowShopKeys] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const [messageApi, contextHolder] = message.useMessage();

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
      render: (_: any, record: any) => {
        return (
          <img
            key={`img-${record?.key}`}
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
      render: (_: any, record: any) => {
        return (
          <span
            key={`name-${record?.key}`}
            style={{
              fontSize: '0.8rem',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '150px',
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
      render: (_: any, record: any) => {
        return (
          <Tooltip
            key={record?.key}
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
                defaultValue={record?.size}
                size="small"
                placeholder="Select size"
                onChange={(value) => {
                  setSelectedProducts((products) => {
                    const newProducts = [...products];
                    const productIndex = newProducts.findIndex(
                      (product) => product.key === record.key,
                    );
                    newProducts[productIndex].size = value;
                    return newProducts;
                  });
                }}
                options={record?.sizes?.map((size: any) => ({
                  value: size,
                  label: size,
                  key: `${record?.key}-${size}`,
                  disabled: selectedProducts.some((product) => {
                    return (
                      product.key !== record?.key &&
                      product.size === size &&
                      product.color === record?.color
                    );
                  }),
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
                defaultValue={record?.color}
                onChange={(value) => {
                  setSelectedProducts((products) => {
                    const newProducts = [...products];
                    const productIndex = newProducts.findIndex(
                      (product) => product.key === record?.key,
                    );
                    newProducts[productIndex].color = value;
                    return newProducts;
                  });
                }}
                options={record?.colors?.map((color: any) => ({
                  value: color,
                  label: color,
                  key: `${record?.key}-${color}`,
                  disabled: selectedProducts.some((product) => {
                    return (
                      product.key !== record?.key &&
                      product.color === color &&
                      product.size === record?.size
                    );
                  }),
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
      render: (_: any, record: any) => {
        return (
          <Space direction="vertical" size={8} key={record?.key}>
            <Typography.Text
              strong
              italic
              style={{ color: 'orange', fontSize: '0.8rem' }}
            >
              {formatCurrency(record?.currentPrice)}
            </Typography.Text>
            <Typography.Text delete italic style={{ fontSize: '0.7rem' }}>
              {formatCurrency(record?.originalPrice)}
            </Typography.Text>
          </Space>
        );
      },
    },
    {
      key: 'quantity',
      title: 'Quantity',
      dataIndex: 'quantity',
      render: (_: any, record: any) => {
        return (
          <Tooltip
            key={record?.key}
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
              defaultValue={1}
              onChange={(value) => {
                if (!value) return;
                setSelectedProducts((products) => {
                  const newProducts = [...products];
                  const productIndex = newProducts.findIndex(
                    (product) => product.key === record.key,
                  );
                  newProducts[productIndex].quantity = value;
                  return newProducts;
                });

                setShopDataState((data: any) => {
                  const newData = [...data?.cart];
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
                  return {
                    ...data,
                    cart: newData,
                  };
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
      render: (_: any, record: any) => {
        return (
          <Typography.Text
            key={record?.key}
            strong
            italic
            style={{ color: 'green', fontSize: '0.8rem' }}
          >
            {formatCurrency(record?.currentPrice * record?.quantity)}
          </Typography.Text>
        );
      },
    },
    {
      render: (_: any, record: any) => {
        return (
          <Button
            key={record?.key}
            icon={<DeleteFilled />}
            type="text"
            danger
            onClick={() => {
              deleteItem
                .mutateAsync(record.key)
                .then((_: AxiosResponse) => {
                  messageApi.open({
                    type: 'success',
                    content: 'Item deleted successfully',
                  });

                  setShopDataState((data: any) => {
                    let newData = [...data?.cart];
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
                    return {
                      ...data,
                      cart: newData,
                    };
                  });

                  if (selectedRowProductKeys.includes(record.key as string)) {
                    setTotalPrice((price) => {
                      return price - record?.currentPrice * record?.quantity;
                    });

                    setTotalItems((items) => {
                      return items - 1;
                    });
                  }

                  setSelectedProducts((products) => {
                    return products.filter(
                      (product) => product.key !== record?.key,
                    );
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
                })
                .catch((error) => {
                  console.log(error);
                  messageApi.open({
                    type: 'error',
                    content: error?.response?.data || 'Failed to delete item',
                  });
                });
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
                      key: product.key,
                      id: product.id,
                      size: product.size,
                      color: product.color,
                      currentPrice: product.currentPrice,
                      quantity: product.quantity,
                      name: product.name,
                    };
                  });
                });

                setTotalPrice((_: any) => {
                  return selectedRow.reduce(
                    (total: any, product: any) =>
                      total + product.currentPrice * product.quantity,
                    0,
                  );
                });

                setTotalItems(keys.length);
              } else {
                setSelectedRowShopKeys('');
                setSelectedProducts([]);
                setTotalPrice(0);
                setTotalItems(0);
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
    totalItems: totalItems,
    expandTable: expandTable,
    selectedProducts: selectedProducts,
    setCartParams,
  };

  return (
    <CartContext.Provider value={value}>
      {contextHolder}
      {children}
    </CartContext.Provider>
  );
};
