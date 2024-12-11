import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GoogleCalendarService } from './google-calendar.service';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Event, EventDocument } from './events.schema';
import {
  EventCreateRequest,
  EventUpdateAssociatedRequest,
  EventUpdateRequest,
} from './events.dto';
import { isValidDate, validateObjectId } from '@/src/lib/utils';
import {
  EventAssociation,
  EventAssociationDocument,
} from './events-association.schema';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @InjectModel(EventAssociation.name)
    private eventAssociationModel: Model<EventAssociationDocument>,
    private readonly googleCalendarService: GoogleCalendarService,
  ) {}

  async getAllEvents(
    startTime: string = new Date().toISOString(),
    endTime?: string,
    limit: string = '30',
  ) {
    if (!isValidDate(startTime) || (endTime && !isValidDate(endTime)))
      throw new BadRequestException('Invalid date string');

    const holidays = await this.googleCalendarService.getHolidayEvents(
      startTime,
      endTime,
      parseInt(limit),
    );

    const storedEvents = await this.eventModel
      .find({
        startDate: { $gte: new Date(startTime) },
        ...(endTime && { endDate: { $lte: new Date(endTime) } }),
      })
      .limit(parseInt(limit))
      .exec();

    return [...holidays, ...storedEvents];
  }

  async findOne(id: string): Promise<Event | null> {
    validateObjectId(id);
    return this.eventModel.findById(id).exec();
  }

  async create(body: EventCreateRequest): Promise<Event> {
    const { recepients, organisers, ...restBody } = body;
    const created = new this.eventModel(restBody);
    const saved = await created.save();
    const association: EventAssociation = {
      eventId: saved.id,
      createdBy: saved.createdBy,
      organisers: [
        saved.createdBy,
        ...organisers.map((id) => new Types.ObjectId(id)),
      ],
      recepients: recepients.map((id) => new Types.ObjectId(id)),
      projects: [],
    };
    const createdAssociation = new this.eventAssociationModel(association);
    await createdAssociation.save();
    return saved;
  }

  async update(id: string, body: EventUpdateRequest): Promise<Event> {
    validateObjectId(id);

    return await this.eventModel
      .findByIdAndUpdate(id, body, {
        new: true,
      })
      .exec();
  }

  async updateAssociated(
    id: string,
    eventUpdateAssociatedRequest: EventUpdateAssociatedRequest,
  ): Promise<EventAssociation | void> {
    validateObjectId(id);
    const event = await this.eventAssociationModel.findById(id);

    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }

    if (eventUpdateAssociatedRequest.addOrganisers) {
      eventUpdateAssociatedRequest.addOrganisers.forEach((userId) => {
        if (!event.organisers.includes(new Types.ObjectId(userId))) {
          event.organisers.push(new Types.ObjectId(userId));
        }
      });
    }

    if (eventUpdateAssociatedRequest.removeOrganisers) {
      eventUpdateAssociatedRequest.removeOrganisers.forEach((userId) => {
        const index = event.organisers.indexOf(new Types.ObjectId(userId));
        if (index !== -1) {
          event.organisers.splice(index, 1);
        }
      });
    }

    if (eventUpdateAssociatedRequest.addRecipients) {
      eventUpdateAssociatedRequest.addRecipients.forEach((userId) => {
        if (!event.recepients.includes(new Types.ObjectId(userId))) {
          event.recepients.push(new Types.ObjectId(userId));
        }
      });
    }

    if (eventUpdateAssociatedRequest.removeRecipients) {
      eventUpdateAssociatedRequest.removeRecipients.forEach((userId) => {
        const index = event.recepients.indexOf(new Types.ObjectId(userId));
        if (index !== -1) {
          event.recepients.splice(index, 1);
        }
      });
    }

    return await event.save();
  }

  async remove(id: string): Promise<void> {
    validateObjectId(id);
    await this.eventModel.findByIdAndDelete(id).exec();
  }
}
