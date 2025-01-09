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

export const changePW = async (
  token: string,
  oldPassword: string,
  newPassword: string,
): Promise<{ message: string }> => {
  const response = await fetch(AUTH_API_ENDPOINTS.CHANGE_PASSWORD, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token,
      oldPassword,
      newPassword,
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

export const getAccount = async (
  token: string,
): Promise<
  | { message: string }
  | { metadata: { user: { username: string; email: string } } }
> => {
  try {
    const response = await fetch(AUTH_API_ENDPOINTS.ACCOUNT, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch account data');
    }

    const data = await response.json();

    console.log('Account data:', data);

    if (data?.metadata && data?.metadata.user) {
      return data;
    }

    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Error in getAccount:', error);
    return { message: (error as Error).message };
  }
};
