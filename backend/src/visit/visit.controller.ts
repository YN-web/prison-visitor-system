import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { VisitService } from './visit.service';
import { CreateVisitDto } from './dto/create-visit.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('visit')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('VISITOR')
export class VisitController {
  constructor(
    private readonly visitService: VisitService,
  ) {}

  @Post()
  createVisit(
    @Request() request: any,
    @Body() createVisitDto: CreateVisitDto,
  ) {
    return this.visitService.createVisit(
      request.user.userId,
      createVisitDto,
    );
  }

  @Get('my')
findMyVisits(@Request() request: any) {
  return this.visitService.findMyVisits(
    request.user.userId,
  );
}

@Get('stats')
getMyVisitStats(@Request() request: any) {
  return this.visitService.getMyVisitStats(
    request.user.userId,
  );
}

@Delete(':id/cancel')
cancelVisit(
  @Param('id') visitId: string,
  @Request() request: any,
) {
  return this.visitService.cancelVisit(
    visitId,
    request.user.userId,
  );
}

@Delete(':id')
deleteVisit(
  @Param('id') visitId: string,
  @Request() request: any,
) {
  return this.visitService.deleteVisit(
    visitId,
    request.user.userId,
  );
}
}