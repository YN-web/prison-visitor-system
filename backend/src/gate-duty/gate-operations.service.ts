
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { GateDutyService } from './gate-duty.service';

@Injectable()
export class GateOperationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateDutyService: GateDutyService,
  ) {}

  async checkIn(
    staffId: string,
    prisonId: string,
    visitId: string,
  ) {
    // Verify that the staff member is assigned to gate duty today.
    await this.gateDutyService.verifyActiveGateDuty(
      staffId,
      prisonId,
    );

    const visit = await this.prisma.visit.findUnique({
      where: { id: visitId },
      include: {
        inmate: true,
        slot: true,
      },
    });

    if (!visit) {
      throw new NotFoundException('Visit not found');
    }

    if (visit.inmate.prisonId !== prisonId) {
      throw new ForbiddenException(
        'This visit belongs to another prison',
      );
    }

    if (
      visit.slot &&
      visit.slot.prisonId !== prisonId
    ) {
      throw new ForbiddenException(
        'The visit slot belongs to another prison',
      );
    }

    if (!visit.inmate.isActive) {
      throw new BadRequestException(
        'The inmate is not active',
      );
    }

    if (visit.status !== $Enums.VisitStatus.APPROVED) {
      throw new BadRequestException(
        'Only approved visits can check in',
      );
    }

    const now = new Date();

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setDate(
      startOfTomorrow.getDate() + 1,
    );

    if (
      visit.visitDate < startOfToday ||
      visit.visitDate >= startOfTomorrow
    ) {
      throw new BadRequestException(
        'Only visits scheduled for today can check in',
      );
    }

    if (visit.checkedInAt || visit.checkedOutAt) {
      throw new BadRequestException(
        'This visit has already been checked in or completed',
      );
    }

    // Atomically change the status only if it is still APPROVED.
    // This helps prevent duplicate check-ins from simultaneous requests.
    const result = await this.prisma.visit.updateMany({
      where: {
        id: visitId,
        status: $Enums.VisitStatus.APPROVED,
        checkedInAt: null,
        checkedOutAt: null,
      },
      data: {
        status: $Enums.VisitStatus.CHECKED_IN,
        checkedInAt: now,
      },
    });

    if (result.count !== 1) {
      throw new BadRequestException(
        'This visit has already been processed. Refresh and try again.',
      );
    }

    await this.prisma.auditLog.create({
      data: {
        userId: staffId,
        action: 'VISITOR_CHECK_IN',
        entity: 'Visit',
        entityId: visitId,
        details: JSON.stringify({
          prisonId,
          checkedInAt: now.toISOString(),
        }),
      },
    });

    return {
      message: 'Visitor checked in successfully',
      visitId,
      checkedInAt: now,
      checkedInBy: staffId,
      status: $Enums.VisitStatus.CHECKED_IN,
    };
  }

  
async checkOut(
  staffId: string,
  prisonId: string,
  visitId: string,
) {
  // Confirm the officer has an active gate-duty assignment.
  await this.gateDutyService.verifyActiveGateDuty(staffId, prisonId);

  // Find the visit and its inmate.
  const visit = await this.prisma.visit.findUnique({
    where: { id: visitId },
    include: {
      inmate: true,
    },
  });

  if (!visit) {
    throw new NotFoundException('Visit not found');
  }

  if (visit.inmate.prisonId !== prisonId) {
    throw new ForbiddenException(
      'This visit does not belong to your assigned prison',
    );
  }

  if (visit.status !== 'CHECKED_IN') {
    throw new BadRequestException(
      'Only checked-in visitors can be checked out',
    );
  }

  if (!visit.checkedInAt || visit.checkedOutAt) {
    throw new BadRequestException(
      'This visit cannot be checked out',
    );
  }

  const checkedOutAt = new Date();

  // Update only if the visit is still checked in.
  const result = await this.prisma.visit.updateMany({
    where: {
      id: visitId,
      status: 'CHECKED_IN',
      checkedInAt: { not: null },
      checkedOutAt: null,
    },
    data: {
      status: 'CHECKED_OUT',
      checkedOutAt,
    },
  });

  if (result.count !== 1) {
    throw new BadRequestException(
      'Check-out failed. The visit may already be checked out',
    );
  }

  // Record the check-out in the audit log.
  await this.prisma.auditLog.create({
    data: {
      userId: staffId,
      action: 'VISITOR_CHECK_OUT',
      entity: 'Visit',
      entityId: visitId,
      details: JSON.stringify({
        prisonId,
        checkedOutAt: checkedOutAt.toISOString(),
      }),
    },
  });

  return {
    message: 'Visitor checked out successfully',
    visitId,
    checkedOutAt,
    checkedOutBy: staffId,
    status: 'CHECKED_OUT',
  };
}

}
