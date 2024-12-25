const API_DOMAIN = 'http://localhost:3000/';

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
};

export const ADMIN_API_ENDPOINTS = {
  REPORTS: `${API_DOMAIN}api/v1/report/`,
};

export const CART_API_ENDPOINTS = {
  CART: `${API_DOMAIN}api/v1/cart`,
};

export const REVIEW_API_ENDPOINTS = {
  REVIEW: `${API_DOMAIN}api/v1/review`,

export const RETURN_API_ENDPOINTS = {
  RETURN: `${API_DOMAIN}api/v1/return`,
};
