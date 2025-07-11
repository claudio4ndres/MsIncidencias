/**
 * Convierte un número de serie de Excel a una fecha JavaScript
 * Excel usa el 1 de enero de 1900 como día 1 (pero considera incorrectamente que 1900 es año bisiesto)
 * @param excelSerialDate Número de serie de Excel
 * @returns Fecha JavaScript
 */
export function excelSerialDateToDate(excelSerialDate: number): Date {
  // Excel epoch es 1 de enero de 1900, pero Excel considera que 1900 es año bisiesto (lo cual es incorrecto)
  // Por lo tanto, necesitamos ajustar por ese día extra
  const excelEpoch = new Date(1899, 11, 30); // 30 de diciembre de 1899 para compensar el error de Excel
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  
  return new Date(excelEpoch.getTime() + (excelSerialDate * millisecondsPerDay));
}

/**
 * Formatea una fecha como string ISO para la base de datos
 * @param excelSerialDate Número de serie de Excel
 * @returns String de fecha en formato ISO
 */
export function excelSerialDateToISOString(excelSerialDate: number): string {
  return excelSerialDateToDate(excelSerialDate).toISOString();
}

/**
 * Detecta si un valor es un número serial de Excel y lo convierte a fecha
 * @param value Valor a evaluar
 * @returns Fecha formateada o el valor original si no es un número serial
 */
export function processExcelValue(value: any): any {
  // Si es null o undefined, retornar tal como está
  if (value === null || value === undefined) {
    return value;
  }
  
  // Si es un número que parece ser un serial de Excel (entre 40000 y 65000 aproximadamente)
  // Los números pequeños como 1, 2, 3 no son fechas, sino cantidades o códigos
  if (typeof value === 'number' && value >= 40000 && value <= 65000) {
    try {
      const date = excelSerialDateToDate(value);
      // Verificar si la fecha es válida y está en un rango razonable (2009-2078)
      if (!isNaN(date.getTime()) && date.getFullYear() >= 2009 && date.getFullYear() <= 2078) {
        return date.toISOString().split('T')[0]; // Retornar solo la parte de fecha YYYY-MM-DD
      }
    } catch (error) {
      // Si hay error en la conversión, retornar el valor original
      return value;
    }
  }
  
  // Si es string que parece fecha, mantenerlo
  if (typeof value === 'string' && /\d{2}-\d{2}-\d{4}/.test(value)) {
    return value;
  }
  
  // Para cualquier otro caso, retornar el valor original
  return value;
}

/**
 * Convierte un número serial de Excel a formato DD-MM-YYYY
 * @param excelSerialDate Número de serie de Excel
 * @returns String de fecha en formato DD-MM-YYYY
 */
export function excelSerialDateToDateString(excelSerialDate: number): string {
  const date = excelSerialDateToDate(excelSerialDate);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}
