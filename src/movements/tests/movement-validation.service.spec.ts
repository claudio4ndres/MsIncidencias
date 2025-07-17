import { Test, TestingModule } from "@nestjs/testing";
import { MovementValidationService } from "../services/movement-validation.service";
import { EmployeeEntity } from "../../_common/repository/entities/employee.entity";
import { WeekDay } from "../../_common/enums/weekday.enum";
import {
  CalendarRepository,
  HolidayRepository,
  MovementRepository,
} from "../../_common/repository";
import { ApprovalRepository } from "../../_common/repository/approval.repository";
import { ApprovalService } from "../services/approval.service";

describe("MovementValidationService", () => {
  let service: MovementValidationService;
  let mockEmployee: EmployeeEntity;
  let mockCalendarRepository: Partial<CalendarRepository>;
  let mockHolidayRepository: Partial<HolidayRepository>;
  let mockMovementRepository: Partial<MovementRepository>;
  let mockApprovalRepository: Partial<ApprovalRepository>;
  let mockApprovalService: Partial<ApprovalService>;

  beforeEach(async () => {
    mockCalendarRepository = {
      findByPeriod: jest.fn(),
    };

    mockHolidayRepository = {
      isHoliday: jest.fn(),
    };

    mockMovementRepository = {
      findOne: jest.fn(),
    };

    mockApprovalRepository = {};

    mockApprovalService = {
      hasApprovedDiaDevuelto: jest.fn(),
      createOrFindDiaDevueltoApproval: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovementValidationService,
        {
          provide: CalendarRepository,
          useValue: mockCalendarRepository,
        },
        {
          provide: HolidayRepository,
          useValue: mockHolidayRepository,
        },
        {
          provide: MovementRepository,
          useValue: mockMovementRepository,
        },
        {
          provide: ApprovalRepository,
          useValue: mockApprovalRepository,
        },
        {
          provide: ApprovalService,
          useValue: mockApprovalService,
        },
      ],
    }).compile();

    service = module.get<MovementValidationService>(MovementValidationService);

    mockEmployee = {
      id: "1",
      employeeCode: 123,
      officeId: "1",
      employeeName: "Test Employee",
      employeeType: "SIND",
      employeeStatus: 1,
      weeklyRestDay: WeekDay.LUNES,
      createdAt: new Date(),
      updatedAt: new Date(),
      office: {} as any,
      movements: [] as any,
    } as EmployeeEntity;
  });

  // Test for prima dominical with eligible employee type and correct Sunday date
  it("|", async () => {
    (mockCalendarRepository.findByPeriod as jest.Mock).mockResolvedValue({
      period: "202507",
      range: "lunes 15 julio al domingo 21 julio",
    });

    (mockMovementRepository.findOne as jest.Mock).mockResolvedValue(null);

    await expect(
      service.validateMovementBusinessRules(
        123,
        "008",
        "2025-07-21", // Cambiar a domingo (21 de julio de 2025 es domingo)
        "202507",
        mockEmployee
      )
    ).resolves.not.toThrow();
  });

  // Test for falta must not coincide with a holiday
  it("should fail falta validation when on a holiday", async () => {
    (mockCalendarRepository.findByPeriod as jest.Mock).mockResolvedValue({
      period: "202507",
      range: "lunes 15 julio al domingo 21 julio",
    });

    (mockHolidayRepository.isHoliday as jest.Mock).mockResolvedValue(true);

    await expect(
      service.validateMovementBusinessRules(
        123,
        "215",
        "2025-07-20",
        "202507",
        mockEmployee
      )
    ).rejects.toThrow("No se puede registrar una falta en un día festivo");
  });

  // Test for dia devuelto requiring approval if from previous periods
  it("should require approval for dia devuelto from previous periods", async () => {
    (mockCalendarRepository.findByPeriod as jest.Mock).mockResolvedValue({
      period: "202507",
      range: "lunes 15 julio al domingo 21 julio",
    });

    // Mock para que no encuentre duplicados primero (retorna null en primera llamada)
    // Luego no encuentra en el período actual, pero sí encuentra en períodos anteriores
    (mockMovementRepository.findOne as jest.Mock)
      .mockResolvedValueOnce(null) // Para validación de duplicados
      .mockResolvedValueOnce(null) // Para búsqueda en período actual (falta de misma fecha)
      .mockResolvedValueOnce({
        // Para búsqueda en períodos anteriores
        id: "2",
        employeeCode: 123,
        incidentCode: "215",
        incidenceDate: new Date("2025-07-16"), // Fecha anterior pero dentro del rango
      });

    (mockApprovalService.hasApprovedDiaDevuelto as jest.Mock).mockResolvedValue(
      false
    );
    (
      mockApprovalService.createOrFindDiaDevueltoApproval as jest.Mock
    ).mockResolvedValue({
      id: "approval-123",
      requiredApprovals: 1,
      currentApprovalCount: 0,
    });

    await expect(
      service.validateMovementBusinessRules(
        123,
        "009",
        "2025-07-16", // Usar fecha dentro del rango del período
        "202507",
        mockEmployee,
        "1",
        "user1"
      )
    ).rejects.toThrow("Se ha creado una solicitud de aprobación");
  });

  it("should pass prima dominical validation for non-domingo rest day", async () => {
    // Mock calendar period - usando un domingo que esté en el rango
    (mockCalendarRepository.findByPeriod as jest.Mock).mockResolvedValue({
      period: "202507",
      range: "martes 15 julio al domingo 21 julio",
    });

    // Mock no existing movement
    (mockMovementRepository.findOne as jest.Mock).mockResolvedValue(null);

    await expect(
      service.validateMovementBusinessRules(
        123,
        "008", // Prima Dominical
        "2025-07-21", // Domingo real del rango
        "202507",
        mockEmployee // weeklyRestDay = LUNES (1), no DOMINGO (0)
      )
    ).resolves.not.toThrow();
  });

  it("should fail prima dominical validation for domingo rest day", async () => {
    mockEmployee.weeklyRestDay = WeekDay.DOMINGO; // Cambiar a domingo

    // Mock calendar period
    (mockCalendarRepository.findByPeriod as jest.Mock).mockResolvedValue({
      period: "202507",
      range: "martes 15 julio al domingo 21 julio",
    });

    // Mock no existing movement
    (mockMovementRepository.findOne as jest.Mock).mockResolvedValue(null);

    await expect(
      service.validateMovementBusinessRules(
        123,
        "008",
        "2025-07-21", // Domingo real del rango
        "202507",
        mockEmployee // weeklyRestDay = DOMINGO (0)
      )
    ).rejects.toThrow(
      "Los empleados con prima dominical no pueden tener domingo como día de descanso semanal"
    );
  });

  it("should pass descanso trabajado validation when not on weekly rest day", async () => {
    // Mock calendar period
    (mockCalendarRepository.findByPeriod as jest.Mock).mockResolvedValue({
      period: "202507",
      range: "lunes 21 julio al domingo 27 julio",
    });

    // Mock no existing movement for faltas check
    (mockMovementRepository.findOne as jest.Mock).mockResolvedValue(null);

    // Mock is holiday
    (mockHolidayRepository.isHoliday as jest.Mock).mockResolvedValue(true);

    await expect(
      service.validateMovementBusinessRules(
        123,
        "005", // Descanso Trabajado
        "2025-07-23", // Miércoles (día 3 en moment.js), empleado descansa LUNES (1)
        "202507",
        mockEmployee
      )
    ).resolves.not.toThrow();
  });

  it("should fail descanso trabajado validation when on weekly rest day", async () => {
    // Mock calendar period
    (mockCalendarRepository.findByPeriod as jest.Mock).mockResolvedValue({
      period: "202507",
      range: "lunes 21 julio al domingo 27 julio",
    });

    // Mock no existing movement for faltas check
    (mockMovementRepository.findOne as jest.Mock).mockResolvedValue(null);

    // Mock is holiday
    (mockHolidayRepository.isHoliday as jest.Mock).mockResolvedValue(true);

    await expect(
      service.validateMovementBusinessRules(
        123,
        "005",
        "2025-07-22", // Lunes (día 1 en moment.js) que es su día de descanso semanal
        "202507",
        mockEmployee // weeklyRestDay = LUNES (1)
      )
    ).rejects.toThrow(
      "No se puede registrar descanso trabajado en lunes porque es el día de descanso semanal del empleado"
    );
  });

  // REGLA 1: Prima dominical solo para empleados SIND y personal CONF con puestos específicos
  it("should fail prima dominical validation for non-eligible employee type", async () => {
    mockEmployee.employeeType = "ADMIN"; // Tipo no elegible

    (mockCalendarRepository.findByPeriod as jest.Mock).mockResolvedValue({
      period: "202507",
      range: "lunes 15 julio al domingo 21 julio",
    });

    (mockMovementRepository.findOne as jest.Mock).mockResolvedValue(null);

    await expect(
      service.validateMovementBusinessRules(
        123,
        "008",
        "2025-07-21",
        "202507",
        mockEmployee
      )
    ).rejects.toThrow(
      "Prima dominical aplica solo para empleados SIND o personal CONF con puestos específicos"
    );
  });

  // REGLA 2: Fecha de prima dominical debe corresponder al domingo del período
  it("should fail prima dominical validation for non-sunday date", async () => {
    (mockCalendarRepository.findByPeriod as jest.Mock).mockResolvedValue({
      period: "202507",
      range: "lunes 15 julio al domingo 21 julio",
    });

    (mockMovementRepository.findOne as jest.Mock).mockResolvedValue(null);

    await expect(
      service.validateMovementBusinessRules(
        123,
        "008",
        "2025-07-20", // Sábado, no domingo
        "202507",
        mockEmployee
      )
    ).rejects.toThrow("La fecha de la prima dominical debe ser un domingo");
  });

  // REGLA 3: Fecha de falta debe coincidir con rango del período y no ser festivo
  it("should pass falta validation when not on holiday and within period", async () => {
    (mockCalendarRepository.findByPeriod as jest.Mock).mockResolvedValue({
      period: "202507",
      range: "lunes 15 julio al domingo 21 julio",
    });

    (mockHolidayRepository.isHoliday as jest.Mock).mockResolvedValue(false);
    (mockMovementRepository.findOne as jest.Mock).mockResolvedValue(null);

    await expect(
      service.validateMovementBusinessRules(
        123,
        "215",
        "2025-07-16", // Martes, no festivo
        "202507",
        mockEmployee
      )
    ).resolves.not.toThrow();
  });

  // REGLA 4: Fecha de descanso trabajado debe corresponder a día festivo
  it("should fail descanso trabajado validation when not on holiday", async () => {
    (mockCalendarRepository.findByPeriod as jest.Mock).mockResolvedValue({
      period: "202507",
      range: "lunes 21 julio al domingo 27 julio",
    });

    (mockMovementRepository.findOne as jest.Mock).mockResolvedValue(null);
    (mockHolidayRepository.isHoliday as jest.Mock).mockResolvedValue(false); // No es festivo

    await expect(
      service.validateMovementBusinessRules(
        123,
        "005",
        "2025-07-23",
        "202507",
        mockEmployee
      )
    ).rejects.toThrow(
      "La fecha del descanso trabajado debe corresponder a un día festivo"
    );
  });

  // REGLA 5: Día devuelto debe tener una falta anterior correspondiente
  it("should fail dia devuelto validation when no previous falta exists", async () => {
    (mockCalendarRepository.findByPeriod as jest.Mock).mockResolvedValue({
      period: "202507",
      range: "lunes 15 julio al domingo 21 julio",
    });

    (mockMovementRepository.findOne as jest.Mock)
      .mockResolvedValueOnce(null) // Para validación de duplicados
      .mockResolvedValueOnce(null) // Para búsqueda en período actual
      .mockResolvedValueOnce(null); // Para búsqueda en períodos anteriores - no encuentra falta

    await expect(
      service.validateMovementBusinessRules(
        123,
        "009",
        "2025-07-16",
        "202507",
        mockEmployee
      )
    ).rejects.toThrow(
      "No se puede registrar un día devuelto sin una falta anterior registrada que corresponda a la fecha"
    );
  });

  // REGLA 6: Validación adicional para prima dominical con empleado CONF y puesto específico
  it("should pass prima dominical validation for CONF employee with specific position", async () => {
    mockEmployee.employeeType = "CONF";
    mockEmployee.employeeName = "Juan Pérez - monitoristas play city";

    (mockCalendarRepository.findByPeriod as jest.Mock).mockResolvedValue({
      period: "202507",
      range: "lunes 15 julio al domingo 21 julio",
    });

    (mockMovementRepository.findOne as jest.Mock).mockResolvedValue(null);

    await expect(
      service.validateMovementBusinessRules(
        123,
        "008",
        "2025-07-21",
        "202507",
        mockEmployee
      )
    ).resolves.not.toThrow();
  });
});
