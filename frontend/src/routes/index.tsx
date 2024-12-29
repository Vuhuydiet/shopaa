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
import UpdateProductForm from '../components/UpLoadProduct/UpdateProductForm';
import OrderShop from '../components/OrdersShop';
import OrderShopDetail from '../components/OrdersShop/orderDetails';
import { ReportPage } from '../pages/admin/report';
import { AdminRoute } from '../components/admin-route';
import { LayoutAdmin } from '../layout/admin';
import { ProductCart } from '../pages/product-cart';
import OrderUser from '../components/OrderUser';
import OrderUserDetail from '../components/OrderUser/orderDetails';
import CheckoutPage from '../pages/Checkout';
import ManageReturnSlips from '../components/ReturnRequests';
import InfoShop from '../components/InfoShop';

export const routes = [
  {
    path: '/admin',
    element: <LayoutAdmin />,
    children: [
      {
        element: <AdminRoute />,
        children: [
          {
            index: true,
            element: <Navigate to="dashboard" replace />,
          },
          {
            path: 'dashboard',
            // element:
          },
          {
            path: 'report',
            element: <ReportPage />,
          },
        ],
      },
    ],
  },
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
                element: <OrderUser />,
              },
              {
                path: '/user/orders/:orderId',
                element: <OrderUserDetail />,
              },
              {
                path: 'myshop',
                element: <MyShop />,
              },
            ],
          },
          {
            path: 'checkout',
            element: <CheckoutPage />,
          },
          {
            path: 'notifications',
          },
          {
            path: 'cart',
            element: <ProductCart />,
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
                path: 'update-product/:productId',
                element: <UpdateProductForm />,
              },
              {
                path: 'shop-info',
                element: <InfoShop />,
              },
              {
                path: 'list-order',
                element: <OrderShop />,
              },
              {
                path: 'list-order/:orderId',
                element: <OrderShopDetail />,
              },
              {
                path: 'return-requests',
                element: <ManageReturnSlips />,
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
    path: '*',
    element: <Navigate to="/" replace />,
  },
];
