import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { GetCurrentUser } from 'src/common/decorators/current-user.decorator';
import { RefreshGuard } from 'src/common/guards/refresh.guard';
import { AccessGuard } from 'src/common/guards/access.guard';
import { JwtPayloadWithRefresh } from './strategies/refresh.strategy';

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
  @UseGuards(AccessGuard)
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUser() currentUser: JwtPayloadWithRefresh) {
    console.log(currentUser);
    return this.authService.logoutUser('0');
  }

  @Post('refresh')
  @UseGuards(RefreshGuard)
  @HttpCode(HttpStatus.OK)
  refresh() {
    return this.authService.refreshToken('0', '');
  }
}
