export declare class CreateCalendarDto {
    month: string;
    period: string;
    range: string;
    incidentSubmission: string;
    process: string;
    policyGeneration: string;
    payment: string;
}
export declare class UpdateCalendarDto {
    month?: string;
    period?: string;
    range?: string;
    incidentSubmission?: string;
    process?: string;
    policyGeneration?: string;
    payment?: string;
}
export declare class CalendarResponseDto {
    id: number;
    month: string;
    period: string;
    range: string;
    incidentSubmission: Date;
    process: Date;
    policyGeneration: Date;
    payment: Date;
}
export declare class BulkCreateCalendarDto {
    calendars: CreateCalendarDto[];
}
