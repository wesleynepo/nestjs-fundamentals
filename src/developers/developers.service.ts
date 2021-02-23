import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Developer } from './entities/developer.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CreateDeveloperDto } from './dto/create-developer.dto';
import { UpdateDeveloperDto } from './dto/update-developer.dto';

@Injectable()
export class DevelopersService {
  constructor(
    @InjectRepository(Developer)
    private readonly developerRepository: Repository<Developer>,
  ) {}

  findAll(paginationQuery: PaginationQueryDto) {
    const { offset, limit } = paginationQuery;

    return this.developerRepository.find({
      relations: [],
      take: limit,
      skip: offset,
    });
  }

  async findOne(id: string) {
    const developer: Developer = await this.developerRepository.findOne(id);

    if (!developer) {
      throw new NotFoundException(`Developer #${id} not found!`);
    }

    return developer;
  }

  async create(createDeveloperDto: CreateDeveloperDto) {
    const developer = this.developerRepository.create(createDeveloperDto);

    return this.developerRepository.save(developer);
  }

  async update(id: string, updateDeveloeprDto: UpdateDeveloperDto) {
    const developer = await this.developerRepository.preload({
      id: +id,
      ...updateDeveloeprDto,
    });

    if (!developer) {
      throw new NotFoundException(`Developer #${id} not found!`);
    }

    return this.developerRepository.save(developer);
  }

  async remove(id: string) {
    const developer = await this.findOne(id);
    return this.developerRepository.remove(developer);
  }
}
