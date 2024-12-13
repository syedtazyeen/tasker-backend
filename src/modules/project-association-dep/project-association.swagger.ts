import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { ProjectAssociationResponse } from './project-association.dto';

export const SwaggerTag = {
  findAll: () =>
    applyDecorators(
      ApiBearerAuth(),
      ApiQuery({ name: 'projectId', required: false }),
      ApiQuery({ name: 'userId', required: false }),
      ApiOperation({
        summary: 'Get all related project associations',
      }),
      ApiResponse({
        status: 200,
        description: 'Successfully retrieved list of project associations',
        type: [ProjectAssociationResponse],
      }),
    ),
  findone: () =>
    applyDecorators(
      ApiBearerAuth(),
      ApiOperation({
        summary: 'Get a project association',
      }),
      ApiResponse({
        status: 200,
        description: 'Successfully retrieved list of project association',
        type: ProjectAssociationResponse,
      }),
    ),
  delete: () =>
    applyDecorators(
      ApiBearerAuth(),
      ApiOperation({
        summary: 'Delete project association',
      }),
      ApiResponse({
        status: 200,
        description: 'Successfully deleted a project association',
      }),
    ),
};
