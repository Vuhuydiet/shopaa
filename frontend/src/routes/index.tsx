import { LogIn } from '../pages/login/login';
import RegisterPage from '../pages/RegisterPage';
import { ResetPassword } from '../pages/reset-password/reset-password';

export const routes = [
  {
    path: '/',
    children: [
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
    ],
  },
];
