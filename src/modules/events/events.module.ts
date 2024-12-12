import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { GoogleCalendarService } from './google-calendar.service';
import { EventsService } from './events.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from './events.schema';
import { AuthModule } from '../auth/auth.module';
import {
  EventAssociation,
  EventAssociationSchema,
} from './events-association.schema';
import { EventsAssociationService } from './event-association.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: EventAssociation.name, schema: EventAssociationSchema },
    ]),
    AuthModule,
  ],
  controllers: [EventsController],
  providers: [EventsService, EventsAssociationService, GoogleCalendarService],
})
export class EventsModule {}
