import axios from 'axios';
import { useEffect, useState } from 'react';
import { AUTH_API_ENDPOINTS } from '../../config/API_config';
import { Menu } from 'antd';
import { UnorderedListOutlined } from '@ant-design/icons';

export const CategoryFilter = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get(AUTH_API_ENDPOINTS.CATEGORY, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        console.log(response.data);
        setCategories((prev) =>
          response.data.metadata.map((category: any) => ({
            key: category.categoryId,
            label: category.categoryName,
          })),
        );
        console.log(categories);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <Menu
      mode="inline"
      items={[
        {
          key: 'all',
          label: 'All Categories',
          icon: <UnorderedListOutlined />,
          children: categories,
        },
      ]}
    />
  );
};
