import { Injectable } from '@nestjs/common';
import { JwtPayload } from './strategies/access.strategy';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export type TokenResponse = {
  accessToken: string;
  refreshToken: string;
};

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

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

  async generateVerifyToken(userId: string, email: string, verified: boolean) {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email,
      verified,
    };

    const token = await this.generateToken(
      jwtPayload,
      this.configService.get<string>('JWT_ACCESS_SECRET'),
      '15m',
    );

    return token;
  }

  async generateTokens(
    userId: string,
    email: string,
    verified: boolean,
  ): Promise<TokenResponse> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email,
      verified,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.generateToken(
        jwtPayload,
        this.configService.get<string>('JWT_ACCESS_SECRET'),
        '15m',
      ),
      this.generateToken(
        jwtPayload,
        this.configService.get<string>('JWT_REFRESH_SECRET'),
        '7d',
      ),
    ]);

    return { accessToken, refreshToken };
  }
}
