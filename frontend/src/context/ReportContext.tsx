import {
  Key,
  ReactNode,
  createContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useReports } from '../service/hooks/useReports';
import { IReport } from '../interfaces/IReport';
import {
  Button,
  DatePicker,
  Descriptions,
  Input,
  message,
  Space,
  TableColumnsType,
} from 'antd';
import { InfoCircleFilled, SearchOutlined } from '@ant-design/icons';
import { useProduct } from '../service/hooks/useProduct';
import { useShop } from '../service/hooks/useShop';
import { Link } from 'react-router-dom';
import modal from 'antd/es/modal';
import TextArea from 'antd/es/input/TextArea';

interface ReportContextType {
  reports: IReport[];
  isLoading: boolean;
  isOpenModal: boolean;
  columnReport: TableColumnsType<IReport>;
  toggleModal: () => void;
  reportDetail: DescriptionsItem[];
  isProcessing: boolean;
  handleReport: (result: 'accepted' | 'dismissed') => void;
}

export const ReportContext = createContext<ReportContextType>({
  reports: [],
  isLoading: false,
  isOpenModal: false,
  columnReport: [],
  toggleModal: () => {},
  reportDetail: [],
  isProcessing: false,
  handleReport: () => {},
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
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    report: { data, isLoading, refetch: refetchReport },
    postReportResult: postReportResult,
  } = useReports({});
  const [productId, setProductId] = useState<string | undefined>(undefined);
  const [shopId, setShopId] = useState<string | undefined>(undefined);
  const { data: product, refetch: refetchProduct } = useProduct(productId);
  const { data: shop, refetch: refetchShop } = useShop(shopId);
  const [reportId, setReportId] = useState<number | undefined>(undefined);
  const [modalApi, modalHolder] = modal.useModal();
  const [messageApi, messageHolder] = message.useMessage();
  const reasonRef = useRef('');

  const handleReport = (result: 'accepted' | 'dismissed') => {
    modalApi.confirm({
      title: `Are you sure to ${result === 'accepted' ? 'accept' : 'dismiss'}?`,
      content: (
        <TextArea
          placeholder="Reason"
          onChange={(event) => {
            reasonRef.current = event.target.value;
          }}
        />
      ),
      onOk: () => {
        postReportResult({
          reportId: reportId as number,
          result: result,
          reason: reasonRef.current,
        })
          .then(() => {
            messageApi.open({
              type: 'success',
              content: 'Report result updated',
            });
            toggleModal();
            refetchReport();
          })
          .catch((error) => {
            messageApi.open({
              type: 'error',
              content: error.response?.data?.message || 'Something went wrong',
            });
          });
      },
      onCancel: () => {},
    });
  };

  const getReportDetail = (record: IReport) => {
    setReportId(record.id);
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

    setIsProcessing(record.reportResult === null);

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
        span: { xs: 3, sm: 3, md: 1, lg: 1, xl: 1, xxl: 1 },
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
        span: 3,
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
        span: 3,
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
                span: 3,
              },
              {
                key: 'reason',
                label: 'Reason',
                children: record.reportResult?.reason,
                span: 3,
              },
            ]}
          />
        ),
        span: 3,
      },
    ]);
  };

  const toggleModal = () => {
    setOpen((prev) => !prev);
  };

  const columns = useMemo<TableColumnsType<ReportType>>(() => {
    return [
      {
        title: 'Report ID',
        dataIndex: 'id',
        key: 'id',
        sorter: {
          compare: (a: ReportType, b: ReportType) => a.id - b.id,
          multiple: 1,
        },
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
        sorter: {
          compare: (a: ReportType, b: ReportType) => {
            if (a.shopId === null) {
              return -1;
            }
            if (b.shopId === null) {
              return 1;
            }
            return a.shopId - b.shopId;
          },
          multiple: 2,
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
        sorter: {
          compare: (a: ReportType, b: ReportType) => {
            if (a?.productId === null) {
              return -1;
            }
            if (b?.productId === null) {
              return 1;
            }
            return a.productId - b.productId;
          },
          multiple: 3,
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
        defaultSortOrder: 'descend',
        sorter: {
          compare: (a: ReportType, b: ReportType) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          multiple: 4,
        },
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
        sorter: {
          compare: (a: ReportType, b: ReportType) => {
            if (a.reportResult === null) {
              return -1;
            }
            if (b.reportResult === null) {
              return 1;
            }
            return a.reportResult.result.localeCompare(b.reportResult.result);
          },
          multiple: 5,
        },
        defaultSortOrder: 'ascend',
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
          if (record.reportResult === null) {
            return value == 'processing';
          }
          return record.reportResult?.result === value;
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
      isProcessing: isProcessing,
      handleReport: handleReport,
    }),
    [data, isLoading, columns, open, reportDetail],
  );

  return (
    <ReportContext.Provider value={contextValue}>
      {messageHolder}
      {modalHolder}
      {children}
    </ReportContext.Provider>
  );
};
