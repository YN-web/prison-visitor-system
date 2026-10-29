
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Request,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Query('type') type: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    if (type !== 'visitor' && type !== 'staff') {
      throw new UnauthorizedException(
        'Specify the login type: visitor or staff',
      );
    }

    const result = await this.authService.login(loginDto);
    const isVisitor = result.user.role === 'VISITOR';

    if (type === 'visitor' && !isVisitor) {
      throw new UnauthorizedException(
        'This account is not a visitor account',
      );
    }

    if (type === 'staff' && isVisitor) {
      throw new UnauthorizedException(
        'This account is not a staff account',
      );
    }

    const cookieName =
      type === 'visitor'
        ? 'visitorAccessToken'
        : 'staffAccessToken';

    response.cookie(cookieName, result.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000,
      path: '/',
    });

    // Remove the old shared cookie.
    response.clearCookie('accessToken', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
    });

    return {
      message: result.message,
      user: result.user,
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Request() request: any) {
    return this.authService.getMe(request.user.userId);
  }

  @Get('visitor-me')
  @UseGuards(JwtAuthGuard)
  async getVisitorMe(@Request() request: any) {
    return this.authService.getMe(request.user.userId);
  }

  @Get('staff-me')
  @UseGuards(JwtAuthGuard)
  async getStaffMe(@Request() request: any) {
    return this.authService.getMe(request.user.userId);
  }

  @Delete('logout')
  logout(
    @Query('type') type: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    if (type !== 'visitor' && type !== 'staff') {
      throw new UnauthorizedException(
        'Specify the logout type: visitor or staff',
      );
    }

    const cookieName =
      type === 'visitor'
        ? 'visitorAccessToken'
        : 'staffAccessToken';

    response.clearCookie(cookieName, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
    });

    return {
      message: 'Logout successful',
    };
  }
}
