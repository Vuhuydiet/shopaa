const API_DOMAIN = 'http://localhost:3000/';

export const AUTH_API_ENDPOINTS = {
  SEND_OTP: `${API_DOMAIN}api/v1/access/send-otp`,
  SIGN_UP: `${API_DOMAIN}api/v1/access/sign-up`,
  SIGN_IN: `${API_DOMAIN}api/v1/access/sign-in`,
  FORGOT_PASSWORD: `${API_DOMAIN}api/v1/access/forgot-password`,
};
