import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { GetNotificationResDto } from './notifications.dto';

export const SwaggerTag = {
  findMe: () =>
    applyDecorators(
      ApiBearerAuth(),
      ApiOperation({
        summary: 'Get a notification',
      }),
      ApiResponse({
        status: 200,
        description: 'Successfully retrieved list of notifications',
        type: [GetNotificationResDto],
      }),
    ),
  delete: () =>
    applyDecorators(
      ApiBearerAuth(),
      ApiOperation({
        summary: 'Delete a notification',
      }),
      ApiResponse({
        status: 200,
        description: 'Successfully deleted a notification',
      }),
    ),
};
