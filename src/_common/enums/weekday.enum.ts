export enum WeekDay {
  DOMINGO = 0,
  LUNES = 1,
  MARTES = 2,
  MIERCOLES = 3,
  JUEVES = 4,
  VIERNES = 5,
  SABADO = 6
}

export const WEEKDAY_NAMES: Record<number, string> = {
  [WeekDay.DOMINGO]: 'domingo',
  [WeekDay.LUNES]: 'lunes',
  [WeekDay.MARTES]: 'martes',
  [WeekDay.MIERCOLES]: 'miércoles',
  [WeekDay.JUEVES]: 'jueves',
  [WeekDay.VIERNES]: 'viernes',
  [WeekDay.SABADO]: 'sábado'
};

export const WEEKDAYS_MONDAY_TO_SATURDAY = [
  WeekDay.LUNES,
  WeekDay.MARTES,
  WeekDay.MIERCOLES,
  WeekDay.JUEVES,
  WeekDay.VIERNES,
  WeekDay.SABADO
];
