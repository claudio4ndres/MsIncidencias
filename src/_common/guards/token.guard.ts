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
    /*
        {
        id: '32b69af9-4c1e-4961-aad4-782c94be17d6',
        name: 'Claudio Figueroa ',
        email: 'cfigueroa.RH@ejemplo.com',
        role: 1,
        iat: 1753106375,
        exp: 1753107275
      }
    */
      req.user = decodedToken;
      req.token = decodedToken;
      req.authorization = authorization;
      return true;
    } catch (e) {
      this.lanzarExcepcionTokenInvalido();
    }
  }
}
