import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { TokenService } from './token.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({}), UsersModule],
  providers: [TokenService, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
