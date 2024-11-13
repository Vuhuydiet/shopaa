import { Layout, Pagination } from 'antd';
import { CategoryFilter } from '../category-filter/category-filter';
import { SortOptions } from '../sort-options/sort-options';
import { ProductGrid } from '../product-grid/product-grid';
import './product-catalog.css';
import { PaginationProduct } from '../pagination/pagination';
import { useEffect } from 'react';
import { useProducts } from '../../service/api/useProducts';
import { setProducts } from '../../service/state/slices/product-slice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../service/state/store';
import { serializeDate } from '../../utils/date-convert';
import { IImage } from '../../interfaces/IImage';
import { useCategories } from '../../service/api/useCategories';
import { setCategories } from '../../service/state/slices/category-slice';

const { Content, Sider } = Layout;

export const ProductCatalog = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.filters);

  const { data: products } = useProducts(filters);
  const { data: categories } = useCategories();

  useEffect(() => {
    if (products) {
      const serializedProducts = products.map((product: any) => ({
        ...product,
        images: product.images.map((image: IImage) => ({
          ...image,
          createdAt:
            image.createdAt instanceof Date
              ? serializeDate(image.createdAt)
              : image.createdAt,
        })),
        publishedAt:
          product.publishedAt instanceof Date
            ? serializeDate(product.publishedAt)
            : product.publishedAt,
      }));

      dispatch(setProducts(serializedProducts));
    }
  }, [products, dispatch]);

  useEffect(() => {
    if (categories) {
      dispatch(setCategories(categories));
    }
  }, [categories, dispatch]);

  return (
    <Layout>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {
          //console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          //console.log(collapsed, type);
        }}
      >
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
