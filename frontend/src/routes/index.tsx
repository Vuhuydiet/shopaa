import RegisterPage from '../page/RegisterPage';

export const routes = [
  {
    path: '/',
    children: [
      {
        path: '/signup',
        element: <RegisterPage />,
      },
    ],
  },
];
