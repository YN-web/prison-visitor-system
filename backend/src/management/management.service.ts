import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ManagementService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats() {
    const totalVisitors = await this.prisma.visitorProfile.count();

    const today = new Date();

    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const todaysVisits = await this.prisma.visit.count({
      where: {
        visitDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    const [
      pendingRequests,
      approvedVisits,
      checkedIn,
      completed,
      rejected,
      noShows,
      cancelled,
    ] = await Promise.all([
      this.prisma.visit.count({
        where: { status: 'PENDING' },
      }),

      this.prisma.visit.count({
        where: { status: 'APPROVED' },
      }),

      this.prisma.visit.count({
        where: { status: 'CHECKED_IN' },
      }),

      this.prisma.visit.count({
        where: { status: 'COMPLETED' },
      }),

      this.prisma.visit.count({
        where: { status: 'REJECTED' },
      }),

      this.prisma.visit.count({
        where: { status: 'NO_SHOW' },
      }),

      this.prisma.visit.count({
        where: { status: 'CANCELLED' },
      }),
    ]);

    return {
      totalVisitors,
      todaysVisits,
      pendingRequests,
      approvedVisits,
      checkedIn,
      completed,
      rejected,
      noShows,
      cancelled,
    };
  }
}