import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@/src/common/guards';
import { ProjectAssociationService } from './project-association.service';
import { SwaggerTag } from './project-association.swagger';
import { ApiTags } from '@nestjs/swagger';
import { validateObjectId } from '@/src/lib/utils/controller.utils';

@ApiTags('Project Association')
@Controller('project-association')
@UseGuards(AuthGuard)
export class ProjectAssociationController {
  constructor(
    private readonly projectAssociationService: ProjectAssociationService,
  ) {}

  @Get()
  @SwaggerTag.findAll()
  findAll(
    @Query('projectId') projectId?: string,
    @Query('userId') userId?: string,
  ) {
    if (!projectId && !userId)
      throw new ForbiddenException('projectId or userId is required');
    return this.projectAssociationService.findAll(projectId, userId);
  }

  @Get(':id')
  @SwaggerTag.findone()
  findOne(@Param('id') id: string) {
    validateObjectId(id);
    return this.projectAssociationService.findOne(id);
  }

  @Delete(':id')
  @SwaggerTag.delete()
  remove(@Param('id') id: string) {
    validateObjectId(id);
    return this.projectAssociationService.remove(id);
  }
}
