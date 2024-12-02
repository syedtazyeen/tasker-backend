import { Module } from '@nestjs/common';
import {
  AuthModule,
  ConfigModule,
  UsersModule,
  ProjectAssociationModule,
  NotificationsModule,
  ProjectsModule,
  TicketsModule,
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
  ],
})
export class AppModule {}
