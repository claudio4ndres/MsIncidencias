import { sanitizeIdCardComponent } from '@helpers';

describe('sanitizeIdCardComponent', () => {
  it('debería eliminar correctamente los caracteres no deseados de una cadena', () => {
    const string = '12.345-6';
    const result = sanitizeIdCardComponent(string);

    expect(result).toBe('123456');
  });

  it('debería separar correctamente el último carácter del resto de la cadena', () => {
    const string = '12.345-6';
    const result = sanitizeIdCardComponent(string, 'split');

    expect(result).toEqual(['12345', '6']);
  });
});
