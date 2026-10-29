
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { GateDutyService } from './gate-duty.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { $Enums } from '@prisma/client';

import { GateOperationsService } from './gate-operations.service';

@Controller('gate-duty')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class GateDutyController {
  constructor(private readonly gateDutyService: GateDutyService,
      private readonly gateOperationsService: GateOperationsService,
  ) {}

  @Post()
  createAssignment(
    @Body()
    body: {
      staffId: string;
      prisonId: string;
      dutyDate: string;
      shift: $Enums.GateShift;
    },
    @Request() req: { user: { userId: string } },
  ) {
    return this.gateDutyService.createAssignment({
      ...body,
      assignedById: req.user.userId,
    });
  }

  @Get()
  findAll() {
    return this.gateDutyService.findAll();
  }

  @Patch(':id/cancel')
  cancelAssignment(@Param('id') id: string) {
    return this.gateDutyService.cancelAssignment(id);
  }

  @Post('check-in')
async checkIn(
  @Body() body: { prisonId: string; visitId: string },
  @Request() req: { user: { userId: string } },
) {
  return this.gateOperationsService.checkIn(
    req.user.userId,
    body.prisonId,
    body.visitId,
  );
}
}
