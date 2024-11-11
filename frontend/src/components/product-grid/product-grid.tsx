import { List } from 'antd';
import { ProductCard } from '../product-card/product-card';
import { IProduct } from '../../interfaces/IProduct';
import { useEffect } from 'react';
import axios from 'axios';
import { AUTH_API_ENDPOINTS } from '../../config/API_config';

export const ProductGrid = () => {
  useEffect(() => {
    // const getAllProducts = async () => {
    //   try {
    //     const response = await axios.get(AUTH_API_ENDPOINTS.GET_ALL_PRODUCTS, {
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //     });
    //     console.log(response);
    //     return response.data.metadata.products as IProduct[];
    //   } catch (error) {
    //     console.error('Error fetching products:', error);
    //     return [];
    //   }
    // };
    // getAllProducts();
    const productData = {
      name: 'Product Name',
      price: 100,
      quantity: 10,
      brand: 'Brand Name',
      description: 'Product Description',
      images: [
        'data:image/jpeg;base64,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',
      ],
    };
    try {
      const token = localStorage.getItem('token');
      const response = axios.post(
        'http://localhost:3000/api/v1/product',
        { productData },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(response);
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to create product',
      );
    }
  });

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
      dataSource={[]}
      renderItem={(item: IProduct) => (
        <List.Item>
          <ProductCard
            image={item.image}
            title={item.title}
            originPrice={item.originPrice}
            salePrice={item.salePrice}
            star={item.star}
            bought={item.bought}
          />
        </List.Item>
      )}
    />
  );
};
