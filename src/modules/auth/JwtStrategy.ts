import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_SECRET } from '@/src/common/constants';
import { JwtPayload } from '@/src/common/types';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    return {
      id: payload.sub,
      email: payload.email,
      status: payload.status,
    };
  }
}
