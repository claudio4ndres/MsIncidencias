import { RutValidator } from '@src/_common/validators/rut.validator';

describe('RutValidator', () => {
  let rutValidator: RutValidator;

  beforeEach(() => {
    rutValidator = new RutValidator();
  });

  describe('validate', () => {
    it('debería validar un RUT válido', () => {
      const rutValido = '12.345.678-5';
      expect(rutValidator.validate(rutValido)).toBe(true);
    });

    it('no debería validar un RUT inválido', () => {
      const rutInvalido = '12.345.678-0';
      expect(rutValidator.validate(rutInvalido)).toBe(false);
    });
  });

  describe('defaultMessage', () => {
    it('debería retornar el mensaje de error por defecto', () => {
      expect(rutValidator.defaultMessage()).toBe('Rut incorrecto');
    });
  });
});
