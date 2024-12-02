import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import {
  CreateProjectReqDto,
  GetProjectDetailResDto,
  GetSlugAvailableResDto,
  UpdateProjectReqDto,
} from './projects.dto';

export const SwaggerTag = {
  findone: () =>
    applyDecorators(
      ApiBearerAuth(),
      ApiOperation({
        summary: 'Get a project',
      }),
      ApiResponse({
        status: 200,
        description: 'Successfully retrieved list of projects',
        type: GetProjectDetailResDto,
      }),
    ),
  isSlugAvailable: () =>
    applyDecorators(
      ApiBearerAuth(),
      ApiOperation({
        summary: 'Check if project slug available',
      }),
      ApiResponse({
        status: 200,
        description: 'Successfully retrieved slug availability',
        type: GetSlugAvailableResDto,
      }),
    ),
  create: () =>
    applyDecorators(
      ApiBearerAuth(),
      ApiOperation({
        summary: 'Create a project',
      }),
      ApiBody({ type: CreateProjectReqDto }),
      ApiResponse({
        status: 200,
        description: 'Successfully created a project',
      }),
    ),
  update: () =>
    applyDecorators(
      ApiBearerAuth(),
      ApiOperation({
        summary: 'Update a project',
      }),
      ApiBody({ type: UpdateProjectReqDto }),
      ApiResponse({
        status: 200,
        description: 'Successfully Updated a project',
      }),
    ),
  delete: () =>
    applyDecorators(
      ApiBearerAuth(),
      ApiOperation({
        summary: 'Delete project',
      }),
      ApiResponse({
        status: 200,
        description: 'Successfully deleted a project',
      }),
    ),
};
