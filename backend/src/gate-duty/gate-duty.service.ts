
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { $Enums } from '@prisma/client';

@Injectable()
export class GateDutyService {
  constructor(private readonly prisma: PrismaService) {}

  async createAssignment(data: {
    staffId: string;
    prisonId: string;
    dutyDate: string;
    shift: $Enums.GateShift;
    assignedById: string;
  }) {
    const dutyDate = new Date(data.dutyDate);

    if (Number.isNaN(dutyDate.getTime())) {
      throw new BadRequestException('Invalid duty date');
    }

    if (dutyDate < new Date(new Date().toDateString())) {
      throw new BadRequestException('Duty date cannot be in the past');
    }

    const staff = await this.prisma.user.findUnique({
      where: { id: data.staffId },
      include: { role: true },
    });

    if (!staff || !staff.isActive) {
      throw new NotFoundException('Active staff member not found');
    }

    if (staff.role.name === 'VISITOR') {
      throw new BadRequestException(
        'Visitor accounts cannot be assigned to gate duty',
      );
    }

    if (staff.prisonId !== data.prisonId) {
      throw new BadRequestException(
        'Staff member must belong to the selected prison',
      );
    }

    const prison = await this.prisma.prison.findUnique({
      where: { id: data.prisonId },
    });

    if (!prison || !prison.isActive) {
      throw new NotFoundException('Active prison not found');
    }

    const startOfDay = new Date(dutyDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(dutyDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existing = await this.prisma.gateDutyAssignment.findFirst({
      where: {
        staffId: data.staffId,
        dutyDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
        shift: data.shift,
        isActive: true,
      },
    });

    if (existing) {
      throw new BadRequestException(
        'This staff member already has an active assignment for that shift',
      );
    }

    return this.prisma.gateDutyAssignment.create({
      data: {
        staffId: data.staffId,
        prisonId: data.prisonId,
        dutyDate,
        shift: data.shift,
        assignedById: data.assignedById,
      },
      include: {
        staff: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        prison: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.gateDutyAssignment.findMany({
      include: {
        staff: {
          select: {
            id: true,
            fullName: true,
            email: true,
            isActive: true,
          },
        },
        prison: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [{ dutyDate: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async cancelAssignment(id: string) {
    const assignment =
      await this.prisma.gateDutyAssignment.findUnique({
        where: { id },
      });

    if (!assignment) {
      throw new NotFoundException('Gate duty assignment not found');
    }

    if (!assignment.isActive) {
      throw new BadRequestException(
        'This assignment has already been cancelled',
      );
    }

    return this.prisma.gateDutyAssignment.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async verifyActiveGateDuty(
  staffId: string,
  prisonId: string,
) {
  const staff = await this.prisma.user.findUnique({
    where: { id: staffId },
    include: { role: true },
  });

  if (!staff || !staff.isActive) {
    throw new ForbiddenException(
      'Your staff account is inactive or does not exist',
    );
  }

  if (staff.role.name === 'VISITOR') {
    throw new ForbiddenException(
      'Visitors cannot perform gate operations',
    );
  }

  if (staff.prisonId !== prisonId) {
    throw new ForbiddenException(
      'You are not assigned to this prison',
    );
  }

  const prison = await this.prisma.prison.findUnique({
    where: { id: prisonId },
  });

  if (!prison || !prison.isActive) {
    throw new ForbiddenException(
      'This prison is inactive or does not exist',
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const assignment =
    await this.prisma.gateDutyAssignment.findFirst({
      where: {
        staffId,
        prisonId,
        dutyDate: {
          gte: today,
          lt: tomorrow,
        },
        isActive: true,
      },
    });

  if (!assignment) {
    throw new ForbiddenException(
      'You do not have an active gate duty assignment for this prison today',
    );
  }

  return assignment;
}
}
