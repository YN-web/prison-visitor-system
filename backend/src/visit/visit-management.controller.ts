import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';

import { VisitService } from './visit.service';
import { RejectVisitDto } from './dto/reject-visit.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('management/visits')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'PRISON_OFFICER')
export class VisitManagementController {
  constructor(
    private readonly visitService: VisitService,
  ) {}

  @Get('pending')
  findPendingVisits() {
    return this.visitService.findPendingVisits();
  }

  @Patch(':id/approve')
  approveVisit(
    @Param('id') visitId: string,
    @Request() request: any,
  ) {
    return this.visitService.approveVisit(
      visitId,
      request.user.userId,
    );
  }

  @Patch(':id/reject')
  rejectVisit(
    @Param('id') visitId: string,
    @Body() dto: RejectVisitDto,
    @Request() request: any,
  ) {
    return this.visitService.rejectVisit(
      visitId,
      request.user.userId,
      dto.rejectionReason,
    );
  }
}