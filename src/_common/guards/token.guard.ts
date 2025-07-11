import { ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";

import { IAccessToken } from "@interfaces";
import { ConfigService } from "@nestjs/config";
import { msArquetipoResponseCodes } from "../enums";
import { CustomException } from "../exceptions";

@Injectable()
export class TokenGuard extends AuthGuard("jwt") {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {
    super();
  }

  private lanzarExcepcionTokenInvalido = () => {
    throw new CustomException(
      msArquetipoResponseCodes.TokenInvalido,
      undefined,
      "Token Expirado o inválido"
    );
  };

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    const authorization = req.header("authorization");
    req.token = authorization;
    req.authorization = authorization;

    if (!authorization) {
      this.lanzarExcepcionTokenInvalido();
    }

    try {
      const token = authorization.split(" ")[1];
      const secret = await this.configService.get("JWT_SECRET");
      const decodedToken: IAccessToken = this.jwtService.verify(token, {
        secret,
      });
      console.log("decodedToken", decodedToken);

      req.token = decodedToken;
      req.authorization = authorization;
      return true;
    } catch (e) {
      this.lanzarExcepcionTokenInvalido();
    }
  }
}
