import { Test } from '@nestjs/testing';
import { BooksService } from '../src/books/books.service';
import { PrismaService } from '../src/database/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('BooksService', () => {
  let service: BooksService;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: PrismaService,
          useValue: {
            book: {
              create: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get(BooksService);
    prisma = module.get(PrismaService) as unknown as jest.Mocked<PrismaService>;
  });

  it('creates a book', async () => {
    prisma.book.create.mockResolvedValue({ id: '1', title: 't', author: 'a', isbn: 'i', pages: 1 });
    const res = await service.create({ title: 't', author: 'a', isbn: 'i', pages: 1 });
    expect(res).toMatchObject({ id: '1' });
  });

  it('throws on duplicate isbn', async () => {
    prisma.book.create.mockRejectedValue({ code: 'P2002' });
    await expect(service.create({ title: 't', author: 'a', isbn: 'i', pages: 1 })).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it('findOne throws when missing', async () => {
    prisma.book.findUnique.mockResolvedValue(null);
    await expect(service.findOne('x')).rejects.toBeInstanceOf(NotFoundException);
  });
});
