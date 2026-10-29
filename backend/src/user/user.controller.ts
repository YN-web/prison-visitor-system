import {
  Body,
  Controller,
  Post,
  Get,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('staff')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  createStaff(
    @Body() createStaffDto: CreateStaffDto,
  ) {
    return this.userService.createStaff(createStaffDto);
  }

  @Get()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
findAllStaff() {
  return this.userService.findAllStaff();
}
}