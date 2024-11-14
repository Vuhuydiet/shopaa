import LayoutBasic from '../layout/LayoutBasic';
import { LogIn } from '../pages/login/login';
import RegisterPage from '../pages/RegisterPage';
import { ResetPassword } from '../pages/reset-password/reset-password';

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
];
