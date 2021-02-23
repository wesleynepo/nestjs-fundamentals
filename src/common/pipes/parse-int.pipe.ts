import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    const integer = parseInt(value, 10);

    if (isNaN(integer)) {
      throw new BadRequestException(
        `Validation failed! "${value}" is not a integer`,
      );
    }

    return integer;
  }
}
