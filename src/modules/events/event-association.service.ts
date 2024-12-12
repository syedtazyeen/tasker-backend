import { Model, RootFilterQuery } from 'mongoose';
import { validateObjectId } from '@/src/lib/utils';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  EventAssociation,
  EventAssociationDocument,
} from './events-association.schema';
import {
  EventAssociationResponse,
  EventAssociationUpdateRequest,
} from './events.dto';

@Injectable()
export class EventsAssociationService {
  constructor(
    @InjectModel(EventAssociation.name)
    private eventAssociationModel: Model<EventAssociationDocument>,
  ) {}

  /**
   * Find an event association by its ID.
   *
   * @param {string} id - The ID of the event association.
   * @returns The event association if found, or null if not.
   * @throws BadRequestException - If the ID is invalid.
   */
  async findOne(id: string): Promise<EventAssociationResponse | null> {
    validateObjectId(id);
    return this.eventAssociationModel.findById(id).exec();
  }

  /**
   * Find an event association by the event ID.
   *
   * @param {string}eventId - The ID of the event to find the association for.
   * @returns The event association for the given event ID.
   * @throws BadRequestException - If the event ID is invalid.
   */
  async findByEventId(
    eventId: string,
  ): Promise<EventAssociationResponse | null> {
    validateObjectId(eventId);
    return this.eventAssociationModel.findOne({ eventId }).exec();
  }

  /**
   * Find list of event associations by filter.
   *
   * @param {RootFilterQuery<EventAssociationDocument>} filter - The filter query to get list of event association.
   * @returns The list of event association.
   * @throws BadRequestExceptio - If the event ID is invalid.
   */
  async findByQuery(
    filter: RootFilterQuery<EventAssociationDocument>,
  ): Promise<EventAssociationResponse[]> {
    return this.eventAssociationModel.find(filter).exec();
  }

  /**
   * Create an event association.
   *
   * @param {EventAssociation} payload - The payload of event association to create.
   * @returns {EventAssociationDocument} - The created event association.
   */
  async create(
    payload: Partial<EventAssociation>,
  ): Promise<EventAssociationDocument> {
    const created = new this.eventAssociationModel(payload);
    return await created.save();
  }

  /**
   * Update the associated details of an event.
   *
   * @param {string} id - The ID of the event to update association.
   * @param {EventUpdateAssociatedRequest} payload - The changes to apply to the event association.
   * @returns The updated event association.
   * @throws NotFoundException - If the event association is not found.
   */
  async update(
    id: string,
    payload: EventAssociationUpdateRequest,
  ): Promise<EventAssociationResponse> {
    validateObjectId(id);
    const eventAssociation = await this.eventAssociationModel
      .findOne({
        eventId: id,
      })
      .exec();

    if (!eventAssociation) {
      throw new NotFoundException(
        `Event association not found for event id ${id}`,
      );
    }

    if (payload.addOrganisers) {
      payload.addOrganisers.forEach((id) => {
        if (!eventAssociation.organizers.includes(id)) {
          eventAssociation.organizers.push(id);
        }
      });
    }

    if (payload.removeOrganisers) {
      payload.removeOrganisers.forEach((id) => {
        const index = eventAssociation.organizers.indexOf(id);
        if (index !== -1) {
          eventAssociation.organizers.splice(index, 1);
        }
      });
    }

    if (payload.addRecipients) {
      payload.addRecipients.forEach((id) => {
        if (!eventAssociation.recipients.includes(id)) {
          eventAssociation.recipients.push(id);
        }
      });
    }

    if (payload.removeRecipients) {
      payload.removeRecipients.forEach((id) => {
        const index = eventAssociation.recipients.indexOf(id);
        if (index !== -1) {
          eventAssociation.recipients.splice(index, 1);
        }
      });
    }

    if (payload.addProjects) {
      payload.addProjects.forEach((id) => {
        if (!eventAssociation.projects.includes(id)) {
          eventAssociation.projects.push(id);
        }
      });
    }

    if (payload.removeProjects) {
      payload.removeProjects.forEach((id) => {
        const index = eventAssociation.projects.indexOf(id);
        if (index !== -1) {
          eventAssociation.projects.splice(index, 1);
        }
      });
    }

    return await eventAssociation.save();
  }

  /**
   * Remove an event association by its ID.
   *
   * @param {string} id - The ID of the event association to remove.
   * @returns void
   * @throws BadRequestException - If the ID is invalid.
   */
  async remove(id: string): Promise<void> {
    validateObjectId(id);
    const response = await this.eventAssociationModel
      .findByIdAndDelete(id)
      .exec();
    if (!response)
      throw new NotFoundException(`Event association not found for id ${id}`);
  }
}
