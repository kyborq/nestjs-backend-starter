import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async registerUser(registerDto: RegisterDto) {
    // 1. Hash password
    // 2. Create User for db
    // 3. Save User in DB
    this.usersService.createUser();

    // 4. Generate tokens for User
    // 5. Save refresh token in db for User
    // 6. Send verification email (optional)
  }

  async loginUser(loginDto: LoginDto) {
    // 1. Find user by email
    this.usersService.getByEmail(loginDto.login);
    // 2. Compare hashed credentials and hashed already user password
    // 3. Generate tokens for user
    // 4. Update refresh token in db for user
  }

  async logoutUser(userId: number) {
    // 1. Delete refresh token from User in db
    this.usersService.updateToken(userId, null);
  }

  async refreshToken(userId: number, refreshToken: string) {
    this.usersService.updateToken(userId, refreshToken);
  }
}
