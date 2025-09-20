import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';
import { createAppWithDefaults } from './utils/app';

class InMemoryPrisma implements Partial<PrismaService> {
  private data: Array<any> = [];
  private id = 0;
  book = {
    create: ({ data }: any) => {
      const created = { id: String(++this.id), createdAt: new Date(), ...data };
      this.data.push(created);
      return Promise.resolve(created);
    },
    findMany: () => Promise.resolve([...this.data]),
    findUnique: ({ where: { id } }: any) => Promise.resolve(this.data.find((b) => b.id === id) ?? null),
    update: ({ where: { id }, data }: any) => {
      const idx = this.data.findIndex((b) => b.id === id);
      if (idx === -1) return Promise.resolve(null);
      this.data[idx] = { ...this.data[idx], ...data };
      return Promise.resolve(this.data[idx]);
    },
    delete: ({ where: { id } }: any) => {
      const idx = this.data.findIndex((b) => b.id === id);
      if (idx === -1) return Promise.resolve(null);
      const [removed] = this.data.splice(idx, 1);
      return Promise.resolve(removed);
    },
  };
}

describe('Books API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(PrismaService)
      .useValue(new InMemoryPrisma())
      .compile();

    app = await createAppWithDefaults(moduleRef);
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /v1/books creates', async () => {
    const res = await request(app.getHttpServer())
      .post('/v1/books')
      .send({ title: 't', author: 'a', isbn: 'i', pages: 1 });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('GET /v1/books lists', async () => {
    const res = await request(app.getHttpServer()).get('/v1/books');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /v1/books/:id returns one', async () => {
    const created = await request(app.getHttpServer())
      .post('/v1/books')
      .send({ title: 't2', author: 'a2', isbn: 'i2', pages: 2 });
    const id = created.body.id;
    const res = await request(app.getHttpServer()).get(`/v1/books/${id}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', id);
  });

  it('PATCH /v1/books/:id updates', async () => {
    const created = await request(app.getHttpServer())
      .post('/v1/books')
      .send({ title: 't3', author: 'a3', isbn: 'i3', pages: 3 });
    const id = created.body.id;
    const res = await request(app.getHttpServer()).patch(`/v1/books/${id}`).send({ title: 't3b' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('title', 't3b');
  });

  it('DELETE /v1/books/:id deletes', async () => {
    const created = await request(app.getHttpServer())
      .post('/v1/books')
      .send({ title: 't4', author: 'a4', isbn: 'i4', pages: 4 });
    const id = created.body.id;
    const res = await request(app.getHttpServer()).delete(`/v1/books/${id}`);
    expect(res.status).toBe(204);
  });
});
