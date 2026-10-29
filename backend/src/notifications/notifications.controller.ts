
import {
  Controller,
  Get,
  Patch,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
  ) {}

  // Get all notifications for the logged-in user
  @Get()
  findAll(@Request() request: any) {
    return this.notificationsService.findAll(
      request.user.userId,
    );
  }

  // Get unread notification count
  @Get('unread-count')
  countUnread(@Request() request: any) {
    return this.notificationsService.countUnread(
      request.user.userId,
    );
  }

  // Mark one notification as read
  @Patch(':id/read')
  markAsRead(
    @Request() request: any,
    @Param('id') notificationId: string,
  ) {
    return this.notificationsService.markAsRead(
      request.user.userId,
      notificationId,
    );
  }

  // Mark all notifications as read
  @Patch('read-all')
  markAllAsRead(@Request() request: any) {
    return this.notificationsService.markAllAsRead(
      request.user.userId,
    );
  }
}
