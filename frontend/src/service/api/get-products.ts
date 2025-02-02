import axios from 'axios';
import { PRODUCT_API_ENDPOINTS } from '../../config/API_config';
import { IFilterProduct } from '../../interfaces/IFilterProduct';
import { IProduct } from '../../interfaces/IProduct';

export default async function getProductsByFilter(params: IFilterProduct) {
  try {
    const response = await axios.get(PRODUCT_API_ENDPOINTS.PRODUCTS, {
      params: params,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.data?.metadata?.count && response.data?.metadata?.products) {
      console.log('response: ', response.data);
      const products = response.data.metadata?.products?.map(
        (product: any): IProduct => {
          return {
            id: product?.productId,
            name: product?.productName,
            originalPrice: product?.originalPrice,
            currentPrice: product?.currentPrice,
            brand: product?.brand,
            description: product?.productDescription,
            quantity: product?.quantity,
            sellerId: product?.sellerId,
            soldCount: product?.numSoldProduct,
            numReviews: product?.numReviews,
            totalRating: product?.totalRating,
            material: product?.material,
            origin: product?.origin,
            colors: product?.colors,
            sizes: product?.sizes,
            publishedAt: product?.publishedAt,
            categories: product.categories.map((category: any) => {
              return {
                id: category?.categoryId,
                name: category?.categoryName,
                description: category?.description,
              };
            }),
            images: product?.productImages?.map((image: any) => {
              return {
                id: image.image.imageId,
                publicId: image.image.publicId,
                url: image.image.url,
                createdAt: image.image.createdAt,
              };
            }),
          };
        },
      );
      console.log('products: ', {
        count: response.data.metadata.count,
        items: products,
      });

      return { count: response.data.metadata.count, items: products };
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}
