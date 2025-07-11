import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UnauthorizedException,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { TokenGuard } from "@src/_common/guards";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import {
  LoginResponseDto,
  LogoutResponseDto,
  RegisterResponseDto,
  UserSessionDto,
  DecodeTokenDto,
  DecodeTokenResponseDto,
} from "./dto/auth-response.dto";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

@ApiTags("Autenticación")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Iniciar sesión" })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: "Login exitoso",
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Credenciales inválidas",
  })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response
  ): Promise<LoginResponseDto> {
    const { user, token } = await this.authService.login(loginDto);
    return {
      message: "Login exitoso",
      user,
      token,
    };
  }

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Registrar nuevo usuario" })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: "Usuario creado exitosamente",
    type: RegisterResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: "El usuario ya existe",
  })
  @ApiResponse({
    status: 500,
    description: "Error interno del servidor",
  })
  async register(
    @Body() registerDto: RegisterDto
  ): Promise<RegisterResponseDto> {
    const user = await this.authService.register(registerDto);

    return {
      message: "Usuario creado exitosamente",
      user,
    };
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Cerrar sesión" })
  @ApiResponse({
    status: 200,
    description: "Logout exitoso",
    type: LogoutResponseDto,
  })
  async logout(
    @Res({ passthrough: true }) response: Response
  ): Promise<LogoutResponseDto> {
    // Limpiar cookie
    response.cookie("token", "", {
      maxAge: 0,
      path: "/",
    });

    return {
      message: "Logout exitoso",
    };
  }

  @Get("me")
  @UseGuards(TokenGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Obtener perfil del usuario autenticado" })
  @ApiResponse({
    status: 200,
    description: "Perfil del usuario",
    type: UserSessionDto,
  })
  @ApiResponse({
    status: 401,
    description: "No autorizado",
  })
  async getProfile(@Req() request: Request): Promise<{ user: UserSessionDto }> {
    // Obtener token del header Authorization
    const authHeader = request.headers.authorization;
    let token = null;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7); // Remover 'Bearer ' del inicio
    } else if (request.cookies?.token) {
      // Fallback a cookie si no hay header Authorization
      token = request.cookies.token;
    }

    if (!token) {
      throw new UnauthorizedException("Token no encontrado");
    }

    // Validar y decodificar el token
    const user = await this.authService.validateToken(token);
    if (!user) {
      throw new UnauthorizedException("Token inválido o expirado");
    }

    return { user };
  }

  @Post("decode-token")
  @ApiOperation({ summary: "Decodificar token JWT y mostrar su contenido" })
  @ApiResponse({
    status: 200,
    description: "Token decodificado exitosamente",
    type: DecodeTokenResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: "Token inválido o expirado",
  })
  async decodeToken(@Body() decodeTokenDto: DecodeTokenDto): Promise<DecodeTokenResponseDto> {
    const { token } = decodeTokenDto;
    
    if (!token) {
      throw new UnauthorizedException("Token es requerido");
    }

    return this.authService.decodeToken(token);
  }
}
