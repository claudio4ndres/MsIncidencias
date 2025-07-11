"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.excelSerialDateToDateString = exports.processExcelValue = exports.excelSerialDateToISOString = exports.excelSerialDateToDate = void 0;
function excelSerialDateToDate(excelSerialDate) {
    const excelEpoch = new Date(1899, 11, 30);
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    return new Date(excelEpoch.getTime() + (excelSerialDate * millisecondsPerDay));
}
exports.excelSerialDateToDate = excelSerialDateToDate;
function excelSerialDateToISOString(excelSerialDate) {
    return excelSerialDateToDate(excelSerialDate).toISOString();
}
exports.excelSerialDateToISOString = excelSerialDateToISOString;
function processExcelValue(value) {
    if (value === null || value === undefined) {
        return value;
    }
    if (typeof value === 'number' && value >= 40000 && value <= 65000) {
        try {
            const date = excelSerialDateToDate(value);
            if (!isNaN(date.getTime()) && date.getFullYear() >= 2009 && date.getFullYear() <= 2078) {
                return date.toISOString().split('T')[0];
            }
        }
        catch (error) {
            return value;
        }
    }
    if (typeof value === 'string' && /\d{2}-\d{2}-\d{4}/.test(value)) {
        return value;
    }
    return value;
}
exports.processExcelValue = processExcelValue;
function excelSerialDateToDateString(excelSerialDate) {
    const date = excelSerialDateToDate(excelSerialDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}
exports.excelSerialDateToDateString = excelSerialDateToDateString;
//# sourceMappingURL=excel-date.helper.js.map