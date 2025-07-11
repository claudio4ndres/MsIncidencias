"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeriodsService = void 0;
const common_1 = require("@nestjs/common");
const calendar_repository_1 = require("../_common/repository/calendar.repository");
const movement_repository_1 = require("../_common/repository/movement.repository");
const moment_1 = __importDefault(require("moment"));
require("moment/locale/es-mx");
moment_1.default.locale("es-mx");
let PeriodsService = class PeriodsService {
    constructor(calendarRepository, movementRepository) {
        this.calendarRepository = calendarRepository;
        this.movementRepository = movementRepository;
    }
    async findAll() {
        const periods = await this.calendarRepository.findAll();
        const updatedPeriods = periods.map((calendar) => {
            let initialDate;
            const submissionYear = calendar.incidentSubmission.getFullYear();
            try {
                if (calendar.range.includes(" al ") || calendar.range.includes(" a ")) {
                    let firstDateMatch = calendar.range.match(/(\w+) (\d{1,2}) (\w+) a(?:l)?/);
                    if (firstDateMatch) {
                        const [, , day, month] = firstDateMatch;
                        initialDate = (0, moment_1.default)(`${day} ${month} ${submissionYear}`, "D MMMM YYYY");
                    }
                    else {
                        const partialMatch = calendar.range.match(/(\w+) (\d{1,2}) a(?:l)? \w+ \d{1,2} (\w+)/);
                        if (partialMatch) {
                            const [, , day, month] = partialMatch;
                            initialDate = (0, moment_1.default)(`${day} ${month} ${submissionYear}`, "D MMMM YYYY");
                        }
                        else {
                            initialDate = (0, moment_1.default)(calendar.incidentSubmission);
                        }
                    }
                }
                else if (calendar.range.includes("al ")) {
                    const dateMatch = calendar.range.match(/al \w+ (\d{1,2}) (\w+)/);
                    if (dateMatch) {
                        const [, day, month] = dateMatch;
                        initialDate = (0, moment_1.default)(`${day} ${month} ${submissionYear}`, "D MMMM YYYY");
                    }
                    else {
                        initialDate = (0, moment_1.default)(calendar.incidentSubmission);
                    }
                }
                else {
                    initialDate = (0, moment_1.default)(calendar.incidentSubmission);
                }
                if (initialDate.month() === 0 && calendar.range.includes("diciembre")) {
                    initialDate.subtract(1, "year");
                }
                if (initialDate.month() === 11 &&
                    (0, moment_1.default)(calendar.incidentSubmission).month() === 0) {
                    initialDate.year(submissionYear - 1);
                }
                const semana = initialDate.isValid() ? initialDate.isoWeek() : 1;
                const semanasEnAnio = (0, moment_1.default)(calendar.incidentSubmission).isoWeeksInYear();
                return {
                    period: calendar.period,
                    semana,
                    semanasEnAnio,
                };
            }
            catch (error) {
                console.error(`Error parsing range for calendar ${calendar.id}: ${calendar.range}`, error);
                return {
                    id: calendar.id,
                    month: calendar.month,
                    period: calendar.period,
                    range: calendar.range,
                    incidentSubmission: calendar.incidentSubmission,
                    process: calendar.process,
                    policyGeneration: calendar.policyGeneration,
                    payment: calendar.payment,
                    semana: 1,
                    semanasEnAnio: 52,
                };
            }
        });
        return updatedPeriods;
    }
    async findMovementsByPeriod(period) {
        const calendar = await this.calendarRepository.findByPeriod(period);
        if (!calendar) {
            throw new common_1.NotFoundException(`No se encontró el periodo: ${period}`);
        }
        const range = calendar.range;
        const fechas = range.match(/(\d{1,2})\s+([a-zA-Záéíóú]+)/g);
        if (!fechas || fechas.length === 0)
            throw new common_1.NotFoundException(`Range inválido: ${range}`);
        const refYear = calendar.incidentSubmission.getFullYear();
        const startDate = (0, moment_1.default)(`${fechas[0]}`, "D MMMM", "es-mx").year(refYear);
        const endDate = fechas.length > 1
            ? (0, moment_1.default)(`${fechas[1]}`, "D MMMM", "es-mx").year(refYear)
            : (0, moment_1.default)(`${fechas[0]}`, "D MMMM", "es-mx").year(refYear);
        if (endDate.isBefore(startDate)) {
            endDate.add(1, "year");
        }
        const movimientos = await this.movementRepository.findByDateRange(startDate.toDate(), endDate.toDate());
        return {
            periodo: period,
            desde: startDate.format("YYYY-MM-DD"),
            hasta: endDate.format("YYYY-MM-DD"),
            total: movimientos.length,
            movimientos,
        };
    }
};
PeriodsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [calendar_repository_1.CalendarRepository,
        movement_repository_1.MovementRepository])
], PeriodsService);
exports.PeriodsService = PeriodsService;
//# sourceMappingURL=periods.service.js.map