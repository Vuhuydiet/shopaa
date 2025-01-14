import IOController from "../../core/socket/ioController";
const ioController = new IOController();

import accessIO from '../access/io/access.io';
import notificationIO from '../notification/io/notification.io';
import testIO from '../test/test.io';

ioController.merge(accessIO);
ioController.merge(notificationIO);

ioController.merge(testIO);

export default ioController;