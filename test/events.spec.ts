import { Types } from 'mongoose';
import * as request from 'supertest';
import { AppModule } from '@/src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  EventAssociationUpdateRequest,
  EventCreateResponse,
  EventResponse,
} from '@/src/modules/events/events.dto';
import { EventMock, UserMock } from '@/test/common/mock';
import { Event } from '@/src/modules/events/events.schema';
import { EventAssociation } from '@/src/modules/events/events-association.schema';
import { startOfQuarter } from 'date-fns';

describe('Events API (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let event: Event;
  let eventAssociation: EventAssociation;
  let projectId: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    const newUser = UserMock.createNewUser();
    await request(app.getHttpServer())
      .post('/auth/register')
      .send(newUser)
      .expect(201);

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: newUser.email,
        password: newUser.password,
      })
      .expect(200);

    accessToken = loginResponse.body.accessToken;
    userId = loginResponse.body.user.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /events', () => {
    it('should create a new event', async () => {
      const newEvent = EventMock.createNewEvent();
      const response: { body: EventCreateResponse } = await request(
        app.getHttpServer(),
      )
        .post('/events')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(newEvent)
        .expect(201);

      event = response.body.event;
      eventAssociation = response.body.association;
      newEvent.organizers.push(userId);

      expect(event.createdBy).toStrictEqual(userId);
      expect(eventAssociation.eventId).toStrictEqual(response.body.event.id);
      expect(eventAssociation.organizers).toStrictEqual(newEvent.organizers);
      expect(eventAssociation.projects).toStrictEqual(newEvent.projects);
      expect(eventAssociation.recipients).toStrictEqual(newEvent.recipients);
    });

    it('should return 400 for invalid data', async () => {
      const invalidEvent = { name: '', startAt: '', endAt: '' };
      await request(app.getHttpServer())
        .post('/events')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(invalidEvent)
        .expect(400);
    });

    it('should return 401 if unauthorized', async () => {
      const newEvent = EventMock.createNewEvent();
      await request(app.getHttpServer())
        .post('/events')
        .send(newEvent)
        .expect(401);
    });
  });

  describe('GET /events/:id', () => {
    it('should return the event by ID', async () => {
      const response: { body: EventResponse } = await request(
        app.getHttpServer(),
      )
        .get(`/events/${event.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.id).toBe(event.id);
      expect(response.body.createdBy).toBe(userId);
    });

    it('should return 404 if event not found', async () => {
      await request(app.getHttpServer())
        .get(`/events/${new Types.ObjectId().toString()}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('GET /events', () => {
    it('should return all events', async () => {
      const response = await request(app.getHttpServer())
        .get('/events')
        .query({ startTime: startOfQuarter(new Date()) })
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return events for a user', async () => {
      const response = await request(app.getHttpServer())
        .get('/events')
        .query({ startTime: startOfQuarter(new Date()), userId })
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return events for a project', async () => {
      const response = await request(app.getHttpServer())
        .get('/events')
        .query({ startTime: startOfQuarter(new Date()), projectId })
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return 400 for invalid query parameters', async () => {
      await request(app.getHttpServer())
        .get('/events')
        .query({ startTime: 'invalidDate', endTime: 'invalidDate' })
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);
    });
  });

  describe('PATCH /events/:id', () => {
    it('should update the event', async () => {
      const updateEventDto = {
        name: 'Updated Event Name',
        description: 'Updated description',
      };

      const response = await request(app.getHttpServer())
        .patch(`/events/${event.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateEventDto)
        .expect(200);

      expect(response.body.name).toBe(updateEventDto.name);
      expect(response.body.description).toBe(updateEventDto.description);
    });

    it('should return 404 if event not found', async () => {
      const updateEventDto = { name: 'Updated Event Name' };

      await request(app.getHttpServer())
        .patch(`/events/${new Types.ObjectId().toString()}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateEventDto)
        .expect(404);
    });

    it('should return 400 if update data is invalid', async () => {
      const invalidUpdate = { startAt: 'invalidDate', endAt: 'invalidDate' };

      await request(app.getHttpServer())
        .patch(`/events/${event.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(invalidUpdate)
        .expect(400);
    });
  });

  describe('PUT /events/:id/association', () => {
    it('should update event association with valid ObjectIds', async () => {
      const validUserIds = [
        new Types.ObjectId()._id.toString('hex'),
        new Types.ObjectId()._id.toString('hex'),
      ];

      const updateAssociatedDto: EventAssociationUpdateRequest = {
        addOrganisers: validUserIds,
        removeOrganisers: [new Types.ObjectId().toString()],
        addRecipients: validUserIds,
        removeRecipients: [new Types.ObjectId().toString()],
      };

      await request(app.getHttpServer())
        .put(`/events/${event.id}/association`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateAssociatedDto)
        .expect(200);
    });

    it('should return 404 if event not found', async () => {
      const updateAssociatedDto: EventAssociationUpdateRequest = {
        addRecipients: [new Types.ObjectId().toString()],
      };

      await request(app.getHttpServer())
        .put(`/events/${new Types.ObjectId().toString()}/association`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateAssociatedDto)
        .expect(404);
    });
  });

  describe('DELETE /events/:id', () => {
    it('should delete the event', async () => {
      await request(app.getHttpServer())
        .delete(`/events/${event.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it('should return 404 if event not found', async () => {
      await request(app.getHttpServer())
        .delete(`/events/${new Types.ObjectId().toString()}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('should return 401 if unauthorized', async () => {
      await request(app.getHttpServer())
        .delete(`/events/${event.id}`)
        .expect(401);
    });
  });
});
