import { ExecutionContext } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
declare const TokenGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class TokenGuard extends TokenGuard_base {
    private readonly jwtService;
    private readonly configService;
    constructor(jwtService: JwtService, configService: ConfigService);
    private lanzarExcepcionTokenInvalido;
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export {};
