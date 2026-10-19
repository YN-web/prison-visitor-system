import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { PrisonController } from './prison.controller';
import { PrisonService } from './prison.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    AuthModule,
  ],
  controllers: [PrisonController],
  providers: [PrisonService],
})
export class PrisonModule {}