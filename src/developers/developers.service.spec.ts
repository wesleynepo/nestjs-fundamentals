import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import TestUtil from '../common/test/test.util';
import { DevelopersService } from './developers.service';
import { CreateDeveloperDto } from './dto/create-developer.dto';
import { Developer } from './entities/developer.entity';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T = any>(): MockRepository<T> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  preload: jest.fn(),
  remove: jest.fn(),
});

describe('DevelopersService', () => {
  let service: DevelopersService;
  let developerRepository: MockRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DevelopersService,
        { provide: Connection, useValue: {} },
        {
          provide: getRepositoryToken(Developer),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<DevelopersService>(DevelopersService);
    developerRepository = module.get<MockRepository>(
      getRepositoryToken(Developer),
    );
  });

  beforeEach(async () => {
    developerRepository.find.mockReset();
    developerRepository.findOne.mockReset();
    developerRepository.create.mockReset();
    developerRepository.save.mockReset();
    developerRepository.preload.mockReset();
    developerRepository.remove.mockReset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('When searching for all developers', () => {
    it('Should return an empty array when no developers exists', async () => {
      developerRepository.find.mockReturnValue([]);

      const developers = await service.findAll({} as PaginationQueryDto);

      expect(developers).toStrictEqual([]);
    });

    it('Should list all developers', async () => {
      const user = TestUtil.giveMeAValidDeveloper();

      developerRepository.find.mockReturnValue([user, user]);

      const developers = await service.findAll({} as PaginationQueryDto);

      expect(developers).toHaveLength(2);
      expect(developerRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('When searching for a specific', () => {
    describe('When developer ID exists', () => {
      it('Should return developer object', async () => {
        const developer = TestUtil.giveMeAValidDeveloper();

        developerRepository.findOne.mockReturnValue(developer);
        const coffee = await service.findOne(developer.id.toString());

        expect(coffee).toMatchObject(developer);
        expect(developerRepository.findOne).toBeCalledTimes(1);
      });
    });

    describe('Otherwise', () => {
      it('should throw "NotFoundException"', async () => {
        const developerID = '1';

        developerRepository.findOne.mockReturnValue(undefined);

        try {
          await service.findOne(developerID);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(developerRepository.findOne).toBeCalledTimes(1);
          expect(error.message).toEqual(`Developer #${developerID} not found!`);
        }
      });
    });

    describe('When creating a new developer', () => {
      describe('When receive a valid object', () => {
        it('Should return developer object', async () => {
          const developer = TestUtil.giveMeAValidDeveloper();

          developerRepository.save.mockReturnValue(developer);
          developerRepository.create.mockReturnValue(developer);

          const savedDeveloper = await service.create(developer);

          expect(developerRepository.create).toBeCalledTimes(1);
          expect(developerRepository.save).toBeCalledTimes(1);
          expect(savedDeveloper).toMatchObject(developer);
        });
      });
    });

    describe('When update a developer', () => {
      describe('When developer ID is not valid', () => {
        it('Should throw exception NotFoundException', async () => {
          const developer = TestUtil.giveMeAValidDeveloper();
          try {
            await service.update(developer.id.toString(), developer);
          } catch (error) {
            expect(error).toBeInstanceOf(NotFoundException);
            expect(developerRepository.preload).toBeCalledTimes(1);
            expect(error.message).toEqual(
              `Developer #${developer.id} not found!`,
            );
          }
        });
      });

      describe('When developer ID is valid', () => {
        it('Should return the developer object', async () => {
          const developer = TestUtil.giveMeAValidDeveloper();
          developerRepository.preload.mockReturnValue(developer);
          developerRepository.save.mockReturnValue(developer);

          const updatedDeveloper = await service.update(
            '' + developer.id,
            developer,
          );

          expect(updatedDeveloper).toMatchObject(developer);
          expect(developerRepository.preload).toBeCalledTimes(1);
          expect(developerRepository.save).toBeCalledTimes(1);
        });
      });
    });

    describe('When remove a developer', () => {
      describe('When developer ID exists', () => {
        it('Should remove the developer', async () => {
          const developer = TestUtil.giveMeAValidDeveloper();

          developerRepository.findOne.mockReturnValue(developer);
          developerRepository.remove.mockReturnValue(developer);

          const deletedDeveloper = await service.remove(
            developer.id.toString(),
          );

          expect(deletedDeveloper).toMatchObject(developer);
          expect(developerRepository.findOne).toBeCalledTimes(1);
          expect(developerRepository.remove).toBeCalledTimes(1);
        });
      });

      describe('Otherwise', () => {
        it('Should throw NotFoundException', async () => {
          const developer = TestUtil.giveMeAValidDeveloper();

          try {
            await service.remove(developer.id.toString());
          } catch (error) {
            expect(error).toBeInstanceOf(NotFoundException);
            expect(developerRepository.findOne).toBeCalledTimes(1);
            expect(developerRepository.remove).toBeCalledTimes(0);
            expect(error.message).toEqual(
              `Developer #${developer.id} not found!`,
            );
          }
        });
      });
    });
  });
});
