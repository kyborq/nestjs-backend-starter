import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { GetCurrentUser } from 'src/common/decorators/current-user.decorator';
import { RefreshGuard } from 'src/common/guards/refresh.guard';
import { AccessGuard } from 'src/common/guards/access.guard';
import { JwtPayloadWithRefresh } from './strategies/refresh.strategy';
import { Response } from 'express';
import { JwtPayload } from './strategies/access.strategy';
import { TokenResponse } from './token.service';

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
  async login(
    @Res({ passthrough: true }) response: Response,
    @Body() loginDto: LoginDto,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.loginUser(loginDto);

    response.cookie('jwt', accessToken, {
      httpOnly: true,
      secure: true,
      path: '/',
      maxAge: 1000 * 60 * 15,
    });

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
  }

  @Post('logout')
  @UseGuards(AccessGuard)
  @HttpCode(HttpStatus.OK)
  logout(
    @Res({ passthrough: true }) response: Response,
    @GetCurrentUser() currentUser: JwtPayload,
  ) {
    response.clearCookie('jwt', { path: '/' });
    response.clearCookie('refreshToken', { path: '/' });

    this.authService.logoutUser(currentUser.sub);
  }

  @Post('refresh')
  @UseGuards(RefreshGuard)
  @HttpCode(HttpStatus.OK)
  refresh(@GetCurrentUser() currentUser: JwtPayloadWithRefresh) {
    return this.authService.refreshToken(
      currentUser.sub,
      currentUser.refreshToken,
    );
  }

  @Get('verify')
  // @UseGuards(AccessGuard)
  @HttpCode(HttpStatus.OK)
  async verify(
    @GetCurrentUser() currentUser: JwtPayload,
    @Query('token') token: string,
  ) {
    if (!token) {
      throw new BadRequestException('Token is invalid');
    }

    // if (currentUser.verified) {
    //   throw new BadRequestException('ErrorMessage.EmailAlreadyVerified');
    // }

    await this.authService.verifyEmail(currentUser.sub, token);
  }
}
