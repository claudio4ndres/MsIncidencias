export enum IncidentCode {
  DESCANSO_TRABAJADO = '005',
  PRIMA_DOMINICAL = '008',
  DIA_DEVUELTO = '009',
  FALTA = '215'
}

export enum IncidentName {
  DESCANSO_TRABAJADO = 'descanso trabajado',
  PRIMA_DOMINICAL = 'prima dominical',
  DIA_DEVUELTO = 'día devuelto',
  FALTA = 'falta'
}

export const UNIQUE_INCIDENT_CODES = [
  IncidentCode.DESCANSO_TRABAJADO,
  IncidentCode.PRIMA_DOMINICAL,
  IncidentCode.DIA_DEVUELTO,
  IncidentCode.FALTA
];

export const INCIDENT_CODE_TO_NAME: Record<string, string> = {
  [IncidentCode.DESCANSO_TRABAJADO]: IncidentName.DESCANSO_TRABAJADO,
  [IncidentCode.PRIMA_DOMINICAL]: IncidentName.PRIMA_DOMINICAL,
  [IncidentCode.DIA_DEVUELTO]: IncidentName.DIA_DEVUELTO,
  [IncidentCode.FALTA]: IncidentName.FALTA
};
