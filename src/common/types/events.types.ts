import { EventCategory, EventStatus } from "../enums";

export type Event = {
  id: string;
  name: string;
  description?: string;
  status: EventStatus;
  category: EventCategory;
  createdBy: string;
  associatedTo: string[];
  createdAt: Date;
  updatedAt: Date;
  startAt: Date;
  endAt: Date;
};

