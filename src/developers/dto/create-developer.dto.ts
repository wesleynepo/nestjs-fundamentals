import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsDate, IsEnum } from 'class-validator';
import { SexTypes } from '../interface/sex-types.interface';

export class CreateDeveloperDto {
  @ApiProperty()
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'Developer sex', enum: SexTypes })
  @IsEnum(SexTypes)
  readonly sex: SexTypes;

  @ApiProperty()
  @IsInt()
  readonly age: number;

  @ApiProperty()
  @IsString()
  readonly hobby: string;

  @ApiProperty()
  @IsDate()
  readonly birthdate: Date;
}
