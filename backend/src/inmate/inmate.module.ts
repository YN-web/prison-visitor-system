import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { InmateController } from './inmate.controller';
import { InmateService } from './inmate.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    AuthModule,
  ],
  controllers: [InmateController],
  providers: [InmateService],
})
export class InmateModule {}