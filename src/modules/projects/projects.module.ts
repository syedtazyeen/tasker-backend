import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './projects.schema';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { ProjectsController } from './projects.controller';
import { ProjectAssociationService } from './project-association.service';
import {
  ProjectAssociation,
  ProjectAssociationSchema,
} from './project-association.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    MongooseModule.forFeature([
      { name: ProjectAssociation.name, schema: ProjectAssociationSchema },
    ]),
    UsersModule,
  ],
  controllers: [ProjectsController],
  providers: [
    ProjectsService,
    ProjectAssociationService,
    AuthService,
    JwtService,
  ],
  exports: [ProjectsService, ProjectAssociationService],
})
export class ProjectsModule {}
