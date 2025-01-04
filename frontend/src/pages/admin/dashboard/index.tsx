import OrderStatisticProvider from '../../../context/OrderStatisticContext';
import ProductRevenueProvider from '../../../context/ProductRevenueContext';
import RevenueProvider from '../../../context/RevenueContext';
import { WithdrawalsProvider } from '../../../context/WithdrawalsContext';
import OrderStatisticsTable from './orders';
import ProductRevenueTable from './products';
import RevenueTable from './revenue';
import WithdrawalStatisticsTable from './withdrawls';

const Dashboard: React.FC = () => {
  return (
    <>
      <RevenueProvider>
        <RevenueTable />
      </RevenueProvider>
      <ProductRevenueProvider>
        <ProductRevenueTable />
      </ProductRevenueProvider>
      <OrderStatisticProvider>
        <OrderStatisticsTable />
      </OrderStatisticProvider>
      <WithdrawalsProvider>
        <WithdrawalStatisticsTable />
      </WithdrawalsProvider>
    </>
  );
};

export default Dashboard;
