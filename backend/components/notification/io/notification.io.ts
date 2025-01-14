import { NotificationStatus } from "@prisma/client";
import IOController from "../../../core/socket/ioController";
import NotificationService from "../services/notification.service";
import isAuth from "../../access/io/authentication";
const ioController = new IOController();

ioController.on('notification-read', isAuth);

ioController.on('notification-read', async (_socket, notificationId) => {
  await NotificationService.updateNotifStatus(notificationId, NotificationStatus.READ);
});

export default ioController;