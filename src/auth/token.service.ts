import { Injectable } from '@nestjs/common';
import { JwtPayload } from './strategies/access.strategy';
import { JwtService } from '@nestjs/jwt';

export type TokenResponse = {
  accessToken: string;
  refreshToken: string;
};

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}

  async generateToken(
    data: JwtPayload,
    secret: string,
    expiresIn: string | number,
  ): Promise<string> {
    const token = this.jwtService.signAsync(data, {
      expiresIn,
      secret,
    });
    return token;
  }

  async generateTokens(userId: string, email: string): Promise<TokenResponse> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.generateToken(jwtPayload, 'secret', '15m'),
      this.generateToken(jwtPayload, 'secret', '7d'),
    ]);

    return { accessToken, refreshToken };
  }
}
