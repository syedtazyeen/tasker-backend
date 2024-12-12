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
  Req,
  UseGuards,
} from '@nestjs/common';
import { SwaggerTag } from './events.swagger';
import {
  EventAssociationResponse,
  EventAssociationUpdateRequest,
  EventCreateRequest,
  EventResponse,
  EventUpdateRequest,
} from './events.dto';
import { AuthGuard } from '@/src/common/guards';
import { EventsService } from './events.service';
import { RequestWithUser } from '@/src/common/types';
import { EventsAssociationService } from './event-association.service';

@Controller('events')
@UseGuards(AuthGuard)
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly eventAssociationService: EventsAssociationService,
  ) {}

  @Get('')
  @SwaggerTag.getAll()
  getAllEvents(
    @Query('startTime') startTime?: string,
    @Query('userId') userId?: string,
    @Query('projectId') projectId?: string,
    @Query('endTime') endTime?: string,
    @Query('limit') limit?: string,
  ): Promise<EventResponse[]> {
    return this.eventsService.getAllEvents(
      startTime,
      userId,
      projectId,
      endTime,
      limit,
    );
  }

  @Post('')
  @SwaggerTag.create()
  createEvent(
    @Req() req: RequestWithUser,
    @Body() body: EventCreateRequest,
  ): Promise<EventResponse> {
    return this.eventsService.createWithAssociation(req.user.sub, body);
  }

  @Get(':id')
  @SwaggerTag.getOne()
  getOneEvent(@Param('id') id: string): Promise<EventResponse> {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  @SwaggerTag.update()
  updateEvent(
    @Param('id') id: string,
    @Body() body: EventUpdateRequest,
  ): Promise<EventResponse> {
    return this.eventsService.update(id, body);
  }

  @Delete(':id')
  @SwaggerTag.delete()
  delete(@Param('id') id: string): Promise<void> {
    return this.eventsService.remove(id);
  }

  @Get(':id/association')
  @SwaggerTag.getEventAssociation()
  getEventAssociations(
    @Param('id') id: string,
  ): Promise<EventAssociationResponse> {
    return this.eventAssociationService.findByEventId(id);
  }

  @Put(':id/association')
  @SwaggerTag.updateAssociaion()
  updateAssociated(
    @Param('id') id: string,
    @Body() body: EventAssociationUpdateRequest,
  ): Promise<EventAssociationResponse> {
    return this.eventAssociationService.update(id, body);
  }
}
