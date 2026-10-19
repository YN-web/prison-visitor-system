import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PrisonService } from './prison.service';
import { CreatePrisonDto } from './dto/create-prison.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('prison')
export class PrisonController {
  constructor(
    private readonly prisonService: PrisonService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERINTENDENT', 'ADMIN')
  create(@Body() createPrisonDto: CreatePrisonDto) {
    return this.prisonService.create(createPrisonDto);
  }

  @Get()
  findAll() {
    return this.prisonService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.prisonService.findOne(id);
  }
}