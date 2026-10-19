import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InmateService } from './inmate.service';
import { CreateInmateDto } from './dto/create-inmate.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('inmate')
export class InmateController {
  constructor(
    private readonly inmateService: InmateService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    'PRISON_OFFICER',
    'SUPERINTENDENT',
    'ADMIN',
  )
  create(@Body() createInmateDto: CreateInmateDto) {
    return this.inmateService.create(
      createInmateDto,
    );
  }

  @Get()
  findAll() {
    return this.inmateService.findAll();
  }


  @Get('search')
search(@Query('q') query: string) {
  return this.inmateService.search(query);
}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inmateService.findOne(id);
  }
}