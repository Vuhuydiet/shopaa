import { Socket } from "socket.io";
import { UnauthorizedError } from "../../../core/socket/socketError";

const isAuth = async (socket: Socket) => {
  if (!socket.user) {
    throw new UnauthorizedError();
  }
  return true;
}

export default isAuth;