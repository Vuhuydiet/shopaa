import IOController from "../../core/socket/ioController";
const ioController = new IOController();

ioController.on('test', async (socket, data) => {
  socket.emit('test', 'ok ' + data);
});

export default ioController;