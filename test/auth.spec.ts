import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@/src/app.module';
import { UserMock } from './common/mock';

describe('Auth API - User Registration and Login (e2e)', () => {
  let app: INestApplication;

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
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/register', () => {
    it('should successfully register a new user', async () => {
      const newUser = UserMock.createNewUser();

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(newUser)
        .expect(201);
    });

    it('should return 409 if email already exists', async () => {
      const existingUser = UserMock.createNewUser();
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(existingUser)
        .expect(201);

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(existingUser)
        .expect(409);
    });
    
    it('should return 400 if missing fields', async () => {
      const newUser = UserMock.createNewUser();
      const badUser = {
        name: newUser.name,
        password: newUser.password,
      };
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(badUser)
        .expect(400);
    });
    
  });

  describe('POST /auth/login', () => {
    let user = null;

    it('should successfully login a user with correct credentials', async () => {
      const newUser = UserMock.createNewUser();
      user = newUser;
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(newUser)
        .expect(201);

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: newUser.email,
          password: newUser.password,
        })
        .expect(200);
      expect(response.body).toHaveProperty('accessToken');
    });

    it('should return 401 if invalid credentials are provided', async () => {
      const invalidUser = {
        email: user.email,
        password: 'wrongpassword',
      };

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(invalidUser)
        .expect(401);
    });

    it('should return 404 if non-existing credentials are provided', async () => {
      const invalidUser = {
        email: 'nonexistent@example.com',
        password: 'wrongpassword',
      };

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(invalidUser)
        .expect(404);
    });
  });
});
