import { ProductDescription } from '../../components/product-description';
import { ProductDetailInfo } from '../../components/product-detail-info';
import { ProductDetailView } from '../../components/product-detail-view';
import { StoreInfo } from '../../components/store-info';

export const ProductDetail = () => {
  return (
    <>
      <ProductDetailView />
      <StoreInfo />
      <ProductDetailInfo />
      <ProductDescription />
    </>
  );
};
