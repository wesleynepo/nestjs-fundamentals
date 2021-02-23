import { Developer } from '../../developers/entities/developer.entity';
import { SexTypes } from '../../developers/interface/sex-types.interface';

export default class TestUtil {
  static giveMeAValidDeveloper(): Developer {
    const developer: Developer = new Developer();

    developer.id = 1;
    developer.hobby = 'Valid hobby';
    developer.age = 25;
    developer.name = 'Valid name';
    developer.sex = SexTypes.MALE;
    developer.birthdate = new Date();

    return developer;
  }
}
