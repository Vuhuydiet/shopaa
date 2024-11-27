import { useDispatch } from 'react-redux';
import { ProductDescription } from '../../components/product-description';
import { ProductDetailInfo } from '../../components/product-detail-info';
import { ProductDetailView } from '../../components/product-detail-view';
import { StoreInfo } from '../../components/store-info';
import { useProduct } from '../../service/api/useProduct';
import { useEffect } from 'react';
import { setProduct } from '../../service/state/slices/product-slice';
import { Spin } from 'antd';
import { useParams } from 'react-router-dom';

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <div>Invalid product id</div>;
  }

  const { data: product, isLoading, isError, refetch } = useProduct(id);
  const dispatch = useDispatch();

  useEffect(() => {
    refetch();
    if (product) {
      dispatch(setProduct(product));
    }
  }, [product]);

  if (isLoading) {
    return (
      <Spin
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      />
    );
  }

  if (isError) {
    return <div>Failed to load product</div>;
  }

  return (
    product && (
      <div style={{ maxWidth: '1200px', margin: 'auto' }}>
        <ProductDetailView />
        <StoreInfo />
        <ProductDetailInfo />
        <ProductDescription />
      </div>
    )
  );
};
