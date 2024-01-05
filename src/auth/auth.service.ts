import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { UsersService } from 'src/users/users.service';
import { TokenResponse } from './utils/token.utils';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async registerUser(registerDto: RegisterDto) {
    // 1. Hash password
    // 2. Create User for db
    // 3. Save User in DB
    // 4. Generate tokens for User
    // 5. Save refresh token in db for User
    this.usersService.createUser({ ...registerDto, token: '' });
    // 6. Send verification email (optional)
  }

  async loginUser(loginDto: LoginDto): Promise<TokenResponse> {
    const user = await this.usersService.getByEmail(loginDto.login);

    // 2. Compare hashed credentials and hashed already user password
    if (user.password === loginDto.password) {
      // 3. Generate tokens for user
      // 4. Update refresh token in db for user
      // 5. Return refresh and access tokens
      return {
        accessToken: '',
        refreshToken: '',
      };
    }

    return null;
  }

  async logoutUser(userId: number) {
    this.usersService.updateToken(userId, null);
  }

  async refreshToken(userId: number, refreshToken: string) {
    this.usersService.updateToken(userId, refreshToken);
  }
}
