import { PaginatedResponseDto, PaginationQueryDto } from "../_common/dto/pagination.dto";
import { ChangePasswordDto, CreateUserDto, DeleteUserDto, UpdateUserDto, UserResponseDto } from "./dto/user.dto";
import { UsersService } from "./users.service";
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<UserResponseDto>>;
    getStats(): Promise<any>;
    findByEmail(email: string): Promise<UserResponseDto>;
    findByRole(role: string): Promise<UserResponseDto[]>;
    findByStatus(status: string): Promise<UserResponseDto[]>;
    findOne(id: string): Promise<UserResponseDto>;
    create(createUserDto: CreateUserDto): Promise<UserResponseDto>;
    update(updateUserDto: UpdateUserDto): Promise<UserResponseDto>;
    changePassword(changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    remove(deleteUserDto: DeleteUserDto): Promise<{
        message: string;
    }>;
}
