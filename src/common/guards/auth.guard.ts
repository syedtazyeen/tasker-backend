import { AuthService } from '@/src/modules/auth/auth.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const isAuthenticated = await this.authService.validateRequest(request);

    if (!isAuthenticated) {
      throw new UnauthorizedException('User is not authorized');
    }

    return true;
  }
}
