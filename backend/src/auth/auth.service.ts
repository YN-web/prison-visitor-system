import { ConflictException, Injectable,  UnauthorizedException, } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

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

    const user = await this.prisma.user.create({
      data: {
        fullName,
        nationalId,
        phoneNumber,
        email,
        passwordHash,
        roleId: visitorRole.id,
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
      },
    });

    return {
      message: 'Account created successfully',
      user,
    };
  }

  //login 
  async login(loginDto: LoginDto) {
  const { email, password } = loginDto;

  const user = await this.prisma.user.findUnique({
    where: { email },
    include: {
      role: true,
    },
  });

  if (!user) {
    throw new UnauthorizedException('Invalid email or password');
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.passwordHash,
  );

  if (!passwordMatches) {
    throw new UnauthorizedException('Invalid email or password');
  }

  if (!user.isActive) {
    throw new UnauthorizedException('This account is inactive');
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
}