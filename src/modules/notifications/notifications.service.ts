import { Events } from '@/src/lib/events';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument } from './notifications.enitity';
import { InjectModel } from '@nestjs/mongoose';
import { ProjectAssociation } from '../project-association/project-association.entity';
import { Priority, Resource } from '@/src/common/enums';
import { NotificationPrompts } from '@/src/common/constants/prompts.contants';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    private readonly projectsService: ProjectsService,
  ) {}

  @OnEvent(Events.ProjectAssociation.CREATED)
  async handleProjectAssociationCreatedEvent(payload: {
    association: ProjectAssociation;
    type: 'ADDED' | 'CREATED';
  }): Promise<void> {
    const newNotification: Notification = {
      userId: payload.association.userId,
      title: `${NotificationPrompts.PROJECT_CREATED.title}`,
      description: `${NotificationPrompts.PROJECT_CREATED.description}`,
      isRead: false,
      priority: Priority.HIGH,
      resource: Resource.PROJECTS,
      resourceId: payload.association.projectId,
    };
    const createdNotification = new this.notificationModel(newNotification);
    await createdNotification.save();
  }

  async findMany(userId?: string): Promise<Notification[]> {
    const query = {};
    if (userId) {
      query['userId'] = new Types.ObjectId(userId);
    }
    return this.notificationModel.find(query).exec();
  }

  async remove(id: string): Promise<Notification | null> {
    return this.notificationModel.findByIdAndDelete(id).exec();
  }
}
