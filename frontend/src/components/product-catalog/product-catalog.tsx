import { Breadcrumb, Layout, Space } from 'antd';
import { CategoryFilter } from '../category-filter/category-filter';
import { SortOptions } from '../sort-options/sort-options';
import { ProductGrid } from '../product-grid/product-grid';
import Sider from 'antd/es/layout/Sider';
import { Content } from 'antd/es/layout/layout';

export const ProductCatalog = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible>
        <CategoryFilter />
        {/* <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} /> */}
      </Sider>
      <Layout>
        <Content style={{ margin: '0 16px' }}>
            <SortOptions />
            <ProductGrid />
        </Content>
      </Layout>
    </Layout>
  );
};
