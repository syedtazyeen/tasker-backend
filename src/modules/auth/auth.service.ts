import * as bcrypt from 'bcryptjs';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { logger } from '@/src/lib/logger';
import { JWT_SECRET } from '@/src/common/constants';
import { UserStatus } from '@/src/common/enums';
import { LoginAuthReqDto, RegisterAuthReqDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateEmail(email: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    return {
      value: true,
    };
  }

  async login(user: LoginAuthReqDto) {
    const validatedUser = await this.validateUser(user.email, user.password);
    return {
      accessToken: this.jwtService.sign({
        email: validatedUser.email,
        sub: validatedUser.id,
      }),
      user: validatedUser,
    };
  }

  async register(registerAuthReqDto: RegisterAuthReqDto): Promise<void> {
    const hashedPassword = await bcrypt.hash(registerAuthReqDto.password, 10);
    await this.usersService.create({
      ...registerAuthReqDto,
      password: hashedPassword,
    });
    return;
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email, true);
    if (!user) throw new NotFoundException('User not found');
    if (await this.validatePassword(password, user.password)) {
      return user; // Return user without password
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  /*
  validateRequest(request: any): boolean {
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) return false;

    try {
      const payload = this.jwtService.verify(token, {
        secret: JWT_SECRET,
      });
      request.user = payload;
      return true;
    } catch (e) {
      logger.error((e as any)?.message);
      return false;
    }
  }
    */

  async validateRequest(request: any): Promise<boolean> {
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) return false;

    try {
      const payload = this.jwtService.verify(token, {
        secret: JWT_SECRET,
      });

      const user = await this.usersService.findOne(payload.sub);
      if (!user) {
        return false;
      }

      if (user.status === UserStatus.BANNED) {
        return false;
      }

      request.user = payload;
      return true;
    } catch (e) {
      logger.error((e as any)?.message);
      return false;
    }
  }

  private async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
