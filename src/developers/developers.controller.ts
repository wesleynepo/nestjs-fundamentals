import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { DevelopersService } from './developers.service';
import { CreateDeveloperDto } from './dto/create-developer.dto';
import { UpdateDeveloperDto } from './dto/update-developer.dto';
import { Developer } from './entities/developer.entity';

@ApiTags('Developers')
@Controller('developers')
export class DevelopersController {
  constructor(private readonly developersService: DevelopersService) {}

  @ApiOkResponse({
    description: 'The records has been successfully returned.',
    type: Developer,
    isArray: true,
  })
  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.developersService.findAll(paginationQuery);
  }

  @ApiOkResponse({
    description: 'The record has been successfully returned.',
    type: Developer,
  })
  @ApiNotFoundResponse({ description: 'Not found!' })
  @ApiBadRequestResponse({ description: 'Invalid ID' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.developersService.findOne(id);
  }

  @ApiCreatedResponse({
    description: 'The record has been successfully returned.',
    type: Developer,
  })
  @Post()
  create(@Body() createDeveloper: CreateDeveloperDto) {
    return this.developersService.create(createDeveloper);
  }

  @ApiOkResponse({
    description: 'The record has been successfully updated.',
    type: Developer,
  })
  @Patch(':id')
  update(@Body() updateDeveloper: UpdateDeveloperDto, @Param('id') id: string) {
    return this.developersService.update(id, updateDeveloper);
  }

  @ApiOkResponse({
    description: 'The record has been successfully deleted.',
    type: Developer,
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.developersService.remove(id);
  }
}
