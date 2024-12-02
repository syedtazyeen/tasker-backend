import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import {
  CreateTicketReqDto,
  GetTicketResDto,
  UpdateTicketReqDto,
} from './tickets.dto';

export const SwaggerTag = {
  findone: () =>
    applyDecorators(
      ApiBearerAuth(),
      ApiOperation({
        summary: 'Get a ticket',
      }),
      ApiResponse({
        status: 200,
        description: 'Successfully retrieved list of tickets',
        type: GetTicketResDto,
      }),
    ),
  findAll: () =>
    applyDecorators(
      ApiBearerAuth(),
      ApiOperation({
        summary: 'Get all tickets',
      }),
      ApiQuery({ name: 'projectId', required: false }),
      ApiQuery({ name: 'userId', required: false }),
      ApiResponse({
        status: 200,
        description: 'Successfully retrieved list of tickets',
        type: [GetTicketResDto],
      }),
    ),
  create: () =>
    applyDecorators(
      ApiBearerAuth(),
      ApiOperation({
        summary: 'Create a ticket',
      }),
      ApiBody({ type: CreateTicketReqDto }),
      ApiResponse({
        status: 200,
        description: 'Successfully created a ticket',
      }),
    ),
  update: () =>
    applyDecorators(
      ApiBearerAuth(),
      ApiOperation({
        summary: 'Update a ticket',
      }),
      ApiBody({ type: UpdateTicketReqDto }),
      ApiResponse({
        status: 200,
        description: 'Successfully Updated a ticket',
      }),
    ),

  delete: () =>
    applyDecorators(
      ApiBearerAuth(),
      ApiOperation({
        summary: 'Delete ticket',
      }),
      ApiResponse({
        status: 200,
        description: 'Successfully deleted a ticket',
      }),
    ),
};
