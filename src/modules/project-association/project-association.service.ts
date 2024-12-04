import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  ProjectAssociation,
  ProjectAssociationDocument,
} from './project-association.schema';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Events } from '@/src/lib/events';

@Injectable()
export class ProjectAssociationService {
  constructor(
    @InjectModel(ProjectAssociation.name)
    private projectAssociationModel: Model<ProjectAssociationDocument>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(
    projectAssociation: Partial<ProjectAssociation>,
  ): Promise<ProjectAssociation> {
    const createdProjectAssociation = new this.projectAssociationModel(
      projectAssociation,
    );
    const savedProjectAssociation = await createdProjectAssociation.save();

    this.eventEmitter.emit(Events.ProjectAssociation.CREATED, {
      association: savedProjectAssociation,
      type: 'CREATED',
    });

    return savedProjectAssociation;
  }

  async findAll(projectId?: string, userId?: string) {
    const query = {};
    if (projectId) {
      query['projectId'] = new Types.ObjectId(projectId);
    }
    if (userId) {
      query['userId'] = new Types.ObjectId(userId);
    }
    return this.projectAssociationModel.find(query).exec();
  }

  async findOne(id: string): Promise<ProjectAssociation | null> {
    return this.projectAssociationModel.findById(id).exec();
  }

  async update(
    id: string,
    projectAssociation: Partial<ProjectAssociation>,
  ): Promise<ProjectAssociation | null> {
    return this.projectAssociationModel
      .findByIdAndUpdate(id, projectAssociation, {
        new: true,
      })
      .exec();
  }

  async remove(id: string): Promise<ProjectAssociation | null> {
    return this.projectAssociationModel.findByIdAndDelete(id).exec();
  }
}
