import {
  Key,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useReports } from '../service/api/useReports';
import { IReport } from '../interfaces/IReport';
import {
  Button,
  DatePicker,
  Descriptions,
  DescriptionsProps,
  Input,
  Space,
  TableColumnsType,
} from 'antd';
import { InfoCircleFilled, SearchOutlined } from '@ant-design/icons';
import { useProduct } from '../service/api/useProduct';
import { useShop } from '../service/api/useShop';

interface ReportContextType {
  reports: IReport[];
  isLoading: boolean;
  isOpenModal: boolean;
  columnReport: TableColumnsType<IReport>;
  toggleModal: () => void;
}

export const ReportContext = createContext<ReportContextType>({
  reports: [],
  isLoading: false,
  isOpenModal: false,
  columnReport: [],
  toggleModal: () => {},
});

type ReportType = IReport;

interface DescriptionsItem {
  key: string;
  label: string;
  children: ReactNode;
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
  const { data, isLoading } = useReports({});

  const [open, setOpen] = useState(false);

  const [reportDetail, setReportDetail] = useState<DescriptionsItem[]>([]);

  const getReportDetail = (record: IReport) => {
    let reportee;
    if (record.productId) {
      const { data } = useProduct(record.productId.toString());
      reportee = data;
    }

    if (record.shopId) {
      const { data } = useShop(record.shopId.toString());
      reportee = data;
    }

    const productDetail: DescriptionsProps['items'] = [
      {
        label: 'Product ID',
        children: reportee?.id,
        span: { xs: 3, sm: 3, md: 1, lg: 1, xl: 1, xxl: 1 },
      },
      {
        label: 'Product name',
        children: product?.name,
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

    setOpen(true);
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
        children: record.createdAt,
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
        key: '7',
        label: 'Reportee',
        children: (
          <Descriptions
            items={record.type === 'product' ? productDetail : shopDetail}
          />
        ),
        span: 4,
      },
      {
        key: '8',
        label: 'Result',
        children: <Descriptions items={reportResult} />,
        span: 4,
      },
    ]);
  };

  const toggleModal = () => {
    setOpen((prev) => !prev);
  };

  const [createdAt, setCreatedAt] = useState<
    [Date | null | undefined, Date | null | undefined]
  >([null, null]);

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
            <DatePicker.RangePicker
              showTime={{ format: 'HH:mm' }}
              format="DD-MM-YYYY HH:mm"
              onOk={(value) => {
                if (value == undefined) return;
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
    }),
    [data, isLoading],
  );

  return (
    <ReportContext.Provider value={contextValue}>
      {children}
    </ReportContext.Provider>
  );
};
