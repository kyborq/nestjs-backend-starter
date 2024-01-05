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
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private tokenService: TokenService,
    private mailService: MailService,
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
      createdUser.emailVerified,
    );
    await this.usersService.updateToken(createdUser.id, tokens.refreshToken);

    this.sendVerificationMail(
      createdUser.id,
      createdUser.email,
      createdUser.emailVerified,
    );
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

    const tokens = await this.tokenService.generateTokens(
      user.id,
      user.email,
      user.emailVerified,
    );
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

    const tokens = await this.tokenService.generateTokens(
      userId,
      user.email,
      user.emailVerified,
    );
    const hashedToken = await argon.hash(tokens.refreshToken);

    return this.usersService.updateToken(userId, hashedToken);
  }

  async sendVerificationMail(userId: string, email: string, verified: boolean) {
    const token = await this.tokenService.generateVerifyToken(
      userId,
      email,
      verified,
    );
    const hashedToken = await argon.hash(token);

    await this.usersService.updateEmailToken(userId, hashedToken);

    const url = `http://localhost:3000/auth/verify?token=${token}`;
    const subject = 'Verify your email address';
    const text = `Please verify your email address by clicking on the link below:\n\n${url}`;

    await this.mailService.sendEmail({ to: email, subject, text });
  }

  async verifyEmail(userId: string, code: string) {
    const user = await this.usersService.getById(userId);

    if (!user || !user.emailToken) {
      throw new BadRequestException('Invalid token');
    }

    const tokenMatches = await argon.verify(user.emailToken, code);

    if (!tokenMatches) {
      throw new BadRequestException('Token is not valid');
    }

    await this.usersService.verifyEmail(userId);
  }
}
