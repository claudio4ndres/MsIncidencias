import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { LoginResponseDto, LogoutResponseDto, RegisterResponseDto, UserSessionDto, DecodeTokenDto, DecodeTokenResponseDto } from "./dto/auth-response.dto";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto, response: Response): Promise<LoginResponseDto>;
    register(registerDto: RegisterDto): Promise<RegisterResponseDto>;
    logout(response: Response): Promise<LogoutResponseDto>;
    getProfile(request: Request): Promise<{
        user: UserSessionDto;
    }>;
    decodeToken(decodeTokenDto: DecodeTokenDto): Promise<DecodeTokenResponseDto>;
}
