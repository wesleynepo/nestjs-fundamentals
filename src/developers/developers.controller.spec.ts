import { Test, TestingModule } from '@nestjs/testing';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import TestUtil from '../common/test/test.util';
import { DevelopersController } from './developers.controller';
import { DevelopersService } from './developers.service';
import { CreateDeveloperDto } from './dto/create-developer.dto';
import { UpdateDeveloperDto } from './dto/update-developer.dto';

describe('DevelopersController', () => {
  let controller: DevelopersController;
  let service: DevelopersService;
  const GENERATED_ID = 2;
  const developer = TestUtil.giveMeAValidDeveloper();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DevelopersController],
      providers: [
        {
          provide: DevelopersService,
          useValue: {
            findAll: jest.fn().mockReturnValue([developer, developer]),
            findOne: jest.fn().mockImplementation((id: string) =>
              Promise.resolve({
                ...developer,
                id: +id,
              }),
            ),
            create: jest
              .fn()
              .mockImplementation((developer: CreateDeveloperDto) =>
                Promise.resolve({ id: GENERATED_ID, ...developer }),
              ),
            update: jest
              .fn()
              .mockImplementation((id: string, developer: UpdateDeveloperDto) =>
                Promise.resolve({ id: +id, ...developer }),
              ),
            remove: jest.fn().mockResolvedValue(developer),
          },
        },
      ],
    }).compile();

    controller = module.get<DevelopersController>(DevelopersController);
    service = module.get<DevelopersService>(DevelopersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('When searching for all developers', () => {
    it('Should get an array of developers', () => {
      const response = controller.findAll({} as PaginationQueryDto);

      expect(response).toBeDefined();
      expect(response).toEqual([developer, developer]);
    });
  });

  describe('When searching for a unique developer', () => {
    it('Should get a single developer', async () => {
      const response = await controller.findOne(developer.id.toString());
      expect(response).toEqual(developer);
    });
  });

  describe('When creating a new developer', () => {
    it('Should create a new developer', async () => {
      const newDeveloper: CreateDeveloperDto = {
        name: 'name válido',
        birthdate: new Date(),
        hobby: 'Hobby válido',
        age: 25,
        sex: 'M',
      };

      await expect(controller.create(newDeveloper)).resolves.toEqual({
        id: GENERATED_ID,
        ...newDeveloper,
      });
    });
  });

  describe('When update a new developer', () => {
    it('Should return a updated developer', async () => {
      const updateDeveloper: UpdateDeveloperDto = {
        name: 'name válido',
        birthdate: new Date(),
        hobby: 'Hobby válido',
        age: 25,
        sex: 'M',
      };

      await expect(
        controller.update(updateDeveloper, GENERATED_ID.toString()),
      ).resolves.toEqual({
        id: GENERATED_ID,
        ...updateDeveloper,
      });
    });
  });

  describe('When delete a developer', () => {
    it('Should return the deleted developer', async () => {
      await expect(controller.remove('1')).resolves.toEqual(developer);
    });
  });
});
