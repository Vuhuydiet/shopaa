import { NotificationStatus } from "@prisma/client";
import prisma from "../../../models";

import { NotificationEvent } from "../core/notification";


type NotificationQuery = {
  status?: NotificationStatus;
  type?: string; // 'order', 'review', 'system'
  from?: Date;
  to?: Date;

  limit?: number;
  offset?: number;
}

class NotificationService {

  static async createNotification(notification: NotificationEvent) {
    return await prisma.notificationEvent.create({
      data: notification.toObject()
    });
  }

  static async getNotifications(userId: number, query: NotificationQuery) {
    const condition = {
      userId: userId,
      status: query.status,
      eventType: query.type,
      createdAt: {
        gte: query.from,
        lte: query.to
      }
    };
    const count = await prisma.notificationEvent.count({
      where: condition
    });
    const notifications = await prisma.notificationEvent.findMany({
      take: query.limit,
      skip: query.offset,
      where: condition,
      orderBy: { createdAt: 'desc' }
    })
    return { count, notifications };
  }


  static async updateNotifStatus(notificationId: number, status: NotificationStatus) {
    return await prisma.notificationEvent.update({
      where: { notificationId },
      data: { status }
    });
  }
}


export default NotificationService;