import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ForbiddenException,
  Req,
  HttpCode,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { AuthGuard } from '@/src/common/guards';
import { SwaggerTag } from './projects.swagger';
import { CreateProjectReqDto, UpdateProjectReqDto } from './projects.dto';
import { RequestWithUser } from '@/src/common/types';
import { validateObjectId } from '@/src/lib/utils/controller.utils';

@Controller('projects')
@UseGuards(AuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @HttpCode(201)
  @SwaggerTag.create()
  create(
    @Req() req: RequestWithUser,
    @Body() createProjectDto: CreateProjectReqDto,
  ) {
    const userId = req.user.sub;
    return this.projectsService.create(userId, createProjectDto);
  }

  @Get('/is-slug-available')
  @SwaggerTag.isSlugAvailable()
  async isSlugAvailable(@Query('slug') slug: string) {
    if (!slug) throw new ForbiddenException('slug is required');
    const project = await this.projectsService.findOneBySlug(slug);
    return { value: project ? false : true };
  }

  @Get(':id')
  @SwaggerTag.findone()
  findOne(@Param('id') id: string) {
    validateObjectId(id);
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @SwaggerTag.update()
  update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectReqDto,
  ) {
    validateObjectId(id);
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @SwaggerTag.delete()
  remove(@Param('id') id: string) {
    validateObjectId(id);
    return this.projectsService.remove(id);
  }
}
