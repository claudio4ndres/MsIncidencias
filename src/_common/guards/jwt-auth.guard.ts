import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const authorization = req.header("authorization");
    console.log("request:", req);

    if (!authorization) {
      throw new UnauthorizedException("No autorizado - Token no encontrado");
    }

    try {
      const payload = this.jwtService.verify(authorization);
      //request["user"] = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException("No autorizado - Token inválido");
    }
  }

  private extractTokenFromRequest(request: Request): string | undefined {
    /*
    // Primero intentar obtener de las cookies
    const cookieToken = request.cookies?.token;
    if (cookieToken) {
      return cookieToken;
    }
   */
    // Si no hay en cookies, intentar obtener del header Authorization
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      return authHeader.substring(7);
    }

    return undefined;
  }
}
