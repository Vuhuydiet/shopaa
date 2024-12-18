import { Card, Layout } from 'antd';
import { CategoryFilter } from '../category-filter/category-filter';
import { SortOptions } from '../sort-options/sort-options';
import { ProductGrid } from '../product-grid/product-grid';
import './product-catalog.css';
import { PaginationProduct } from '../pagination/pagination';
const { Content, Sider } = Layout;

export const ProductCatalog = () => {
  return (
    <Layout
      style={{
        padding: '16px 16px',
      }}
    >
      <Card>
        <Sider breakpoint="lg" collapsedWidth="0">
          <div className="demo-logo-vertical" />
          <CategoryFilter />
        </Sider>
      </Card>

      <Layout style={{ marginLeft: '8px' }}>
        <Content>
          <Card>
            <SortOptions />
            <ProductGrid />
            <PaginationProduct />
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};
