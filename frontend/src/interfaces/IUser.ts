import { IImage } from './IImage';

export interface IUser {
  id: number;
  fullName: string;
  avatar: IImage;
  gender: string;
}
