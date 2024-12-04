import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@/src/app.module';
import { ProjectMock, UserMock } from './common/mock';

describe('Project Association API (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let projectId: string;
  let userId: string;
  let associationId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
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

    const user = await request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    userId = await user.body.id;

    const newProject = ProjectMock.createNewProject();
    const projectResponse = await request(app.getHttpServer())
      .post('/projects')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(newProject)
      .expect(201);

    projectId = projectResponse.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /project-association', () => {
    it('should return associations filtered by projectId', async () => {
      const response = await request(app.getHttpServer())
        .get('/project-association')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({ projectId })
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body[0]).toHaveProperty('projectId', projectId);

      associationId = response.body[0].id;
    });

    it('should return associations filtered by userId', async () => {
      const response = await request(app.getHttpServer())
        .get('/project-association')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({ userId })
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body[0]).toHaveProperty('userId', userId);

      associationId = response.body[0].id;
    });

    it('should return 403 if neither projectId nor userId is provided', async () => {
      await request(app.getHttpServer())
        .get('/project-association')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(403);
    });
  });

  describe('GET /project-association/:id', () => {
    it('should return a project association by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/project-association/${associationId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', associationId);
      expect(response.body).toHaveProperty('projectId', projectId);
      expect(response.body).toHaveProperty('userId', userId);
    });

    it('should return 404 if project association not found', async () => {
      await request(app.getHttpServer())
        .get('/project-association/nonexistentId')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('DELETE /project-association/:id', () => {
    it('should delete a project association by ID', async () => {
      await request(app.getHttpServer())
        .delete(`/project-association/${associationId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it('should return 404 if project association not found', async () => {
      await request(app.getHttpServer())
        .delete('/project-association/nonexistentId')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });
});
