import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { VisitModule } from './visit/visit.module';
import { InmateModule } from './inmate/inmate.module';
import { PrisonModule } from './prison/prison.module';
import { UserModule } from './user/user.module';
import { ManagementModule } from './management/management.module';
@Module({
  imports: [PrismaModule, AuthModule,VisitModule, InmateModule ,PrisonModule, UserModule,ManagementModule,],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule {}