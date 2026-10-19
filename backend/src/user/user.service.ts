import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createStaff(createStaffDto: CreateStaffDto) {
    const {
      fullName,
      nationalId,
      phoneNumber,
      email,
      password,
      roleName,
      prisonId,
    } = createStaffDto;

    const role = await this.prisma.role.findUnique({
      where: { name: roleName },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    if (role.name === 'VISITOR') {
      throw new BadRequestException(
        'This endpoint cannot be used to create visitor accounts',
      );
    }

    const prison = await this.prisma.prison.findUnique({
      where: { id: prisonId },
    });

    if (!prison) {
      throw new NotFoundException('Prison not found');
    }

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { nationalId },
          { phoneNumber },
          { email },
        ],
      },
    });

    if (existingUser) {
      throw new BadRequestException(
        'A user with this National ID, phone number, or email already exists',
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const staff = await this.prisma.user.create({
      data: {
        fullName,
        nationalId,
        phoneNumber,
        email,
        passwordHash,
        roleId: role.id,
        prisonId,
      },
      include: {
        role: true,
        prison: true,
      },
    });

    return {
      message: 'Staff account created successfully',
      staff: {
        id: staff.id,
        fullName: staff.fullName,
        nationalId: staff.nationalId,
        phoneNumber: staff.phoneNumber,
        email: staff.email,
        role: staff.role.name,
        prison: staff.prison?.name,
        isActive: staff.isActive,
      },
    };
  }
}