import * as request from 'supertest';
import { AppModule } from '@/src/app.module';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ProjectMock, UserMock } from './common/mock';

describe('Projects API (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let projectId: string;
  let project: any;

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
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /projects', () => {
    it('should create a new project', async () => {
      const newProject = ProjectMock.createNewProject();
      const response = await request(app.getHttpServer())
        .post('/projects')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(newProject)
        .expect(201);

      projectId = response.body.id;
      project = response.body;
    });

    it('should return 401 if unauthorized', async () => {
      const newProject = ProjectMock.createNewProject();
      await request(app.getHttpServer())
        .post('/projects')
        .send(newProject)
        .expect(401);
    });
  });

  describe('GET /projects/:id', () => {
    it('should return the project by ID', async () => {
      await request(app.getHttpServer())
        .get(`/projects/${projectId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it('should return 404 if project not found', async () => {
      await request(app.getHttpServer())
        .get('/projects/nonexistentId')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('GET /projects/is-slug-available', () => {
    it('should check if slug is available', async () => {
      const slug = project.slug;
      const response = await request(app.getHttpServer())
        .get('/projects/is-slug-available')
        .query({ slug })
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.value).toBe(false);
    });

    it('should check if slug is available', async () => {
      const newProject = ProjectMock.createNewProject();
      const response = await request(app.getHttpServer())
        .get('/projects/is-slug-available')
        .query({ slug: newProject.slug })
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.value).toBe(true);
    });

    it('should return 403 if no slug is provided', async () => {
      await request(app.getHttpServer())
        .get('/projects/is-slug-available')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(403);
    });
  });

  describe('PATCH /projects/:id', () => {
    it('should update the project', async () => {
      const updateProjectDto = {
        name: 'Updated Project Name',
        description: 'Updated description for the project',
      };

      const response = await request(app.getHttpServer())
        .patch(`/projects/${projectId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateProjectDto)
        .expect(200);

      expect(response.body.name).toBe(updateProjectDto.name);
      expect(response.body.description).toBe(updateProjectDto.description);
    });

    it('should return 404 if project not found', async () => {
      const updateProjectDto = {
        name: 'Updated Project Name',
      };

      await request(app.getHttpServer())
        .patch('/projects/nonexistentId')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateProjectDto)
        .expect(404);
    });
  });

  describe('DELETE /projects/:id', () => {
    it('should delete the project', async () => {
      await request(app.getHttpServer())
        .delete(`/projects/${projectId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it('should return 404 if project not found', async () => {
      await request(app.getHttpServer())
        .delete('/projects/nonexistentId')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });
});
