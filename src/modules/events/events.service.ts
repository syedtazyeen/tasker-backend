import { Model, Types } from 'mongoose';
import { isValidDate, validateObjectId } from '@/src/lib/utils';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EventsAssociationService } from './event-association.service';
import {
  EventCreateRequest,
  EventCreateResponse,
  EventResponse,
} from './events.dto';
import { Event } from './events.schema';
import { GoogleCalendarService } from './google-calendar.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventResponse>,
    private readonly eventAssociationService: EventsAssociationService,
    private readonly googleCalendarService: GoogleCalendarService,
  ) {}

  /**
   * Get all events based on optional filters like id, projectId, and date range.
   *
   * @param {string} userId - Optional user ID to filter events based on their associations.
   * @param {string} projectId - Optional project ID to filter events associated with a project.
   * @param {string} startTime - Start date for the event filter, defaults to the current date.
   * @param {string} endTime - End date for the event filter (optional).
   * @param {string} limit - Limit the number of events returned, defaults to 30.
   * @returns A list of events including stored and holiday events.
   * @throws BadRequestException - If the date format or limit is invalid.
   */
  async getAllEvents(
    startTime: string,
    userId?: string,
    organizerId?: string,
    recipientId?: string,
    projectId?: string,
    endTime?: string,
    limit: string = '30',
  ): Promise<EventResponse[]> {
    if (!isValidDate(startTime) || (endTime && !isValidDate(endTime))) {
      throw new BadRequestException('Invalid date string');
    }

    const parsedLimit = parseInt(limit, 10);
    if (isNaN(parsedLimit) || parsedLimit <= 0) {
      throw new BadRequestException('Invalid limit value');
    }

    const holidays = await this.googleCalendarService.getHolidayEvents(
      startTime || new Date().toISOString(),
      endTime,
      parsedLimit,
    );

    const associationFilter: any = {};
    if (userId) {
      associationFilter.$or = [{ createdBy: userId }];
    }

    if (organizerId) {
      associationFilter.$or = [{ organizers: organizerId }];
    }

    if (recipientId) {
      associationFilter.$or = [{ recipients: recipientId }];
    }

    if (projectId) {
      associationFilter.projects = projectId;
    }

    const associations =
      await this.eventAssociationService.findByQuery(associationFilter);

    let associatedEventIds: string[] = [];
    if (Object.keys(associationFilter).length > 0) {
      associatedEventIds = associations.map((assoc) => assoc.eventId);
    }

    const eventQuery: any = {
      ...(startTime && { startDate: { $gte: new Date(startTime) } }),
      ...(endTime && { endDate: { $lte: new Date(endTime) } }),
      ...(associatedEventIds.length > 0 && {
        id: { $in: associatedEventIds },
      }),
    };

    const storedEvents = await this.eventModel
      .find(eventQuery)
      .limit(parsedLimit)
      .exec();

    return [...holidays, ...storedEvents];
  }

  /**
   * Get a single event by its ID.
   *
   * @param {string} id - The ID of the event to retrieve.
   * @returns The event details along with associated organizers and recipients.
   * @throws BadRequestException - If the ID is invalid.
   * @throws NotFoundException - If event not found.
   */
  async findOne(id: string): Promise<EventResponse | null> {
    validateObjectId(id);
    let event: any = await this.eventModel.findById(id).exec();

    if (!event) throw new NotFoundException(`Event not found for id ${id}`);

    const association = await this.eventAssociationService.findByEventId(id);

    event.organizers = Array.isArray(association.organizers)
      ? association.organizers.map((id) => new Types.ObjectId(id))
      : [];

    event.recipients = Array.isArray(association.recipients)
      ? association.recipients.map((id) => new Types.ObjectId(id))
      : [];
    event.projects = Array.isArray(association.projects)
      ? association.projects.map((id) => new Types.ObjectId(id))
      : [];
    return event;
  }

  /**
   * Create a new event with its association details.
   *
   * @param {string} userId - The user's Id to create event.
   * @param {EventCreateRequest} payload - The data required to create an event.
   * @returns An object containing the created event ID and its associated ID.
   * @throws HttpException - If there is an error creating the event or association.
   */
  async createWithAssociation(
    userId: string,
    payload: EventCreateRequest,
  ): Promise<any> {
    const { recipients, organizers, projects, ...restBody } = payload;
    try {
      const createdEvent = await this.create({
        ...restBody,
        createdBy: userId,
      });

      organizers.push(userId);

      const association = {
        eventId: createdEvent.id,
        createdBy: createdEvent.createdBy,
        organizers,
        recipients,
        projects,
      };

      const createdAssociation =
        await this.eventAssociationService.create(association);

      const result: EventCreateResponse = {
        event: createdEvent,
        association: createdAssociation,
      };

      return result;
    } catch (error) {
      throw new HttpException(
        'Failed to create event',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
  }

  /**
   * Create an event.
   *
   * @param {Event} payload - The payload of event to create.
   * @returns The created event.
   */
  async create(payload: Partial<Event>): Promise<EventResponse> {
    const created = new this.eventModel(payload);
    const result = await created.save();
    return result;
  }

  /**
   * Update an event by its ID.
   *
   * @param {string} id - The ID of the event to update.
   * @param {EventUpdateRequest} payload - The data to update the event with.
   * @returns The updated event.
   * @throws BadRequestException - If the ID is invalid.
   * @throws NotFoundException - If the event is not found.
   */
  async update(id: string, payload: Partial<Event>): Promise<EventResponse> {
    validateObjectId(id);

    const response = await this.eventModel
      .findByIdAndUpdate(id, payload, {
        new: true,
      })
      .exec();

    if (!response) throw new NotFoundException(`Event not found for id ${id}`);

    return response;
  }

  /**
   * Remove an event by its ID.
   *
   * @param {string} id - The ID of the event to remove.
   * @returns void
   * @throws BadRequestException - If the ID is invalid.
   */
  async remove(id: string): Promise<void> {
    validateObjectId(id);
    const response = await this.eventModel.findByIdAndDelete(id).exec();
    if (!response) throw new NotFoundException(`Event not found for id ${id}`);
  }
}
