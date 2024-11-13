import axios from 'axios';
import { IFilterProduct } from '../../interfaces/IFilterProduct';
import { useQuery } from 'react-query';
import { AUTH_API_ENDPOINTS } from '../../config/API_config';
import { IProduct } from '../../interfaces/IProduct';
import { useDispatch } from 'react-redux';
import { setPagination } from '../state/slices/pagination-slice';
import { IProductResponse } from '../../interfaces/IProductResponse';

export const useProducts = (params: IFilterProduct) => {
  return useQuery(['products', params], () => getProducts(params));
};

async function getProducts(params: IFilterProduct = { limit: 24 }) {
  try {
    const response = await axios.get(AUTH_API_ENDPOINTS.PRODUCTS, {
      params: params,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('getProducts: ', response);

    if (response.data?.metadata?.count && response.data?.metadata?.products) {
      const products = response.data.metadata.products.map(
        (product: any): IProduct => {
          return {
            id: product.productId,
            name: product.productName,
            originalPrice: product.originalPrice,
            currentPrice: product.currentPrice,
            brand: product.brand,
            description: product.productDescription,
            quantity: product.quantity,
            sellerId: product.sellerId,
            soldCount: product.numSoldProduct,
            publishedAt: new Date(product.publishedAt),
            categories: product.categories.map((category: any) => {
              return {
                id: category.categoryId,
                name: category.categoryName,
                description: category.description,
              };
            }),
            images: product.productImages.map((image: any) => {
              return {
                id: image.image.publicId,
                url: image.image.url,
                createdAt: new Date(image.image.createdAt),
              };
            }),
          };
        },
      );
      return { count: response.data.metadata.count, items: products };
    }
  } catch (error) {
    console.error('Error fetching products:', error);
  }
  return { count: 0, items: [] };
}
