import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { validate } from 'rut.js';

@ValidatorConstraint({ name: 'customText', async: false })
export class RutValidator implements ValidatorConstraintInterface {
  validate(text: string) {
    return validate(text);
  }

  defaultMessage() {
    return 'Rut incorrecto';
  }
}
