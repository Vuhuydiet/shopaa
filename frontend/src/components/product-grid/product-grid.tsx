import { List } from 'antd';
import { ProductCard } from '../product-card/product-card';
import { useSelector } from 'react-redux';
import { RootState } from '../../service/state/store';
import { IProduct } from '../../interfaces/IProduct';

// interface ProductData {
//   name: string;
//   price: number;
//   quantity?: number;
//   description?: string;
//   brand?: string;
//   categories?: number[];
//   images?: File[];
// }

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
  //   if (productData.images && productData.images.length > 0) {
  //     productData.images.forEach((image) => {
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
  //   const createNewProduct = async () => {
  //     try {
  //       const imageUrl =
  //         'data:image/jpeg;base64,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';

  //       const imageFile = await createImageFile(
  //         imageUrl,
  //         'iphone16-pro-max.jpg',
  //       );

  //       const data = {
  //         name: 'IPhone 16 Pro Max',
  //         price: 3200,
  //         quantity: 10,
  //         description: 'Best phone ever',
  //         brand: 'IPhone',
  //         categories: [1],
  //         images: [imageFile], // Add File objects here if needed
  //       };

  //       const result = await createProduct(data);
  //       console.log('Product created:', result);
  //     } catch (error) {
  //       console.error('Failed to create product:', error);
  //     }
  //   };

  //   createNewProduct();
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
            image={item.images[0].url || ''}
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
