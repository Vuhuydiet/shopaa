import { useQuery } from 'react-query';
import { PRODUCT_API_ENDPOINTS } from '../../config/API_config';
import axios from 'axios';
import { IProduct } from '../../interfaces/IProduct';

export const useProduct = (id: string | undefined) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id),
  });
};

export const getProduct = async (id: string | undefined) => {
  if (!id) return {} as IProduct;
  try {
    const res = await axios.get(`${PRODUCT_API_ENDPOINTS.PRODUCTS}/${id}`);
    if (res?.data?.metadata) {
      const product = res.data.metadata.product;
      const result = {
        id: product?.productId,
        sellerId: product?.sellerId,
        name: product?.productName,
        brand: product?.brand,
        currentPrice: product?.currentPrice,
        originalPrice: product?.originalPrice,
        description: product?.productDescription,
        soldCount: product?.numSoldProduct,
        numReviews: product?.numReviews,
        totalRating: product?.totalRating,
        quantity: product?.quantity,
        material: product?.material,
        origin: product?.origin,
        colors: product?.colors,
        sizes: product?.sizes,
        publishedAt: product?.publishedAt,
        categories: product?.categories?.map((category: any) => {
          return {
            id: category.categoryId,
            name: category.categoryName,
            description: category.description,
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
      console.log(`product ${id}: `, result);
      return result;
    }
  } catch (error) {
    console.log(error);
  }
  return {} as IProduct;
};
