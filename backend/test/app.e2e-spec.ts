import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    it('/auth/login (POST) should return access token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          provider: 'google',
          providerId: '123',
          email: 'test@example.com',
          name: 'Test User',
        })
        .expect(200);

      accessToken = response.body.access_token;
      expect(accessToken).toBeDefined();
    });
  });

  describe('Posts', () => {
    let postId: number;

    it('/posts (POST) should create a post', async () => {
      const response = await request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Test Post',
          body: 'Test Body',
        })
        .expect(201);

      postId = response.body.id;
      expect(response.body.title).toEqual('Test Post');
    });

    it('/posts (GET) should return posts', async () => {
      const response = await request(app.getHttpServer())
        .get('/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.posts).toHaveLength(1);
      expect(response.body.total).toEqual(1);
    });

    it('/posts/:id (GET) should return a post', async () => {
      const response = await request(app.getHttpServer())
        .get(`/posts/${postId}`)
        .expect(200);

      expect(response.body.id).toEqual(postId);
    });

    it('/posts/:id (PUT) should update a post', async () => {
      await request(app.getHttpServer())
        .put(`/posts/${postId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Updated Post',
          body: 'Updated Body',
        })
        .expect(200);
    });

    it('/posts/:id (DELETE) should delete a post', async () => {
      await request(app.getHttpServer())
        .delete(`/posts/${postId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });
  });
});
