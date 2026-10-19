import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePrisonDto } from './dto/create-prison.dto';

@Injectable()
export class PrisonService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPrisonDto: CreatePrisonDto) {
    return this.prisma.prison.create({
      data: {
        name: createPrisonDto.name,
        location: createPrisonDto.location,
      },
    });
  }

  async findAll() {
    return this.prisma.prison.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const prison = await this.prisma.prison.findUnique({
      where: { id },
    });

    if (!prison) {
      throw new NotFoundException('Prison not found');
    }

    return prison;
  }
}