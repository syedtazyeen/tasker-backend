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
  EventAssociationResponse,
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
        name: 'userId',
        type: String,
        required: false,
      }),
      ApiQuery({
        name: 'projectId',
        type: String,
        required: false,
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
  findByCriteria: () =>
    applyDecorators(
      ApiBearerAuth(),
      ApiOperation({
        summary: 'Get events by query',
      }),
      ApiParam({ name: 'userId', required: false }),
      ApiParam({ name: 'projectId', required: false }),
      ApiResponse({
        status: 200,
        description: 'Successfully retrieved a list of events',
        type: [EventResponse],
      }),
    ),
  getEventAssociation: () =>
    applyDecorators(
      ApiBearerAuth(),
      ApiOperation({
        summary: 'Get association for an event',
      }),
      ApiParam({ name: 'id' }),
      ApiResponse({
        status: 200,
        description: 'Successfully retrieved an event associations',
        type: EventAssociationResponse,
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
  updateAssociaion: () =>
    applyDecorators(
      ApiBearerAuth(),
      ApiOperation({
        summary: 'Update an event association',
      }),
      ApiParam({ name: 'id' }),
      ApiBody({
        type: EventUpdateAssociatedRequest,
      }),
      ApiResponse({
        status: 200,
        description: 'Successfully updated an event association',
        type: EventAssociationResponse,
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
