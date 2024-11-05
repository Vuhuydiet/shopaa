const API_DOMAIN = 'http://localhost:3000/';

const handleResponse = async (response: Response): Promise<any> => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Sever error');
  }
  return response.json();
};

export const sendOtp = async (email: string): Promise<{ message: string }> => {
  const response = await fetch(`${API_DOMAIN}send-otp`, {
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
  const response = await fetch(`${API_DOMAIN}sign-up`, {
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
