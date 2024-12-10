import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SwaggerTag } from './auth.swagger';
import {
  CheckEmailAuthReqDto,
  LoginAuthReqDto,
  RegisterAuthReqDto,
} from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('validate')
  @HttpCode(200)
  @SwaggerTag.validateEmail()
  async validate(@Body() checkEmailDto: CheckEmailAuthReqDto) {
    return this.authService.validateEmail(checkEmailDto.email);
  }

  @Post('login')
  @HttpCode(200)
  @SwaggerTag.login()
  async login(@Body() loginDto: LoginAuthReqDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @HttpCode(201)
  @SwaggerTag.register()
  async register(@Body() registerDto: RegisterAuthReqDto) {
    await this.authService.register(registerDto);
    return;
  }
}
