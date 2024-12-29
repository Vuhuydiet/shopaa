import { Socket } from 'socket.io';

import { MaxPoolSizeError } from '../../core/socket/socketError';
import { v4 as uuidv4 } from 'uuid';


class SocketPool {
  constructor() {
    this.m_Sockets = new Map<string | number, Socket>();
    this.m_Size = 0;
  }
  
  addSocket(socket: Socket) {
    if (this.m_Size >= 100)
      throw new MaxPoolSizeError();

    const key = socket.user?.userId ?? uuidv4();
    this.m_Sockets.set(key, socket);
    return key;
  }
  
  removeSocket(id: string | number) {
    this.m_Sockets.delete(id);
  }
  
  getSocket(id: string | number) {
    return this.m_Sockets.get(id);
  }

  get all() {
    return this.m_Sockets;
  }

  // attributes
  private m_Sockets: Map<number | string, Socket>;
  private m_Size;
}

export default new SocketPool();