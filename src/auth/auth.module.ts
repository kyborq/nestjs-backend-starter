import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { TokenService } from './token.service';
import { JwtModule } from '@nestjs/jwt';
import { AccessStrategy } from './strategies/access.strategy';
import { RefreshStrategy } from './strategies/refresh.strategy';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [JwtModule.register({}), UsersModule, MailModule],
  providers: [TokenService, AuthService, AccessStrategy, RefreshStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
