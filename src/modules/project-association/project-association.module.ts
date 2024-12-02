import { Module } from '@nestjs/common';
import { ProjectAssociationController } from './project-association.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProjectAssociation,
  ProjectAssociationSchema,
} from './project-association.entity';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { ProjectAssociationService } from './project-association.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProjectAssociation.name, schema: ProjectAssociationSchema },
    ]),
    UsersModule,
  ],
  controllers: [ProjectAssociationController],
  providers: [ProjectAssociationService, AuthService, JwtService],
  exports: [ProjectAssociationService],
})
export class ProjectAssociationModule {}
