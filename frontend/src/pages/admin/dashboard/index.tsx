import OrderStatisticProvider from '../../../context/OrderStatisticContext';
import ProductRevenueProvider from '../../../context/ProductRevenueContext';
import RevenueProvider from '../../../context/RevenueContext';
import OrderStatisticsTable from './orders';
import ProductRevenueTable from './products';
import RevenueTable from './revenue';

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
    </>
  );
};

export default Dashboard;
