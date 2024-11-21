import { useQuery } from 'react-query';
import { USER_API_ENDPOINTS } from '../../config/API_config';
import axios from 'axios';
import { IUser } from '../../interfaces/IUser';

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => fetchUserDetail(id),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

async function fetchUserDetail(id: string) {
  try {
    const res = await axios.get(`${USER_API_ENDPOINTS.USER_PROFILE}${id}`);
    const data = res?.data;
    if (data?.metadata?.profile) {
      const user = data.metadata.profile;
      const result = {
        id: user?.userId,
        fullName: user?.fullName,
        avatar: {
          id: user?.avatarImage?.imageId,
          publicId: user?.avatarImage?.publicId,
          url: user?.avatarImage?.url,
          createAt: user?.avatarImage?.createdAt,
        },
      };
      return result;
    }
  } catch (error) {
    console.log(error);
  }
  return {} as IUser;
}
