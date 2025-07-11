import { ApiProperty } from '@nestjs/swagger';

export class UserSessionDto {
  @ApiProperty({
    description: 'ID del usuario',
    example: 'user-123'
  })
  id: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan Pérez'
  })
  name: string;

  @ApiProperty({
    description: 'Email del usuario',
    example: 'juan.perez@ejemplo.com'
  })
  email: string;

  @ApiProperty({
    description: 'Rol del usuario',
    example: 2
  })
  role: number;
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'Mensaje de respuesta',
    example: 'Login exitoso'
  })
  message: string;

  @ApiProperty({
    description: 'Datos de sesión del usuario',
    type: UserSessionDto
  })
  user: UserSessionDto;

  @ApiProperty({
    description: 'Acceso token JWT',
    type: 'string',
    example: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  })
  token: string;
}

export class RegisterResponseDto {
  @ApiProperty({
    description: 'Mensaje de respuesta',
    example: 'Usuario creado exitosamente'
  })
  message: string;

  @ApiProperty({
    description: 'Datos del usuario creado',
    type: UserSessionDto
  })
  user: UserSessionDto;
}

export class LogoutResponseDto {
  @ApiProperty({
    description: 'Mensaje de respuesta',
    example: 'Logout exitoso'
  })
  message: string;
}

export class DecodeTokenDto {
  @ApiProperty({
    description: 'Token JWT a decodificar',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  token: string;
}

export class DecodeTokenResponseDto {
  @ApiProperty({
    description: 'Indica si el token es válido',
    example: true
  })
  valid: boolean;

  @ApiProperty({
    description: 'Payload del token JWT',
    example: {
      id: 'user-123',
      name: 'Juan Pérez',
      email: 'juan.perez@ejemplo.com',
      role: 2,
      iat: 1641024000,
      exp: 1641110400
    }
  })
  payload: any;

  @ApiProperty({
    description: 'Información actualizada del usuario desde la base de datos',
    type: UserSessionDto,
    nullable: true
  })
  user: UserSessionDto | null;

  @ApiProperty({
    description: 'Información cruda del token decodificado',
    example: {
      id: 'user-123',
      name: 'Juan Pérez',
      email: 'juan.perez@ejemplo.com',
      role: 2,
      iat: 1641024000,
      exp: 1641110400
    }
  })
  decoded: any;

  @ApiProperty({
    description: 'Información adicional sobre el token',
    example: {
      issued_at: '2022-01-01T12:00:00.000Z',
      expires_at: '2022-01-02T12:00:00.000Z',
      is_expired: false
    }
  })
  tokenInfo: {
    issued_at: string | null;
    expires_at: string | null;
    is_expired: boolean | null;
  };
}
