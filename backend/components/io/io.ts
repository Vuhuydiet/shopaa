import IOController from "../../core/socket/ioController";
const ioController = new IOController();

import accessIO from '../access/io/access.io';
import notificationIO from '../notification/io/notification.io';

ioController.merge(accessIO);
ioController.merge(notificationIO);

export default ioController;