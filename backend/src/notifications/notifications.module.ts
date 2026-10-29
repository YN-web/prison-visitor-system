
import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PrismaModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
