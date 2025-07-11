export declare class PaginationQueryDto {
    page?: number;
    pageSize?: number;
    search?: string;
}
export declare class PaginatedResponseDto<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    constructor(data: T[], total: number, page: number, pageSize: number);
}
