import { Controller, Delete, Get, Param, Req, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { SwaggerTag } from './notifications.swagger';
import { RequestWithUser } from '@/src/common/types';
import { AuthGuard } from '@/src/common/guards';
import { validateObjectId } from '@/src/lib/utils/controller.utils';

@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('/me')
  @SwaggerTag.findMe()
  findMe(@Req() req: RequestWithUser) {
    const userId = req.user.sub;
    return this.notificationsService.findMany(userId);
  }

  @Delete('/:id')
  @SwaggerTag.delete()
  delete(@Param() id: string) {
    validateObjectId(id);
    return this.notificationsService.remove(id);
  }
}
