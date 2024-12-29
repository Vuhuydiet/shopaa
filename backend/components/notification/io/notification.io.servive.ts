import { NotificationStatus } from "@prisma/client";
import socketPool from "../../io/socketPool";
import { NotificationEvent } from "../core/notification";
import NotificationService from "../services/notification.service";


export default {
  createAndSend: async (notif: NotificationEvent) => {
    const socket = socketPool.getSocket(notif.userId);
    if (socket)
      notif.markAsSent();

    const notification = await NotificationService.createNotification(notif);
    
    if (socket) {
      socket.emit('notification-new', notification);
    }
  },

  flush: async (userId: number) => {
    const { notifications } = await NotificationService.getNotifications(userId, { status: NotificationStatus.NOT_SENT });
    notifications.forEach(async notif => {
      const socket = socketPool.getSocket(userId);
      if (socket) {
        socket.emit('notification-flush', notif);
        await NotificationService.updateNotifStatus(notif.notificationId, NotificationStatus.UNREAD);
      }
    });
  }

}