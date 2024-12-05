import { Key, ReactNode, createContext, useMemo, useState } from 'react';
import { useReports } from '../service/api/useReports';
import { IReport } from '../interfaces/IReport';
import {
  Button,
  DatePicker,
  Descriptions,
  Input,
  Space,
  TableColumnsType,
} from 'antd';
import { InfoCircleFilled, SearchOutlined } from '@ant-design/icons';
import { useProduct } from '../service/api/useProduct';
import { useShop } from '../service/api/useShop';
import { Link } from 'react-router-dom';

interface ReportContextType {
  reports: IReport[];
  isLoading: boolean;
  isOpenModal: boolean;
  columnReport: TableColumnsType<IReport>;
  toggleModal: () => void;
  reportDetail: DescriptionsItem[];
}

export const ReportContext = createContext<ReportContextType>({
  reports: [],
  isLoading: false,
  isOpenModal: false,
  columnReport: [],
  toggleModal: () => {},
  reportDetail: [],
});

type ReportType = IReport;

interface DescriptionsItem {
  key: string;
  label: string;
  children: ReactNode | string;
  span?:
    | {
        xs?: number;
        sm?: number;
        md?: number;
        lg?: number;
        xl?: number;
        xxl?: number;
      }
    | number;
}

export const ReportProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [reportDetail, setReportDetail] = useState<DescriptionsItem[]>([]);
  const [createdAt, setCreatedAt] = useState<
    [Date | null | undefined, Date | null | undefined]
  >([null, null]);

  const { data, isLoading } = useReports({});
  const [productId, setProductId] = useState<string | undefined>(undefined);
  const [shopId, setShopId] = useState<string | undefined>(undefined);
  const { data: product } = useProduct(productId);
  const { data: shop } = useShop(shopId);

  const getReportDetail = (record: IReport) => {
    toggleModal();
    setProductId(record.productId?.toString());
    setShopId(record.shopId?.toString());
    function getReportee(productId: string | undefined) {
      if (productId) {
        return (_: string | undefined) => [
          {
            key: 'productId',
            label: 'Product ID',
            children: (
              <Link to={`/product-detail/${productId}`}>{productId}</Link>
            ),
            span: { xs: 3, sm: 3, md: 1, lg: 1, xl: 1, xxl: 1 },
          },
          {
            key: 'productName',
            label: 'Product name',
            children: product?.name,
            span: { xs: 3, sm: 3, md: 2, lg: 2, xl: 1, xxl: 1 },
          },
          {
            key: 'currentPrice',
            label: 'Current price',
            children: product?.currentPrice,
            span: { xs: 3, sm: 3, md: 1, lg: 1, xl: 1, xxl: 1 },
          },
          {
            key: 'originalPrice',
            label: 'Original price',
            children: product?.originalPrice,
            span: { xs: 3, sm: 3, md: 2, lg: 1, xl: 1, xxl: 1 },
          },
          {
            key: 'quantity',
            label: 'Quantity',
            children: product?.quantity,
            span: { xs: 3, sm: 3, md: 1, lg: 1, xl: 1, xxl: 1 },
          },
          {
            key: 'publishedAt',
            label: 'Published at',
            children: new Date(product?.publishedAt).toLocaleString(),
            span: { xs: 3, sm: 3, md: 2, lg: 1, xl: 1, xxl: 1 },
          },
          {
            key: 'brand',
            label: 'Brand',
            span: { xs: 3, sm: 3, md: 1, lg: 1, xl: 1, xxl: 1 },
            children: product?.brand,
          },
          {
            key: 'material',
            label: 'Material',
            span: { xs: 3, sm: 3, md: 2, lg: 1, xl: 2, xxl: 2 },
            children: product?.material,
          },
          {
            key: 'description',
            label: 'Product Description',
            span: 3,
            children: product?.description,
          },
        ];
      }
      return (shopId: string | undefined) => {
        if (!shopId) return [];

        return [
          {
            key: 'shopOwnerId',
            label: 'Shop Owner ID',
            children: <Link to={`/shop/${shopId}`}>{shopId}</Link>,
            span: { xs: 3, sm: 3, md: 1, lg: 1, xl: 1, xxl: 1 },
          },
          {
            key: 'shopName',
            label: 'Shop name',
            children: shop?.name,
            span: { xs: 3, sm: 3, md: 2, lg: 2, xl: 2, xxl: 2 },
          },
          {
            key: 'address',
            label: 'Address',
            children: shop?.address,
            span: 3,
          },
          {
            key: 'description',
            label: 'Shop Description',
            children: shop?.description,
            span: 3,
          },
        ];
      };
    }

    setReportDetail([
      {
        key: 'reportId',
        label: 'Report ID',
        children: record.id,
      },
      {
        key: 'reporterId',
        label: 'Reporter ID',
        children: record.reporterId,
      },
      {
        key: 'createdAt',
        label: 'Created At',
        children: new Date(record.createdAt).toLocaleString(),
        span: { xs: 4, sm: 4, md: 1, lg: 1, xl: 1, xxl: 1 },
      },
      {
        key: 'type',
        label: 'Type',
        children: record.type,
      },
      {
        key: 'category',
        label: 'Category',
        children: record.shopCategory || record.productCategory,
        span: 2,
      },
      {
        key: 'description',
        label: 'Description',
        span: 4,
        children: record.description,
      },
      {
        key: 'reportee',
        label: 'Reportee',
        children: (
          <Descriptions
            items={getReportee(record?.productId?.toString())(
              record?.shopId?.toString(),
            )}
          />
        ),
        span: 4,
      },
      {
        key: 'result',
        label: 'Result',
        children: (
          <Descriptions
            items={[
              {
                key: 'createdAt',
                label: 'Created At',
                children: record.reportResult?.createdAt
                  ? new Date(record.reportResult?.createdAt).toLocaleString()
                  : '',
              },
              {
                key: 'handlerId',
                label: 'Handler ID',
                children: record.reportResult?.handlerId,
              },
              {
                key: 'result',
                label: 'Result',
                children: record.reportResult?.result,
                span: 4,
              },
            ]}
          />
        ),
        span: 4,
      },
    ]);
  };

  const toggleModal = () => {
    setOpen((prev) => !prev);
  };

  const [filterValues, setFilterValues] = useState<any>({});

  const columns = useMemo<TableColumnsType<ReportType>>(() => {
    return [
      {
        title: 'Report ID',
        dataIndex: 'id',
        key: 'id',
        sorter: (a: ReportType, b: ReportType) => a.id - b.id,
      },
      {
        title: 'Shop ID',
        dataIndex: 'shopId',
        key: 'shopId',
        filterDropdown({ setSelectedKeys, selectedKeys, confirm }) {
          return (
            <Space size={1} direction="horizontal">
              <Input
                autoFocus
                placeholder="Search shop ID"
                value={selectedKeys[0]}
                onChange={(e: any) => {
                  setSelectedKeys(e.target.value ? [e.target.value] : []);
                  confirm({ closeDropdown: false });
                }}
                onPressEnter={() => confirm()}
                onBlur={() => confirm()}
              />
              <Button onClick={() => confirm()} type="primary">
                Search
              </Button>
            </Space>
          );
        },
        filterIcon: () => <SearchOutlined />,
        onFilter: (value: Boolean | Key, record: ReportType) => {
          if (!value) {
            return true;
          }

          if (record?.shopId === null) {
            return false;
          }

          return record.shopId == value;
        },
        sorter: (a: ReportType, b: ReportType) => {
          if (a.shopId === null) {
            return -1;
          }
          if (b.shopId === null) {
            return 1;
          }
          return a.shopId - b.shopId;
        },
      },
      {
        title: 'Product ID',
        dataIndex: 'productId',
        key: 'productId',
        filterIcon: () => <SearchOutlined />,
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
          return (
            <Space size={1} direction="horizontal">
              <Input
                autoFocus
                placeholder="Search product ID"
                value={selectedKeys[0]}
                onChange={(e: any) => {
                  setSelectedKeys(e.target.value ? [e.target.value] : []);
                  confirm({ closeDropdown: false });
                }}
                onPressEnter={() => confirm()}
                onBlur={() => confirm()}
              />
              <Button onClick={() => confirm()} type="primary">
                Search
              </Button>
            </Space>
          );
        },
        onFilter: (value: Boolean | Key, record: ReportType) => {
          if (!value) {
            return true;
          }

          if (record?.productId === null) {
            return false;
          }

          return record.productId == value;
        },
        sorter: (a: ReportType, b: ReportType) => {
          if (a?.productId === null) {
            return -1;
          }
          if (b?.productId === null) {
            return 1;
          }
          return a.productId - b.productId;
        },
      },
      {
        key: 'createdAt',
        title: 'Created At',
        dataIndex: 'createdAt',
        render: (date: string) => new Date(date).toLocaleString(),
        filterDropdown: ({ setSelectedKeys, confirm }) => {
          return (
            <>
              <DatePicker.RangePicker
                showTime={{ format: 'HH:mm' }}
                format="DD-MM-YYYY HH:mm"
                onOk={(value) => {
                  if (value == undefined) {
                    return;
                  }
                  if (value.at(0) && value.at(1)) {
                    setCreatedAt([
                      value?.at(0)?.toDate(),
                      value?.at(1)?.toDate(),
                    ]);
                    setSelectedKeys(['oke']);
                    confirm();
                  }
                }}
              />
              <Button
                onClick={() => {
                  setCreatedAt([null, null]);
                }}
                type="primary"
              >
                Clear
              </Button>
            </>
          );
        },
        onFilter: (_, record: ReportType) => {
          if (!createdAt[0] || !createdAt[1]) {
            return true;
          }

          const recordDate = new Date(record.createdAt);

          return recordDate >= createdAt[0] && recordDate <= createdAt[1];
        },
        sorter: (a: ReportType, b: ReportType) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
      },
      {
        key: 'type',
        title: 'Type',
        dataIndex: 'type',
        filters: [
          {
            text: 'Shop',
            value: 'shop',
          },
          {
            text: 'Product',
            value: 'product',
          },
        ],
        onFilter: (value: Boolean | Key, record: ReportType) => {
          return record.type === value;
        },
      },
      {
        key: 'category',
        title: 'Category',
        render: (record: any) => record.shopCategory || record.productCategory,
        filterIcon: () => <SearchOutlined />,
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
          return (
            <Space size={1}>
              <Input
                autoFocus
                placeholder="Search product ID"
                value={selectedKeys[0]}
                onChange={(e: any) => {
                  setSelectedKeys(e.target.value ? [e.target.value] : []);
                  confirm({ closeDropdown: false });
                }}
                onPressEnter={() => confirm()}
                onBlur={() => confirm()}
              />
              <Button onClick={() => confirm()} type="primary">
                Search
              </Button>
            </Space>
          );
        },
        onFilter: (value: any, record: ReportType) => {
          if (!value) return true;
          if (!record.shopCategory && !record.productCategory) return false;

          return (
            record.shopCategory?.includes(value as string) ||
            record.productCategory?.includes(value as string) ||
            false
          );
        },
      },
      {
        key: 'reportResult',
        title: 'Report Result',
        dataIndex: 'reportResult',
        render: (data: any) => data?.result,
        filters: [
          {
            text: 'Accepted',
            value: 'accepted',
          },
          {
            text: 'Dismissed',
            value: 'dismissed',
          },
          {
            text: 'Processing',
            value: 'processing',
          },
        ],
        onFilter: (value: Boolean | Key, record: ReportType) => {
          if (!value) return true;
          if (!record.reportResult) return value === 'processing';

          return record.reportResult.result === value;
        },
      },
      {
        key: 'action',
        title: 'Action',
        render: (record: any) => (
          <Button type="primary" onClick={() => getReportDetail(record)}>
            Detail <InfoCircleFilled />
          </Button>
        ),
      },
    ];
  }, [createdAt]);

  const contextValue = useMemo(
    () => ({
      reports: data || [],
      isLoading,
      columnReport: columns,
      isOpenModal: open,
      toggleModal: toggleModal,
      reportDetail: reportDetail,
    }),
    [data, isLoading, columns, open, reportDetail],
  );

  return (
    <ReportContext.Provider value={contextValue}>
      {children}
    </ReportContext.Provider>
  );
};
