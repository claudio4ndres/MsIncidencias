export declare class UserSessionDto {
    id: string;
    name: string;
    email: string;
    role: number;
}
export declare class LoginResponseDto {
    message: string;
    user: UserSessionDto;
    token: string;
}
export declare class RegisterResponseDto {
    message: string;
    user: UserSessionDto;
}
export declare class LogoutResponseDto {
    message: string;
}
export declare class DecodeTokenDto {
    token: string;
}
export declare class DecodeTokenResponseDto {
    valid: boolean;
    payload: any;
    user: UserSessionDto | null;
    decoded: any;
    tokenInfo: {
        issued_at: string | null;
        expires_at: string | null;
        is_expired: boolean | null;
    };
}
