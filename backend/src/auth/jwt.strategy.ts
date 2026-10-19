import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          const path = request?.originalUrl || request?.url || '';

          // Management routes use the staff cookie
          if (path.startsWith('/management')) {
            return request?.cookies?.staffAccessToken;
          }

          // Visitor routes use the visitor cookie
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