import { UserProfile } from "@prisma/client";

declare module 'socket.io' {
  interface Socket {
    user?: UserProfile;
  }
}