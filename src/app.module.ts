import { Module } from '@nestjs/common';
import {
  AuthModule,
  ConfigModule,
  UsersModule,
  ProjectAssociationModule,
  NotificationsModule,
  ProjectsModule,
  TicketsModule,
  EventsModule,
} from './modules';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    AuthModule,
    ProjectsModule,
    ProjectAssociationModule,
    NotificationsModule,
    TicketsModule,
    EventsModule,
  ],
})
export class AppModule {}
