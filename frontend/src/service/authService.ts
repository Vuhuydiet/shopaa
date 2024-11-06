import { AUTH_API_ENDPOINTS } from '../config/API_config';


const handleResponse = async (response: Response): Promise<any> => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Sever error');
  }
  return response.json();
};

export const sendOtp = async (email: string): Promise<{ message: string }> => {
  const response = await fetch(AUTH_API_ENDPOINTS.SEND_OTP, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
    }),
  });
  return handleResponse(response);
};

export const signUp = async (
  username: string,
  password: string,
  email: string,
  otp: number,
): Promise<{ message: string }> => {
  const response = await fetch(AUTH_API_ENDPOINTS.SIGN_UP, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
      email,
      otp,
    }),
  });
  return handleResponse(response);
};
