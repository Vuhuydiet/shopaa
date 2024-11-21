import { Layout } from 'antd';
import { CategoryFilter } from '../category-filter/category-filter';
import { SortOptions } from '../sort-options/sort-options';
import { ProductGrid } from '../product-grid/product-grid';
import './product-catalog.css';
import { PaginationProduct } from '../pagination/pagination';
const { Content, Sider } = Layout;

export const ProductCatalog = () => {
  return (
    <Layout>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div className="demo-logo-vertical" />
        <CategoryFilter />
      </Sider>
      <Layout>
        <Content style={{ margin: '24px 16px 0' }}>
          <SortOptions />
          <ProductGrid />
          <PaginationProduct />
        </Content>
      </Layout>
    </Layout>
  );
};
