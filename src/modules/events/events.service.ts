import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GoogleCalendarService } from './google-calendar.service';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Event, EventDocument } from './events.schema';
import {
  EventCreateRequest,
  EventCreateResponse,
  EventListResponse,
  EventResponse,
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

  /**
   * Get all events based on optional filters like id, projectId, and date range.
   *
   * @param id - Optional user ID to filter events based on their associations.
   * @param projectId - Optional project ID to filter events associated with a project.
   * @param startTime - Start date for the event filter, defaults to the current date.
   * @param endTime - End date for the event filter (optional).
   * @param limit - Limit the number of events returned, defaults to 30.
   * @returns A list of events including stored and holiday events.
   * @throws BadRequestException - If the date format or limit is invalid.
   */
  async getAllEvents(
    id?: string,
    projectId?: string,
    startTime: string = new Date().toISOString(),
    endTime?: string,
    limit: string = '30',
  ): Promise<EventListResponse[]> {
    if (!isValidDate(startTime) || (endTime && !isValidDate(endTime))) {
      throw new BadRequestException('Invalid date string');
    }

    const parsedLimit = parseInt(limit, 10);
    if (isNaN(parsedLimit) || parsedLimit <= 0) {
      throw new BadRequestException('Invalid limit value');
    }

    const holidays = await this.googleCalendarService.getHolidayEvents(
      startTime,
      endTime,
      parsedLimit,
    );

    const associationFilter: any = {};
    if (id) {
      associationFilter.$or = [
        { createdBy: id },
        { organisers: id },
        { recepients: id },
      ];
    }

    if (projectId) {
      associationFilter.projects = projectId;
    }

    let associatedEventIds: Types.ObjectId[] = [];
    if (Object.keys(associationFilter).length > 0) {
      const associations = await this.eventAssociationModel
        .find(associationFilter)
        .select('eventId')
        .exec();

      associatedEventIds = associations.map((assoc) => assoc.eventId);
    }

    const eventQuery: any = {
      startDate: { $gte: new Date(startTime) },
      ...(endTime && { endDate: { $lte: new Date(endTime) } }),
      ...(associatedEventIds.length > 0 && {
        _id: { $in: associatedEventIds },
      }),
    };

    const storedEvents = await this.eventModel
      .find(eventQuery)
      .limit(parsedLimit)
      .exec();

    return [...holidays, ...storedEvents] as EventListResponse[];
  }

  /**
   * Get a single event by its ID.
   *
   * @param id - The ID of the event to retrieve.
   * @returns The event details along with associated organisers and recipients.
   * @throws BadRequestException - If the ID is invalid.
   * @throws NotFoundException - If event not found.
   */
  async findOne(id: string): Promise<EventResponse | null> {
    validateObjectId(id);
    let event: any = await this.eventModel.findById(id).exec();

    if (!event) throw new NotFoundException(`Event not found for id ${id}`);

    const association = await this.eventAssociationModel
      .findOne({ eventId: event.id })
      .exec();

    event.organisers = Array.isArray(association.organisers)
      ? association.organisers.map((id) => new Types.ObjectId(id))
      : [];

    event.recepients = Array.isArray(association.recepients)
      ? association.recepients.map((id) => new Types.ObjectId(id))
      : [];
    event.projects = Array.isArray(association.projects)
      ? association.projects.map((id) => new Types.ObjectId(id))
      : [];
    return event;
  }

  /**
   * Find an event association by its ID.
   *
   * @param id - The ID of the event association.
   * @returns The event association if found, or null if not.
   * @throws BadRequestException - If the ID is invalid.
   */
  async findOneAssociation(id: string): Promise<EventAssociation | null> {
    validateObjectId(id);
    return this.eventAssociationModel.findById(id).exec();
  }

  /**
   * Find an event association by the event ID.
   *
   * @param id - The ID of the event to find the association for.
   * @returns The event association for the given event ID.
   * @throws BadRequestException - If the event ID is invalid.
   */
  async findAssociationByEventId(id: string): Promise<EventAssociation | null> {
    validateObjectId(id);
    return this.eventAssociationModel.findOne({ eventId: id }).exec();
  }

  /**
   * Create a new event with its association details.
   *
   * @param body - The data required to create an event.
   * @returns An object containing the created event ID and its associated ID.
   * @throws HttpException - If there is an error creating the event or association.
   */
  async create(body: EventCreateRequest): Promise<EventCreateResponse> {
    const { recepients, organisers, projects, ...restBody } = body;
    try {
      const created = new this.eventModel(restBody);
      const saved = await created.save();

      const association: EventAssociation = {
        eventId: saved.id,
        createdBy: saved.createdBy,
        organisers: [
          saved.createdBy,
          ...(Array.isArray(organisers)
            ? organisers.map((id) => new Types.ObjectId(id))
            : []),
        ],
        recepients: Array.isArray(recepients)
          ? recepients.map((id) => new Types.ObjectId(id))
          : [],
        projects: Array.isArray(projects)
          ? projects.map((id) => new Types.ObjectId(id))
          : [],
      };

      const createdAssociation = new this.eventAssociationModel(association);
      const savedAssociation = await createdAssociation.save();

      return { eventId: saved.id, associationId: savedAssociation.id };
    } catch (error) {
      throw new HttpException(
        'Failed to create event',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
  }

  /**
   * Update an event by its ID.
   *
   * @param id - The ID of the event to update.
   * @param body - The data to update the event with.
   * @returns The updated event.
   * @throws BadRequestException - If the ID is invalid.
   * @throws NotFoundException - If the event is not found.
   */
  async update(id: string, body: EventUpdateRequest): Promise<Event> {
    validateObjectId(id);

    const response = await this.eventModel
      .findByIdAndUpdate(id, body, {
        new: true,
      })
      .exec();

    if (!response) throw new NotFoundException(`Event not found for id ${id}`);

    return response;
  }

  /**
   * Update the associated details of an event.
   *
   * @param id - The ID of the event to update association.
   * @param eventUpdateAssociatedRequest - The changes to apply to the event association.
   * @returns The updated event association.
   * @throws NotFoundException - If the event association is not found.
   */
  async updateAssociated(
    id: string,
    eventUpdateAssociatedRequest: EventUpdateAssociatedRequest,
  ): Promise<EventAssociation | void> {
    validateObjectId(id);
    console.log(id);
    const eventAssociation = await this.eventAssociationModel.findOne({
      eventId: id,
    });

    if (!eventAssociation) {
      throw new NotFoundException(
        `Event association not found for event id ${id}`,
      );
    }

    if (eventUpdateAssociatedRequest.addOrganisers) {
      eventUpdateAssociatedRequest.addOrganisers.forEach((id) => {
        if (!eventAssociation.organisers.includes(new Types.ObjectId(id))) {
          eventAssociation.organisers.push(new Types.ObjectId(id));
        }
      });
    }

    if (eventUpdateAssociatedRequest.removeOrganisers) {
      eventUpdateAssociatedRequest.removeOrganisers.forEach((id) => {
        const index = eventAssociation.organisers.indexOf(
          new Types.ObjectId(id),
        );
        if (index !== -1) {
          eventAssociation.organisers.splice(index, 1);
        }
      });
    }

    if (eventUpdateAssociatedRequest.addRecipients) {
      eventUpdateAssociatedRequest.addRecipients.forEach((id) => {
        if (!eventAssociation.recepients.includes(new Types.ObjectId(id))) {
          eventAssociation.recepients.push(new Types.ObjectId(id));
        }
      });
    }

    if (eventUpdateAssociatedRequest.removeRecipients) {
      eventUpdateAssociatedRequest.removeRecipients.forEach((id) => {
        const index = eventAssociation.recepients.indexOf(
          new Types.ObjectId(id),
        );
        if (index !== -1) {
          eventAssociation.recepients.splice(index, 1);
        }
      });
    }

    if (eventUpdateAssociatedRequest.addProjects) {
      eventUpdateAssociatedRequest.addProjects.forEach((id) => {
        if (!eventAssociation.projects.includes(new Types.ObjectId(id))) {
          eventAssociation.projects.push(new Types.ObjectId(id));
        }
      });
    }

    if (eventUpdateAssociatedRequest.removeProjects) {
      eventUpdateAssociatedRequest.removeProjects.forEach((id) => {
        const index = eventAssociation.projects.indexOf(new Types.ObjectId(id));
        if (index !== -1) {
          eventAssociation.projects.splice(index, 1);
        }
      });
    }

    return await eventAssociation.save();
  }

  /**
   * Remove an event by its ID.
   *
   * @param id - The ID of the event to remove.
   * @returns void
   * @throws BadRequestException - If the ID is invalid.
   */
  async remove(id: string): Promise<void> {
    validateObjectId(id);
    const response = await this.eventModel.findByIdAndDelete(id).exec();
    if (!response) throw new NotFoundException(`Event not found for id ${id}`);
  }
}
