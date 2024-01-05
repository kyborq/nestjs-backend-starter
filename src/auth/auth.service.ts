import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { UsersService } from 'src/users/users.service';
import { TokenResponse, TokenService } from './token.service';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokenService: TokenService,
  ) {}

  async registerUser(registerDto: RegisterDto) {
    const existedUser = await this.usersService.getByEmail(registerDto.email);

    if (existedUser) {
      throw new BadRequestException('User already exist');
    }

    const hash = await argon.hash(registerDto.password);

    const createdUser = await this.usersService.createUser({
      ...registerDto,
      password: hash,
    });

    const tokens = await this.tokenService.generateTokens(
      createdUser.id,
      createdUser.email,
    );
    await this.usersService.updateToken(createdUser.id, tokens.refreshToken);

    // 6. Send verification email (optional)
  }

  async loginUser(loginDto: LoginDto): Promise<TokenResponse> {
    const user = await this.usersService.getByEmail(loginDto.login);

    const passwordMatches = await argon.verify(
      user.password,
      loginDto.password,
    );

    if (!passwordMatches) {
      throw new ForbiddenException('Access Denied');
    }

    const tokens = await this.tokenService.generateTokens(user.id, user.email);
    const hashedToken = await argon.hash(tokens.refreshToken);

    await this.usersService.updateToken(user.id, hashedToken);

    return tokens;
  }

  async logoutUser(userId: string) {
    return this.usersService.updateToken(userId, null);
  }

  async refreshToken(userId: string, refreshToken: string) {
    const user = await this.usersService.getById(userId);

    if (!user || !user.token) {
      throw new ForbiddenException('Access Denied');
    }

    const tokenMatches = await argon.verify(user.token, refreshToken);
    if (!tokenMatches) {
      throw new ForbiddenException('Access Denied');
    }

    const tokens = await this.tokenService.generateTokens(userId, user.email);
    const hashedToken = await argon.hash(tokens.refreshToken);

    return this.usersService.updateToken(userId, hashedToken);
  }
}
