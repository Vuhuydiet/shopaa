import { List } from 'antd';
import { ProductCard } from '../product-card/product-card';
import { useSelector } from 'react-redux';
import { RootState } from '../../service/state/store';
import { IProduct } from '../../interfaces/IProduct';
import { useEffect } from 'react';
import axios from 'axios';
import { AUTH_API_ENDPOINTS } from '../../config/API_config';

interface ProductData {
  name: string;
  price: number;
  quantity?: number;
  description?: string;
  brand?: string;
  categories?: { add: number[] };
  images?: { add: File[] };
}

export const ProductGrid = () => {
  const products = useSelector((state: RootState) => state.products.items);

  // const createProduct = async (productData: ProductData) => {
  //   const formData = new FormData();

  //   // Convert product data to string and append to FormData
  //   formData.append(
  //     'productData',
  //     JSON.stringify({
  //       name: productData.name,
  //       price: productData.price,
  //       quantity: productData.quantity,
  //       description: productData.description,
  //       brand: productData.brand,
  //       categories: productData.categories,
  //     }),
  //   );

  //   // Add images if any
  //   if (productData?.images?.add && productData.images.add.length > 0) {
  //     productData.images.add.forEach((image) => {
  //       formData.append('images', image);
  //     });
  //   }

  //   try {
  //     const token = localStorage.getItem('token');
  //     const response = await axios.post(AUTH_API_ENDPOINTS.PRODUCTS, formData, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });
  //     return response.data;
  //   } catch (error) {
  //     console.error('Error creating product:', error);
  //     throw error;
  //   }
  // };

  // const createImageFile = async (
  //   imageUrl: string,
  //   fileName: string,
  // ): Promise<File> => {
  //   const response = await fetch(imageUrl);
  //   console.log('response:', response);
  //   const blob = await response.blob();
  //   return new File([blob], fileName, { type: 'image/jpeg' });
  // };

  // // Usage in component
  // useEffect(() => {
  //   const createNewProduct = async (price: number, quantity: number) => {
  //     try {
  //       const imageUrl =
  //         'data:image/jpeg;base64,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';

  //       const imageFile = await createImageFile(imageUrl, 'ao-thun.jpg');

  //       const data = {
  //         name: 'Ao thun',
  //         price: price,
  //         quantity: quantity,
  //         description: 'Ao thun dep',
  //         brand: 'Adidas',
  //         categories: { add: [2] },
  //         images: { add: [imageFile] }, // Add File objects here if needed
  //       };

  //       const result = await createProduct(data);
  //       console.log('Product created:', result);
  //     } catch (error) {
  //       console.error('Failed to create product:', error);
  //     }
  //   };
  //   for (let i = 1; i <= 48; i++) {
  //     createNewProduct(i * 1000, i);
  //   }
  // }, []);

  return (
    <List
      grid={{
        gutter: 16,
        xs: 1,
        sm: 2,
        md: 4,
        lg: 4,
        xl: 6,
        xxl: 3,
      }}
      dataSource={products}
      renderItem={(item: IProduct) => (
        <List.Item>
          <ProductCard
            image={item.images[0]?.url || ''}
            title={item.name}
            originalPrice={item.originalPrice}
            currentPrice={item.currentPrice}
            star={4.7}
            soldCount={item.soldCount}
          />
        </List.Item>
      )}
    />
  );
};
