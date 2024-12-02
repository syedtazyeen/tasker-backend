import { AuthGuard } from '@/src/common/guards';
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { SwaggerTag } from './users.swagger';
import { RequestWithUser } from '@/src/common/types';
import { validateObjectId } from '@/src/lib/utils/controller.utils';
import { UpdateUserReqDto, UpdateUserStatusReqDto } from './users.dto';

/**
 * UsersController
 *
 * Manages user-related operations such as retrieving, updating, verifying,
 * and deleting users. All routes are protected by authentication via `AuthGuard`.
 */
@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @SwaggerTag.findAll()
  findAll(
    @Query('projectId') projectId?: string,
    @Query('searchQuery') searchQuery?: string,
  ) {
    return this.usersService.findMany(projectId, searchQuery);
  }

  @Get('/me')
  @SwaggerTag.findme()
  async findMe(@Req() req: RequestWithUser) {
    const userId = req.user.sub;
    return this.usersService.findOne(userId);
  }

  @Patch('verify/:id')
  @SwaggerTag.verifyUser()
  verify(@Param('id') id: string, @Query('isVerified') value: boolean) {
    validateObjectId(id);
    return this.usersService.verify(id, value);
  }

  @Patch('status/:id')
  @SwaggerTag.updateStatus()
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusUserDto: UpdateUserStatusReqDto,
  ) {
    validateObjectId(id);
    return this.usersService.updateStatus(id, updateStatusUserDto.status);
  }

  @Get(':id')
  @SwaggerTag.findone()
  async findOne(@Param('id') id: string) {
    validateObjectId(id);
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Patch(':id')
  @SwaggerTag.update()
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserReqDto) {
    validateObjectId(id);
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @SwaggerTag.delete()
  remove(@Param('id') id: string) {
    validateObjectId(id);
    return this.usersService.remove(id);
  }
}
