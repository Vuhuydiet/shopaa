import { USER_API_ENDPOINTS } from '../config/API_config';

// GET USER INFORMATION
export const getUserProfile = async (usedId: number, token: string) => {
  try {
    const response = await fetch(
      `${USER_API_ENDPOINTS.USER_PROFILE}${usedId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Error fetching user profile: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// UPDATE PROFILE USER
export const updateUserProfile = async (
  token: string,
  profileData: any,
  avatarFile: File | null,
) => {
  try {
    const formData = new FormData();
    formData.append('profile', JSON.stringify(profileData));
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }

    const response = await fetch(`${USER_API_ENDPOINTS.USER_PROFILE}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      console.log('Server error message:', errorMessage);
      throw new Error(`Error updating user profile: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// DELETE USER
export const deleteUser = async (token: string) => {
  try {
    const response = await fetch(`${USER_API_ENDPOINTS.USER_PROFILE}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error deleting user: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
