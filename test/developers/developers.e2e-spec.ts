import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { DevelopersModule } from '../../src/developers/developers.module';
import TestUtil from '../../src/common/test/test.util';

describe('[Feature] Developers - /developers', () => {
  const developer = TestUtil.giveMeAValidDeveloper();

  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        DevelopersModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5433,
          username: 'postgres',
          password: 'pass123',
          database: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    await app.init();
  });
  describe('POST', () => {
    it('Should complete and return the developer', async () => {
      const { name, birthdate, age, hobby, sex } = developer;

      const response = await request(app.getHttpServer())
        .post('/developers')
        .send({
          name,
          age,
          hobby,
          sex,
          birthdate: birthdate.toJSON(),
        })
        .expect(HttpStatus.CREATED);

      expect(response.body).toEqual({
        ...developer,
        birthdate: developer.birthdate.toJSON(),
      });
    });

    it('Should fail if not valid developer object', async () => {
      await request(app.getHttpServer())
        .post('/developers')
        .send({ name: 'Wesley' })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  it('GET ALL', async () => {
    const response = await request(app.getHttpServer())
      .get('/developers')
      .expect(HttpStatus.OK);

    expect(response.body).toEqual(expect.any(Array));
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toEqual({
      ...developer,
      birthdate: developer.birthdate.toJSON(),
    });
  });

  describe('GET ID', () => {
    it('Should return a developer with a valid ID', async () => {
      const response = await request(app.getHttpServer())
        .get('/developers/1')
        .expect(HttpStatus.OK);

      expect(response.body).toEqual({
        ...developer,
        birthdate: developer.birthdate.toJSON(),
      });
    });

    it('Should return 404 if not existing ID', async () => {
      await request(app.getHttpServer())
        .get('/developers/1223')
        .expect(HttpStatus.NOT_FOUND);
    });

    it('Should return 500 if not existing ID', async () => {
      await request(app.getHttpServer())
        .get('/developers/1223')
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  it('PATCH', async () => {
    const hobby = 'Test hobby';
    const response = await request(app.getHttpServer())
      .patch('/developers/1')
      .send({
        hobby,
      });
    expect(response.body.hobby).toBe(hobby);
  });

  it('DELETE', async () => {
    await request(app.getHttpServer())
      .delete('/developers/1')
      .expect(HttpStatus.OK);
  });

  afterAll(async () => {
    await app.close();
  });
});
