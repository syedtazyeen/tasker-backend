import { EventCategory, EventStatus } from '@/src/common/enums';
import {
  EventCreateRequest,
  EventUpdateRequest,
} from '@/src/modules/events/events.dto';
import { faker } from '@faker-js/faker';
import { Types } from 'mongoose';

export class UserMock {
  static createNewUser() {
    return {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
  }
}
export class ProjectMock {
  static createNewProject() {
    return {
      slug: faker.lorem.slug(),
      name: faker.company.name(),
      description: faker.lorem.sentence(),
    };
  }
}

export class EventMock {
  static createNewEvent(): EventCreateRequest {
    return {
      name: faker.lorem.words(3),
      description: faker.lorem.paragraph(),
      status: faker.helpers.arrayElement(Object.values(EventStatus)),
      category: faker.helpers.arrayElement(Object.values(EventCategory)),
      organisers: [
        new Types.ObjectId().toString(),
        new Types.ObjectId().toString(),
      ],
      recepients: [
        new Types.ObjectId().toString(),
        new Types.ObjectId().toString(),
      ],
      projects: [new Types.ObjectId().toString()],
      startAt: faker.date.future(),
      endAt: faker.date.future(),
    };
  }

  static createUpdateEvent(): EventUpdateRequest {
    return {
      name: faker.lorem.words(2),
      description: faker.lorem.paragraph(),
      status: faker.helpers.arrayElement(Object.values(EventStatus)),
      category: faker.helpers.arrayElement(Object.values(EventCategory)),
      startAt: faker.date.future(),
      endAt: faker.date.future(),
    };
  }
}
