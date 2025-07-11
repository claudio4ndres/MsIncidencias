export declare class CreateUserDto {
    user_name: string;
    user_email: string;
    user_password: string;
    user_status?: number;
    user_rol: number;
}
declare const UpdateUserDto_base: import("@nestjs/common").Type<Partial<Omit<CreateUserDto, "user_password">>>;
export declare class UpdateUserDto extends UpdateUserDto_base {
    id: string;
    user_password?: string;
}
export declare class UserResponseDto {
    id: string;
    company_id: string | null;
    office_id: string | null;
    user_name: string;
    user_email: string;
    user_status: number;
    user_rol: number;
    created_at: Date;
    updated_at: Date;
}
export declare class DeleteUserDto {
    id: string;
}
export declare class ChangePasswordDto {
    id: string;
    current_password: string;
    new_password: string;
}
export {};
