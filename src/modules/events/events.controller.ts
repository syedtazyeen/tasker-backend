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
import { EventsService } from './events.service';
import { SwaggerTag } from './events.swagger';
import {
  EventCreateRequest,
  EventUpdateAssociatedRequest,
  EventUpdateRequest,
} from './events.dto';
import { AuthGuard } from '@/src/common/guards';

@Controller('events')
@UseGuards(AuthGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('')
  @SwaggerTag.getAll()
  getAllEvents(
    @Query('startTime') startTime?: string,
    @Query('endTime') endTime?: string,
    @Query('limit') limit?: string,
  ) {
    return this.eventsService.getAllEvents(startTime, endTime, limit);
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

  @Put(':id/associatedTo')
  @SwaggerTag.updateAssociated()
  updateAssociated(
    @Param('id') id: string,
    @Body() body: EventUpdateAssociatedRequest,
  ) {
    return this.eventsService.updateAssociated(id, body);
  }

  @Delete(':id')
  @SwaggerTag.delete()
  delete(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}
