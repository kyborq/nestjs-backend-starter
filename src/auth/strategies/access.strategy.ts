import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export type JwtPayload = {
  email: string;
  sub: string;
};

@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy, 'access-jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'SecretHehe',
    });
  }

  validate(payload: JwtPayload) {
    return payload;
  }
}
