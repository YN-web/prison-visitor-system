import {
      BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVisitDto } from './dto/create-visit.dto';

@Injectable()
export class VisitService {
  constructor(private readonly prisma: PrismaService) {}

  async createVisit(userId: string, createVisitDto: CreateVisitDto) {
    const { inmateId, visitDate, slotId, purpose } = createVisitDto;
    const requestedDate = new Date(visitDate);

if (requestedDate <= new Date()) {
  throw new BadRequestException(
    'Visit date must be in the future',
  );
}

const rwandaDate = new Date(
  requestedDate.toLocaleString('en-US', {
    timeZone: 'Africa/Kigali',
  }),
);

const hours = rwandaDate.getHours();
const minutes = rwandaDate.getMinutes();

const timeInMinutes = hours * 60 + minutes;

const openingTime = 9 * 60;
const closingTime = 17 * 60;

if (
  timeInMinutes < openingTime ||
  timeInMinutes > closingTime
) {
  throw new BadRequestException(
    'Visit time must be between 09:00 and 17:00 Rwanda time',
  );
}

    // Find the visitor profile of the logged-in user
    const visitor = await this.prisma.visitorProfile.findUnique({
      where: {
        userId,
      },
    });

    if (!visitor) {
      throw new NotFoundException(
        'Visitor profile not found',
      );
    }

    // Check that the inmate exists
    const inmate = await this.prisma.inmate.findUnique({
      where: {
        id: inmateId,
      },
    });

    if (!inmate) {
      throw new NotFoundException(
        'Inmate not found',
      );
    }

    // Create the visit request
    const visit = await this.prisma.visit.create({
      data: {
        visitorId: visitor.id,
        inmateId,
        visitDate: requestedDate,
        slotId,
        purpose,
      },
      include: {
        inmate: true,
        visitor: true,
      },
    });

    return {
      message: 'Visit request submitted successfully',
      visit,
    };
  }

  async findMyVisits(userId: string) {
  const visitor = await this.prisma.visitorProfile.findUnique({
    where: { userId },
  });

  if (!visitor) {
    throw new NotFoundException('Visitor profile not found');
  }

  return this.prisma.visit.findMany({
    where: {
      visitorId: visitor.id,
    },
    include: {
      inmate: {
        select: {
          id: true,
          inmateNumber: true,
          fullName: true,
        },
      },
      slot: true,
    },
    orderBy: {
      visitDate: 'desc',
    },
  });
}

async cancelVisit(visitId: string, userId: string) {
  const visitor = await this.prisma.visitorProfile.findUnique({
    where: { userId },
  });

  if (!visitor) {
    throw new NotFoundException('Visitor profile not found');
  }

  const visit = await this.prisma.visit.findUnique({
    where: { id: visitId },
  });

  if (!visit) {
    throw new NotFoundException('Visit not found');
  }

  if (visit.visitorId !== visitor.id) {
    throw new BadRequestException(
      'You can only cancel your own visit requests',
    );
  }

  if (visit.status !== 'PENDING') {
    throw new BadRequestException(
      'Only pending visit requests can be cancelled',
    );
  }

  return this.prisma.visit.update({
    where: { id: visitId },
    data: {
      status: 'CANCELLED',
    },
  });
}

async deleteVisit(visitId: string, userId: string) {
  const visitor = await this.prisma.visitorProfile.findUnique({
    where: { userId },
  });

  if (!visitor) {
    throw new NotFoundException('Visitor profile not found');
  }

  const visit = await this.prisma.visit.findUnique({
    where: { id: visitId },
  });

  if (!visit) {
    throw new NotFoundException('Visit not found');
  }

  if (visit.visitorId !== visitor.id) {
    throw new BadRequestException(
      'You can only delete your own visit requests',
    );
  }

  if (visit.status !== 'PENDING') {
    throw new BadRequestException(
      'Only pending visit requests can be deleted',
    );
  }

  await this.prisma.visit.delete({
    where: { id: visitId },
  });

  return {
    message: 'Visit request deleted successfully',
  };
}

async getMyVisitStats(userId: string) {
  const visitor = await this.prisma.visitorProfile.findUnique({
    where: { userId },
  });

  if (!visitor) {
    throw new NotFoundException('Visitor profile not found');
  }

  const [
    pending,
    approved,
    completed,
    rejected,
  ] = await Promise.all([
    this.prisma.visit.count({
      where: {
        visitorId: visitor.id,
        status: 'PENDING',
      },
    }),

    this.prisma.visit.count({
      where: {
        visitorId: visitor.id,
        status: 'APPROVED',
      },
    }),

    this.prisma.visit.count({
      where: {
        visitorId: visitor.id,
        status: 'COMPLETED',
      },
    }),

    this.prisma.visit.count({
      where: {
        visitorId: visitor.id,
        status: 'REJECTED',
      },
    }),
  ]);

  return {
    pending,
    approved,
    completed,
    rejected,
  };
}
}