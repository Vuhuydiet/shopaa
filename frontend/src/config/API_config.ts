const API_DOMAIN = import.meta.env.VITE_API_DOMAIN;

export const AUTH_API_ENDPOINTS = {
  SEND_OTP: `${API_DOMAIN}api/v1/access/send-otp`,
  SIGN_UP: `${API_DOMAIN}api/v1/access/sign-up`,
  SIGN_IN: `${API_DOMAIN}api/v1/access/sign-in`,
  ACCOUNT: `${API_DOMAIN}api/v1/access/account`,
  CHANGE_PASSWORD: `${API_DOMAIN}api/v1/access/change-password`,
  FORGOT_PASSWORD: `${API_DOMAIN}api/v1/access/forgot-password`,
};

export const PRODUCT_API_ENDPOINTS = {
  PRODUCTS: `${API_DOMAIN}api/v1/product`,
  CATEGORY: `${API_DOMAIN}api/v1/category`,
};

export const USER_API_ENDPOINTS = {
  USER_PROFILE: `${API_DOMAIN}api/v1/user/`,
};

export const SHOP_API_ENDPOINTS = {
  SHOP: `${API_DOMAIN}api/v1/shop/`,
  REGISTER_SHOP: `${API_DOMAIN}api/v1/shop/register`,
};

export const ORDER_API_ENDPOINTS = {
  ORDER: `${API_DOMAIN}api/v1/order/`,
  ORDER_DETAIL: `${API_DOMAIN}api/v1/order/user/`,
  TRANSPORTATION: `${API_DOMAIN}api/v1/transportation`,
};

export const REPORT_API_ENDPOINTS = {
  REPORTS: `${API_DOMAIN}api/v1/report/`,
  SHOP: `${API_DOMAIN}api/v1/report/shop`,
  PRODUCT: `${API_DOMAIN}api/v1/report/product`,
  REASONS: `${API_DOMAIN}api/v1/report/reasons`,
};

export const CART_API_ENDPOINTS = {
  CART: `${API_DOMAIN}api/v1/cart`,
};

export const REVIEW_API_ENDPOINTS = {
  REVIEW: `${API_DOMAIN}api/v1/review`,
};

export const RETURN_API_ENDPOINTS = {
  RETURN: `${API_DOMAIN}api/v1/return`,
  REASONS: `${API_DOMAIN}api/v1/return/reasons`,
};

export const NOTIFICATION_API_ENDPOINTS = {
  NOTIFICATION: `${API_DOMAIN}api/v1/notification`,
};

export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  NEW_NOTIFICATION: 'notification-new',
  READ_NOTIFICATION: 'notification-read',
};

export const SOCKET_URL = `${API_DOMAIN}:3080`;

export const WITHDRAW_API_ENDPOINTS = {
  WITHDRAW: `${API_DOMAIN}api/v1/withdraw/`,
  GET_LIST_WITHDRAW: `${API_DOMAIN}api/v1/withdraw/shop/`,
};

export const STATISTICS_API_ENDPOINTS = {
  REVENUE: `${API_DOMAIN}api/v1/statistics/revenue`,
  PRODUCTS: `${API_DOMAIN}api/v1/statistics/products`,
  ORDERS: `${API_DOMAIN}api/v1/statistics/orders`,
  WITHDRAWALS: `${API_DOMAIN}api/v1/statistics/withdrawals`,
};
