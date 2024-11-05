import RegisterPage from '../pages/RegisterPage';

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
