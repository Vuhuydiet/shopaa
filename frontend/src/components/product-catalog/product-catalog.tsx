import { Breadcrumb, Layout, Menu, Space } from 'antd';
import { CategoryFilter } from '../category-filter/category-filter';
import { SortOptions } from '../sort-options/sort-options';
import { ProductGrid } from '../product-grid/product-grid';
import './product-catalog.css';

const { Header, Content, Footer, Sider } = Layout;

export const ProductCatalog = () => {
  return (
    <Layout>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div className="demo-logo-vertical" />
        <CategoryFilter />
      </Sider>
      <Layout>
        <Content style={{ margin: '24px 16px 0' }}>
            <SortOptions />
            <ProductGrid />
        </Content>
      </Layout>
    </Layout>
  );
};
