import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm';
import { UserAccessEntity } from './user-access.entity';

@Entity('users')
@Index('idx_user_email', ['userEmail'])
@Index('idx_user_status', ['userStatus'])
@Index('idx_user_rol', ['userRol'])
export class UserEntity {
  @PrimaryColumn({ type: 'varchar', length: 191 })
  id: string;

  @Column({ 
    name: 'user_name',
    type: 'varchar', 
    length: 191, 
    nullable: false,
    comment: 'Nombre del usuario'
  })
  userName: string;

  @Column({ 
    name: 'user_email',
    type: 'varchar', 
    length: 191, 
    nullable: false,
    unique: true,
    comment: 'Email único del usuario'
  })
  userEmail: string;

  @Column({ 
    name: 'user_password',
    type: 'varchar', 
    length: 191, 
    nullable: false,
    comment: 'Contraseña encriptada del usuario'
  })
  userPassword: string;

  @Column({ 
    name: 'user_status',
    type: 'int', 
    nullable: false,
    comment: 'Estado del usuario (1 = activo, 0 = inactivo)'
  })
  userStatus: number;

  @Column({ 
    name: 'user_rol',
    type: 'int', 
    nullable: false,
    comment: 'Rol del usuario (1 = admin, 2 = usuario, 3 = tecnico)'
  })
  userRol: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    precision: 6,
    default: () => 'CURRENT_TIMESTAMP(6)',
    comment: 'Fecha y hora de creación del registro'
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    precision: 6,
    comment: 'Fecha y hora de última actualización del registro'
  })
  updatedAt: Date;

  // Relaciones
  @OneToMany(() => UserAccessEntity, userAccess => userAccess.user)
  userAccess: UserAccessEntity[];
}
