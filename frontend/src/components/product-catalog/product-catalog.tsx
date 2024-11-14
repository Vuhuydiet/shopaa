import { Layout } from 'antd';
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
import { setPagination } from '../../service/state/slices/pagination-slice';

const { Content, Sider } = Layout;

export const ProductCatalog = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.filters);

  const { data: products } = useProducts(filters);
  const { data: categories } = useCategories();

  useEffect(() => {
    if (products && products.items) {
      const serializedProducts = products.items.map((product: any) => ({
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
      console.log('products: ', serializedProducts);
    }

    if (products && products.count) {
      dispatch(
        setPagination({
          totalItems: products.count,
        }),
      );
      console.log('products count: ', products.count);
    }
  }, [products, dispatch]);

  useEffect(() => {
    if (categories) {
      dispatch(setCategories(categories));
    }
  }, [categories, dispatch]);

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
