import { NotificationEvent } from "../core/notification";
import NotificationService from "../services/notification.service";
import { Socket } from "socket.io";


export default {
  createAndSend: async (notif: NotificationEvent, socket?: Socket) => {

    if (socket)
      notif.markAsSent();
    
    const notification = await NotificationService.createNotification(notif);

    if (socket)
      socket.emit('notification-new', notification);
  },

  // flush: async (userId: number, socket?: Socket) => {
  //   if (!socket)
  //     return;
  //   const { notifications } = await NotificationService.getNotifications(userId, { status: NotificationStatus.NOT_SENT });

  //   notifications.forEach(async notif => {
  //     socket.emit('notification-flush', notif);
  //     await NotificationService.updateNotifStatus(notif.notificationId, NotificationStatus.SENT);
  //   });
  // }

}