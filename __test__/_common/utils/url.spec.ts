import getPathAfterPort from '@src/_common/utils/url';

describe('getPathAfterPort', () => {
  it('debería devolver el path, search y hash de una URL válida', () => {
    const url = 'http://example.com:8080/path?query=123#hash';
    const result = getPathAfterPort(url);
    expect(result).toBe('/path?query=123#hash');
  });

  it('debería devolver solo el path si no hay search ni hash', () => {
    const url = 'http://example.com:8080/path';
    const result = getPathAfterPort(url);
    expect(result).toBe('/path');
  });

  it('debería devolver una cadena vacía para una URL inválida', () => {
    const invalidUrl = 'invalid-url';
    const result = getPathAfterPort(invalidUrl);
    expect(result).toBe('');
  });

  it('debería devolver una cadena vacía para una entrada vacía', () => {
    const result = getPathAfterPort('');
    expect(result).toBe('');
  });

  it('debería manejar URLs con solo un hash', () => {
    const url = 'http://example.com:8080/#hash';
    const result = getPathAfterPort(url);
    expect(result).toBe('/#hash');
  });

  it('debería manejar URLs con solo una cadena de consulta', () => {
    const url = 'http://example.com:8080/?query=123';
    const result = getPathAfterPort(url);
    expect(result).toBe('/?query=123');
  });

  it('debería manejar URLs sin un puerto', () => {
    const url = 'http://example.com/path?query=123#hash';
    const result = getPathAfterPort(url);
    expect(result).toBe('/path?query=123#hash');
  });

  it('debería manejar URLs con caracteres especiales en el path', () => {
    const url = 'http://example.com:8080/path%20with%20spaces?query=123#hash';
    const result = getPathAfterPort(url);
    expect(result).toBe('/path%20with%20spaces?query=123#hash');
  });
});
