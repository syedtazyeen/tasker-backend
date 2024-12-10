import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import {
  EventCreateRequest,
  EventResponse,
  EventUpdateAssociatedRequest,
  EventUpdateRequest,
} from './events.dto';

export const SwaggerTag = {
  getAll: () =>
    applyDecorators(
      ApiBearerAuth(),
      ApiOperation({
        summary: 'Get list of events',
      }),
      ApiQuery({
        name: 'startTime',
        type: String,
        required: false,
        default: new Date().toISOString(),
      }),
      ApiQuery({
        name: 'endTime',
        type: String,
        required: false,
      }),
      ApiQuery({
        name: 'limit',
        type: Number,
        required: false,
        default: 30,
      }),
      ApiResponse({
        status: 200,
        description: 'Successfully retrieved list of events',
        type: [EventResponse],
      }),
    ),
  getOne: () =>
    applyDecorators(
      ApiBearerAuth(),
      ApiOperation({
        summary: 'Get an events',
      }),
      ApiParam({ name: 'id' }),
      ApiResponse({
        status: 200,
        description: 'Successfully retrieved an event',
        type: EventResponse,
      }),
    ),
  create: () =>
    applyDecorators(
      ApiBearerAuth(),
      ApiOperation({
        summary: 'Create an event',
      }),
      ApiParam({ name: 'id' }),
      ApiBody({
        type: EventCreateRequest,
      }),
      ApiResponse({
        status: 201,
        description: 'Successfully created an event',
        type: EventResponse,
      }),
    ),
  update: () =>
    applyDecorators(
      ApiBearerAuth(),
      ApiOperation({
        summary: 'Update an event',
      }),
      ApiParam({ name: 'id' }),
      ApiBody({
        type: EventUpdateRequest,
      }),
      ApiResponse({
        status: 200,
        description: 'Successfully updated an event',
        type: EventResponse,
      }),
    ),
  updateAssociated: () =>
    applyDecorators(
      ApiBearerAuth(),
      ApiOperation({
        summary: 'Update an event associated users',
      }),
      ApiParam({ name: 'id' }),
      ApiBody({
        type: EventUpdateAssociatedRequest,
      }),
      ApiResponse({
        status: 200,
        description: 'Successfully updated an event',
        type: EventResponse,
      }),
    ),

  delete: () =>
    applyDecorators(
      ApiBearerAuth(),
      ApiOperation({
        summary: 'Delete an event',
      }),
      ApiParam({ name: 'id' }),
      ApiResponse({
        status: 200,
        description: 'Successfully deleted an event',
      }),
    ),
};
