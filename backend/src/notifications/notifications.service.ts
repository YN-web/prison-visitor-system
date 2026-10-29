
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  // Create a notification for a user
  async create(
    userId: string,
    title: string,
    message: string,
  ) {
    return this.prisma.notification.create({
      data: {
        userId,
        title,
        message,
      },
    });
  }

  // Get all notifications belonging to a user
  async findAll(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Count unread notifications
  async countUnread(userId: string) {
    return this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  // Mark one notification as read
  async markAsRead(
    userId: string,
    notificationId: string,
  ) {
    const result = await this.prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return {
      success: result.count > 0,
    };
  }

  // Mark all notifications as read
  async markAllAsRead(userId: string) {
    const result = await this.prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return {
      updatedCount: result.count,
    };
  }
}
