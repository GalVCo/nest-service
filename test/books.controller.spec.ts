import { Test } from '@nestjs/testing';
import { BooksController } from '../src/books/books.controller';
import { BooksService } from '../src/books/books.service';
import { CreateBookDto } from '../src/books/dto/create-book.dto';
import { UpdateBookDto } from '../src/books/dto/update-book.dto';

describe('BooksController', () => {
  let controller: BooksController;
  const svc = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  } as const;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [{ provide: BooksService, useValue: svc }],
    }).compile();

    controller = moduleRef.get(BooksController);
    jest.clearAllMocks();
  });

  it('creates a book', async () => {
    const dto: CreateBookDto = { title: 't', author: 'a', isbn: 'i', pages: 1 };
    (svc.create as jest.Mock).mockResolvedValue({ id: '1', ...dto });
    const res = await controller.create(dto);
    expect(svc.create).toHaveBeenCalledWith(dto);
    expect(res).toMatchObject({ id: '1' });
  });

  it('returns all books', async () => {
    (svc.findAll as jest.Mock).mockResolvedValue([{ id: '1' }]);
    const res = await controller.findAll();
    expect(res).toEqual([{ id: '1' }]);
  });

  it('returns a single book', async () => {
    (svc.findOne as jest.Mock).mockResolvedValue({ id: '1' });
    const res = await controller.findOne('1');
    expect(svc.findOne).toHaveBeenCalledWith('1');
    expect(res).toEqual({ id: '1' });
  });

  it('updates a book', async () => {
    const dto: UpdateBookDto = { title: 'new' };
    (svc.update as jest.Mock).mockResolvedValue({ id: '1', ...dto });
    const res = await controller.update('1', dto);
    expect(svc.update).toHaveBeenCalledWith('1', dto);
    expect(res).toEqual({ id: '1', ...dto });
  });

  it('removes a book (204)', async () => {
    (svc.remove as jest.Mock).mockResolvedValue({ deleted: true });
    const res = await controller.remove('1');
    expect(svc.remove).toHaveBeenCalledWith('1');
    expect(res).toBeUndefined();
  });
});

