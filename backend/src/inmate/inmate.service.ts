import {
BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInmateDto } from './dto/create-inmate.dto';

@Injectable()
export class InmateService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createInmateDto: CreateInmateDto) {
    const { inmateNumber, fullName, prisonId } =
      createInmateDto;

    const prison = await this.prisma.prison.findUnique({
      where: {
        id: prisonId,
      },
    });

    if (!prison) {
      throw new NotFoundException(
        'Prison not found',
      );
    }

    return this.prisma.inmate.create({
      data: {
        inmateNumber,
        fullName,
        prisonId,
      },
    });
  }

  async findAll() {
    return this.prisma.inmate.findMany({
      where: {
        isActive: true,
      },
      include: {
        prison: true,
      },
      orderBy: {
        fullName: 'asc',
      },
    });
  }

  async search(query: string) {
  const search = query.trim();

  if (search.length < 2) {
    throw new BadRequestException(
      'Search must contain at least 2 characters',
    );
  }

  return this.prisma.inmate.findMany({
    where: {
      isActive: true,
      OR: [
        {
          fullName: {
            contains: search,
          },
        },
        {
          inmateNumber: {
            contains: search,
          },
        },
      ],
    },
    include: {
      prison: true,
    },
    orderBy: {
      fullName: 'asc',
    },
    take: 20,
  });
}

  async findOne(id: string) {
    const inmate = await this.prisma.inmate.findUnique({
      where: {
        id,
      },
      include: {
        prison: true,
      },
    });

    if (!inmate) {
      throw new NotFoundException(
        'Inmate not found',
      );
    }

    return inmate;
  }
}