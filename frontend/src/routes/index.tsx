import { Navigate } from 'react-router-dom';
import PrivateRoutes from '../components/PrivateRoute';
import LayoutBasic from '../layout/LayoutBasic';
import { LogIn } from '../pages/login/login';
import RegisterPage from '../pages/RegisterPage';
import { ResetPassword } from '../pages/reset-password/reset-password';
import UserAccountPage from '../pages/UserAccountPage';
import Profile from '../components/MyAccount/Profile';
import MyShop from '../pages/MyShop';
import Account from '../components/MyAccount/Account';
import ShopPage from '../pages/Shop';
import Category from '../pages/Category';
import ManagerShop from '../pages/ManagerShop';
import { Home } from '../pages/Home/Home';
import UploadProductForm from '../components/UpLoadProduct/UpLoadProductFrom';
import ListProductShop from '../components/ListProductShop';
import { ProductDetail } from '../pages/product-detail';
import { ProductCatalog } from '../components/product-catalog/product-catalog';
import { ReportTable } from '../components/report-table';
import { ReportPage } from '../pages/admin/report';

export const routes = [
  {
    path: '/',
    element: <LayoutBasic />,
    children: [
      {
        index: true,
        element: <Navigate to="/home" replace />,
      },
      {
        path: 'home',
        element: <Home />,
      },
      {
        element: <PrivateRoutes />,
        children: [
          {
            path: 'user',
            element: <UserAccountPage />,
            children: [
              {
                index: true,
                element: <Navigate to="/user/account/profile" replace />,
              },
              {
                path: 'account/profile',
                element: <Profile />,
              },
              {
                path: 'account/address',
                // element: <Address />, // Component Address
              },
              {
                path: 'account/setting',
                element: <Account />,
              },
              {
                path: 'orders',
                // element: <Order />, // Component Order
              },
              {
                path: 'myshop',
                element: <MyShop />,
              },
            ],
          },
          {
            path: 'notifications',
          },
          {
            path: 'cart',
          },
          {
            path: '/manager-shop',
            element: <ManagerShop />,
            children: [
              {
                index: true,
                element: <Navigate to="/manager-shop/list-product" replace />,
              },
              {
                path: 'list-product',
                element: <ListProductShop />,
              },
              {
                path: 'add-product',
                element: <UploadProductForm />,
              },
              {
                path: 'shop-info',
                // element: <Profile />, information of shop
              },
            ],
          },
        ],
      },
      {
        path: '/shop/:shopId',
        element: <ShopPage />,
      },
      {
        path: '/category',
        element: <Category />,
      },
      {
        path: '/product-detail/:id',
        element: <ProductDetail />,
      },
      {
        path: '/admin',
        element: <ReportPage />,
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
    path: '/product-catalog',
    element: <ProductCatalog />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
];
