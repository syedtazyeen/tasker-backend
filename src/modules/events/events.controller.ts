import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SwaggerTag } from './events.swagger';
import {
  EventCreateRequest,
  EventUpdateAssociatedRequest,
  EventUpdateRequest,
} from './events.dto';
import { AuthGuard } from '@/src/common/guards';
import { EventsService } from './events.service';

@Controller('events')
@UseGuards(AuthGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('')
  @SwaggerTag.getAll()
  getAllEvents(
    @Query('userId') userId?: string,
    @Query('projectId') projectId?: string,
    @Query('startTime') startTime?: string,
    @Query('endTime') endTime?: string,
    @Query('limit') limit?: string,
  ) {
    return this.eventsService.getAllEvents(
      userId,
      projectId,
      startTime,
      endTime,
      limit,
    );
  }

  @Post('')
  @SwaggerTag.create()
  createEvent(@Body() body: EventCreateRequest) {
    return this.eventsService.create(body);
  }

  @Get(':id')
  @SwaggerTag.getOne()
  getOneEvent(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  @SwaggerTag.update()
  updateEvent(@Param('id') id: string, @Body() body: EventUpdateRequest) {
    return this.eventsService.update(id, body);
  }

  @Delete(':id')
  @SwaggerTag.delete()
  delete(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }

  @Get(':id/association')
  @SwaggerTag.getEventAssociation()
  getEventAssociations(@Param('id') id: string) {
    return this.eventsService.findAssociationByEventId(id);
  }

  @Put(':id/association')
  @SwaggerTag.updateAssociaion()
  updateAssociated(
    @Param('id') id: string,
    @Body() body: EventUpdateAssociatedRequest,
  ) {
    return this.eventsService.updateAssociated(id, body);
  }
}
