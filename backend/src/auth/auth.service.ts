
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomInt } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto) {
    const { fullName, nationalId, phoneNumber, email, password } = signupDto;

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { nationalId },
          { phoneNumber },
        ],
      },
    });

    if (existingUser) {
      throw new ConflictException(
        'Email, National ID, or phone number is already registered',
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const visitorRole = await this.prisma.role.findUnique({
      where: {
        name: 'VISITOR',
      },
    });

    if (!visitorRole) {
      throw new ConflictException(
        'VISITOR role has not been created yet',
      );
    }

    // Generate a unique 5-digit Visitor Number
    let visitorNumber: string;

    do {
      visitorNumber = randomInt(10000, 100000).toString();

      const existingVisitor =
        await this.prisma.visitorProfile.findUnique({
          where: {
            visitorNumber,
          },
        });

      if (!existingVisitor) {
        break;
      }
    } while (true);

    // Create the user and VisitorProfile together
    const user = await this.prisma.user.create({
      data: {
        fullName,
        nationalId,
        phoneNumber,
        email,
        passwordHash,
        roleId: visitorRole.id,

        visitorProfile: {
          create: {
            visitorNumber,
          },
        },
      },

      select: {
        id: true,
        fullName: true,
        nationalId: true,
        phoneNumber: true,
        email: true,

        role: {
          select: {
            name: true,
          },
        },

        createdAt: true,

        visitorProfile: {
          select: {
            visitorNumber: true,
          },
        },
      },
    });

    return {
      message: 'Account created successfully',
      user,
    };
  }

  // Login
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        role: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException(
        'Invalid email or password',
      );
    }

    if (!user.isActive) {
      throw new UnauthorizedException(
        'This account is inactive',
      );
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role.name,
    });

    return {
      message: 'Login successful',
      accessToken,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role.name,
      },
    };
  }

  // Get current logged-in user
  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: true,
        visitorProfile: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      userId: user.id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      nationalId: user.nationalId,
      role: user.role.name,
      visitorNumber:
        user.visitorProfile?.visitorNumber ?? null,
    };
  }
}

