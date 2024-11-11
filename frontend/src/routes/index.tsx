import LayoutBasic from '../layout/LayoutBasic';
import { LogIn } from '../pages/login/login';
import RegisterPage from '../pages/RegisterPage';
import { ResetPassword } from '../pages/reset-password/reset-password';
import { ProductGrid } from '../components/product-grid/product-grid';
import { CategoryFilter } from '../components/category-filter/category-filter';
import { SortOptions } from '../components/sort-options/sort-options';
import { ProductCatalog } from '../components/product-catalog/product-catalog';

export const routes = [
  {
    path: '/',
    element: <LayoutBasic />,
    children: [
      {
        path: '/profile',
      },
      {
        path: '/notifications',
      },
      {
        path: '/cart',
      },
    ],
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/login',
    element: <LogIn />,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
  },
  {
    path: '/products',
    element: <ProductGrid />,
  },
  {
    path: 'categories',
    element: <CategoryFilter />,
  },
  {
    path: 'sort-options',
    element: <SortOptions />,
  },
  {
    path: 'product-catalog',
    element: <ProductCatalog />,
  }
];
