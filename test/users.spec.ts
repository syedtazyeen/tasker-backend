import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@/src/app.module';
import { UserMock } from './common/mock';

describe('Users API (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let currentUser: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Assume we register and login a user to obtain an access token
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

  describe('GET /users', () => {
    it('should return 401 if unauthorized', async () => {
      await request(app.getHttpServer()).get('/users').expect(401);
    });

    it('should return a list of users', async () => {
      await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it('should return current user', async () => {
      const userResponse = await request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      currentUser = userResponse.body;
    });
  });

  describe('GET /users/:id', () => {
    it('should return a user by ID', async () => {
      await request(app.getHttpServer())
        .get(`/users/${currentUser.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it('should return 404 if user not found', async () => {
      await request(app.getHttpServer())
        .get('/users/nonexistentId')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('PATCH /users/:id', () => {
    it('should update a user by ID', async () => {
      const updateData = { name: 'Updated Name' };

      await request(app.getHttpServer())
        .patch(`/users/${currentUser.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData)
        .expect(200);
    });

    it('should return 404 if user not found', async () => {
      await request(app.getHttpServer())
        .patch('/users/nonexistentId')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'New Name' })
        .expect(404);
    });
  });

  describe('PATCH /users/status/:id', () => {
    it('should update user status', async () => {
      const statusUpdate = { status: 'active' };

      await request(app.getHttpServer())
        .patch(`/users/status/${currentUser.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(statusUpdate)
        .expect(200);
    });
  });

  describe('DELETE /users/:id', () => {
    it('should return 404 if user not found', async () => {
      await request(app.getHttpServer())
        .delete('/users/nonexistentId')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
    it('should delete a user by ID', async () => {
      await request(app.getHttpServer())
        .delete(`/users/${currentUser.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });
  });
});
