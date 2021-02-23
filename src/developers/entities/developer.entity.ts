import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { SexTypes } from '../interface/sex-types.interface';

@Entity()
export class Developer {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  sex: SexTypes;

  @ApiProperty()
  @Column()
  age: number;

  @ApiProperty()
  @Column()
  hobby: string;

  @ApiProperty()
  @Column()
  birthdate: Date;
}
