import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './projects.entity';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { ProjectAssociationModule } from '../project-association/project-association.module';
import { ProjectsController } from './projects.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    UsersModule,
    ProjectAssociationModule,
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, AuthService, JwtService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
