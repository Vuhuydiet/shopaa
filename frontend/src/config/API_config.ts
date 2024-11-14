const API_DOMAIN = 'http://localhost:3000/';

export const AUTH_API_ENDPOINTS = {
  SEND_OTP: `${API_DOMAIN}api/v1/access/send-otp`,
  SIGN_UP: `${API_DOMAIN}api/v1/access/sign-up`,
  SIGN_IN: `${API_DOMAIN}api/v1/access/sign-in`,
};

export const USER_API_ENDPOINTS = {
  USER_PROFILE: `${API_DOMAIN}api/v1/user/`,
};

export const SHOP_API_ENDPOINTS = {
  SHOP: `${API_DOMAIN}api/v1/shop/`,
  REGISTER_SHOP: `${API_DOMAIN}api/v1/shop/register`,
};
