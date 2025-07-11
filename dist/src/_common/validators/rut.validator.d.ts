import { ValidatorConstraintInterface } from 'class-validator';
export declare class RutValidator implements ValidatorConstraintInterface {
    validate(text: string): boolean;
    defaultMessage(): string;
}
