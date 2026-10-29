
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';

import { GateDutyService } from './gate-duty.service';
import { GateOperationsService } from './gate-operations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('gate-operations')
@UseGuards(JwtAuthGuard)
export class GateOperationsController {
  constructor(
    private readonly gateDutyService: GateDutyService,
    private readonly gateOperationsService: GateOperationsService,
  ) {}

  @Get('access')
  async checkAccess(
    @Query('prisonId') prisonId: string,
    @Request() req: { user: { userId: string } },
  ) {
    if (!prisonId) {
      throw new BadRequestException(
        'Prison ID is required',
      );
    }

    const assignment =
      await this.gateDutyService.verifyActiveGateDuty(
        req.user.userId,
        prisonId,
      );

    return {
      message: 'Gate duty access verified',
      assignment,
    };
  }

  @Post('check-in')
  async checkIn(
    @Body() body: { prisonId: string; visitId: string },
    @Request() req: { user: { userId: string } },
  ) {
    if (!body.prisonId || !body.visitId) {
      throw new BadRequestException(
        'Prison ID and visit ID are required',
      );
    }

    return this.gateOperationsService.checkIn(
      req.user.userId,
      body.prisonId,
      body.visitId,
    );
  }

  
@Post('check-out')
async checkOut(
  @Body() body: { prisonId: string; visitId: string },
  @Request() req: { user: { userId: string } },
) {
  if (!body?.prisonId || !body?.visitId) {
    throw new BadRequestException(
      'Prison ID and visit ID are required',
    );
  }

  return this.gateOperationsService.checkOut(
    req.user.userId,
    body.prisonId,
    body.visitId,
  );
}

}
