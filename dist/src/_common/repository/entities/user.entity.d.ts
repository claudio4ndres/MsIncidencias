import { UserAccessEntity } from './user-access.entity';
export declare class UserEntity {
    id: string;
    userName: string;
    userEmail: string;
    userPassword: string;
    userStatus: number;
    userRol: number;
    createdAt: Date;
    updatedAt: Date;
    userAccess: UserAccessEntity[];
}
