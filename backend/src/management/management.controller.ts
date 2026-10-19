import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import { ManagementService } from './management.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('management/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(
  'ADMIN',
  'PRISON_OFFICER',
  'GATE_GUARD',
  'SUPERINTENDENT',
  'IT_SUPPORT',
)
export class ManagementController {
  constructor(
    private readonly managementService: ManagementService,
  ) {}

  @Get('stats')
  getDashboardStats() {
    return this.managementService.getDashboardStats();
  }
}