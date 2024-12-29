import http from 'http';
import { Server } from 'socket.io';
import { Express } from 'express';

import ioController from './io';
import socketPool from './socketPool';
import notificationIoServive from '../notification/io/notification.io.servive';

const createWss = (app: Express) => {
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  ioController.middlewares.forEach((middleware) => io.use(middleware));

  io.on('connection', async (socket) => {
    const id = socketPool.addSocket(socket);

    if (!isNaN(+id)) {
      await notificationIoServive.flush(+id);
    }

    console.log(23423);
    
    ioController.applyOn(socket);
    
    socket.on('disconnect', () => {
      socketPool.removeSocket(id);
    });
  });

  return server;
}

export default createWss;