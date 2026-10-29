
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GateDutyController } from './gate-duty.controller';
import { GateDutyService } from './gate-duty.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { GateOperationsController } from './gate-operations.controller';
import { GateOperationsService } from './gate-operations.service';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
  ],
  controllers: [GateDutyController,GateOperationsController,],
  providers: [GateDutyService,  GateOperationsService,],
  exports: [GateDutyService],
})
export class GateDutyModule {}
