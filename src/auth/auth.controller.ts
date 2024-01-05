import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() registerDto: RegisterDto) {
    return this.authService.registerUser(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authService.loginUser(loginDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout() {
    return this.authService.logoutUser('0');
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh() {
    return this.authService.refreshToken('0', '');
  }
}
