import { ForbiddenException, Injectable } from '@nestjs/common';
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
    // 2. Create User for db
    // 3. Save User in DB
    // 4. Generate tokens for User
    // 5. Save refresh token in db for User
    const hash = await argon.hash(registerDto.password);

    this.usersService.createUser({
      ...registerDto,
      password: hash,
      token: null,
    });
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

    await this.usersService.updateToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async logoutUser(userId: string) {
    return this.usersService.updateToken(userId, null);
  }

  async refreshToken(userId: string, refreshToken: string) {
    return this.usersService.updateToken(userId, refreshToken);
  }
}
