import { JwtService } from "@nestjs/jwt";
import { UserRepository } from "../_common/repository";
import { UserSessionDto } from "./dto/auth-response.dto";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
export declare class AuthService {
    private readonly userRepository;
    private readonly jwtService;
    constructor(userRepository: UserRepository, jwtService: JwtService);
    login(loginDto: LoginDto): Promise<{
        user: UserSessionDto;
        token: string;
    }>;
    register(registerDto: RegisterDto): Promise<UserSessionDto>;
    validateToken(token: string): Promise<UserSessionDto | null>;
    getProfile(userId: string): Promise<UserSessionDto>;
    decodeToken(token: string): Promise<any>;
}
