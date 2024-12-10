import { Types } from 'mongoose';
import * as request from 'supertest';
import { AppModule } from '@/src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { EventMock, UserMock } from './common/mock';

describe('Events API (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let eventId: string;

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

    // Register a user and log in to get an access token
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
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /events', () => {
    it('should create a new event', async () => {
      const newEvent = EventMock.createNewEvent();
      console.log(newEvent);
      const response = await request(app.getHttpServer())
        .post('/events')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(newEvent)
        .expect(201);

      eventId = response.body.id;
      expect(response.body.name).toBe(newEvent.name);
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
      await request(app.getHttpServer())
        .get(`/events/${eventId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it('should return 404 if event not found', async () => {
      await request(app.getHttpServer())
        .get('/events/nonexistentId')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('GET /events', () => {
    it('should return all events', async () => {
      await request(app.getHttpServer())
        .get('/events')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
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
        .patch(`/events/${eventId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateEventDto)
        .expect(200);

      expect(response.body.name).toBe(updateEventDto.name);
      expect(response.body.description).toBe(updateEventDto.description);
    });

    it('should return 404 if event not found', async () => {
      const updateEventDto = {
        name: 'Updated Event Name',
      };

      await request(app.getHttpServer())
        .patch('/events/nonexistentId')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateEventDto)
        .expect(404);
    });

    it('should return 400 if update data is invalid', async () => {
      const invalidUpdate = {
        startAt: 'invalidDate',
        endAt: 'invalidDate',
      };

      await request(app.getHttpServer())
        .patch(`/events/${eventId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(invalidUpdate)
        .expect(400);
    });
  });

  describe('PUT /events/:id/associatedTo', () => {
    it('should update associated users with valid ObjectIds', async () => {
      const validUserIds = [
        new Types.ObjectId().toString(),
        new Types.ObjectId().toString(),
      ]; // Valid ObjectIds
      const updateAssociatedDto = {
        addUserIds: validUserIds,
        removeUserIds: [new Types.ObjectId().toString()],
      };

      const response = await request(app.getHttpServer())
        .put(`/events/${eventId}/associatedTo`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateAssociatedDto)
        .expect(200);

      expect(response.body.associatedTo).toContain(validUserIds[0]);
      expect(response.body.associatedTo).toContain(validUserIds[1]);
    });

    it('should return 404 if event not found', async () => {
      const updateAssociatedDto = {
        addUserIds: [new Types.ObjectId().toString()],
      };

      await request(app.getHttpServer())
        .put('/events/nonexistentId/associatedTo')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateAssociatedDto)
        .expect(404);
    });
  });

  describe('DELETE /events/:id', () => {
    it('should delete the event', async () => {
      await request(app.getHttpServer())
        .delete(`/events/${eventId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it('should return 404 if event not found', async () => {
      await request(app.getHttpServer())
        .delete('/events/nonexistentId')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it('should return 401 if unauthorized', async () => {
      await request(app.getHttpServer())
        .delete(`/events/${eventId}`)
        .expect(401);
    });
  });
});
