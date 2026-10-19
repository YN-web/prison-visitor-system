import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { VisitController } from './visit.controller';
import { VisitService } from './visit.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    AuthModule,
  ],
  controllers: [VisitController],
  providers: [VisitService],
})
export class VisitModule {}