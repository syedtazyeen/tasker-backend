import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GoogleCalendarService } from './google-calendar.service';
import { Event as EventType } from '@/src/common/types';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Event, EventDocument } from './events.schema';
import {
  EventCreateRequest,
  EventUpdateAssociatedRequest,
  EventUpdateRequest,
} from './events.dto';
import { isValidDate, validateObjectId } from '@/src/lib/utils';
import { validate } from 'class-validator';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
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
    const created = new this.eventModel(body);
    return await created.save();
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
  ): Promise<Event | void> {
    validateObjectId(id);
    const event = await this.eventModel.findById(id);

    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }

    if (eventUpdateAssociatedRequest.addUserIds) {
      eventUpdateAssociatedRequest.addUserIds.forEach((userId) => {
        if (!event.associatedTo.includes(new Types.ObjectId(userId))) {
          event.associatedTo.push(new Types.ObjectId(userId));
        }
      });
    }
    if (eventUpdateAssociatedRequest.removeUserIds) {
      eventUpdateAssociatedRequest.removeUserIds.forEach((userId) => {
        const index = event.associatedTo.indexOf(new Types.ObjectId(userId));
        if (index !== -1) {
          event.associatedTo.splice(index, 1);
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
