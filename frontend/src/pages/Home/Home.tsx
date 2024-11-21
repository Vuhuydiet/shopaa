import { useDispatch } from 'react-redux';
import { ProductCatalog } from '../../components/product-catalog/product-catalog';
import { useEffect } from 'react';
import { setFilter } from '../../service/state/slices/filter-slice';

export const Home = () => {
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(setFilter({ shopId: undefined }));
  // }, []);

  return <ProductCatalog />;
};
