import { UserProfile } from '@prisma/client';
import UserService from '../../user/user.service';
import JWT from '../auth/JWT';
import { Socket } from 'socket.io';
import IOController from '../../../core/socket/ioController';

const ioController = new IOController();

ioController.use(async (socket: Socket, next: any) => {
  const token = socket.handshake.auth?.token;
  if (token) {
    const sub: any = JWT.verifyToken(token).sub;
    if (sub) {
      socket.user = (await UserService.getUserProfile(
        sub.userId,
      )) as UserProfile;
    }
  }
  next();
});

export default ioController;
