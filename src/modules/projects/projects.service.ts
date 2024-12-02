import { ConflictException, Injectable, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Project, ProjectDocument } from './projects.entity';
import { CreateProjectReqDto, UpdateProjectReqDto } from './projects.dto';
import { ProjectAssociationService } from '../project-association/project-association.service';
import { AuthGuard } from '@/src/common/guards';
import { ProjectAssociation } from '../project-association/project-association.entity';
import { UserRole } from '@/src/common/enums';
import { MongoError } from 'mongodb';

@Injectable()
@UseGuards(AuthGuard)
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    private readonly projectAssociationService: ProjectAssociationService,
  ) {}

  async create(
    userId: string,
    createProjectDto: CreateProjectReqDto,
  ): Promise<Project> {
    try {
      const newProject: Partial<Project> = {
        ...createProjectDto,
        creatorId: new Types.ObjectId(userId),
      };
      const createdProject = new this.projectModel(newProject);
      const projectAssociation: Partial<ProjectAssociation> = {
        userId: new Types.ObjectId(userId),
        projectId: new Types.ObjectId(createdProject.id as string),
        role: UserRole.ADMIN,
      };
      this.projectAssociationService.create(projectAssociation);
      return createdProject.save();
    } catch (error) {
      console.log(error)
      if (error instanceof MongoError && error.code === 11000) {
        const errorMessage = error.errmsg || '';

        // Regex with the global flag to match multiple occurrences of duplicate fields
        const duplicateFieldMatches = [
          ...errorMessage.matchAll(/index: (\w+)_1 dup key/g),
        ];

        const duplicateEmailField = duplicateFieldMatches.find(
          (match) => match[0] === 'slug' || match[1] === 'slug',
        );

        if (duplicateEmailField) {
          throw new ConflictException('Slug already exists');
        }

        throw new ConflictException('Duplicate value for a unique field.');
      }

      throw error;
    }
  }

  async findAll(): Promise<Project[]> {
    return this.projectModel.find().exec();
  }

  async findOne(id: string): Promise<Project | null> {
    return this.projectModel.findById(id).exec();
  }

  async findOneBySlug(
    slug: string,
    check: boolean = false,
  ): Promise<Project | null> {
    const query = this.projectModel.findOne({ slug });
    if (check) {
      query.select('+id');
    }
    return query.exec();
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectReqDto,
  ): Promise<Project | null> {
    return this.projectModel
      .findByIdAndUpdate(id, updateProjectDto, {
        new: true,
      })
      .exec();
  }

  async remove(id: string): Promise<Project | null> {
    return this.projectModel.findByIdAndDelete(id).exec();
  }
}
