import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';
import { ManagementController } from './management.controller';
import { ManagementService } from './management.service';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    AuthModule,
  ],
  controllers: [ManagementController],
  providers: [ManagementService],
})
export class ManagementModule {}