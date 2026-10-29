
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
  (request) => {
    const path =
      request?.originalUrl || request?.url || '';

    // Staff routes
    if (
      path.startsWith('/auth/staff-me') ||
      path.startsWith('/management') ||
      path.startsWith('/user')||
      path.startsWith('/gate-duty')||
      path.startsWith('/gate-operations')||
      path.startsWith('/inmate')
    
    ) {
      return request?.cookies?.staffAccessToken;
    }

    // Visitor routes
    return request?.cookies?.visitorAccessToken;
  },
]),

      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET!,
    });
  }

  async validate(payload: {
    sub: string;
    email: string;
    role: string;
  }) {
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
