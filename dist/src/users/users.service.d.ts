import { PaginatedResponseDto, PaginationQueryDto } from "../_common/dto/pagination.dto";
import { UserRepository } from "../_common/repository";
import { ChangePasswordDto, CreateUserDto, UpdateUserDto, UserResponseDto } from "./dto/user.dto";
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    findAll(paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<UserResponseDto>>;
    findOne(id: string): Promise<UserResponseDto>;
    create(createUserDto: CreateUserDto): Promise<UserResponseDto>;
    update(updateUserDto: UpdateUserDto): Promise<UserResponseDto>;
    remove(id: string): Promise<{
        message: string;
    }>;
    changePassword(changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    findByEmail(email: string): Promise<UserResponseDto>;
    findByRole(role: number): Promise<UserResponseDto[]>;
    findByStatus(status: number): Promise<UserResponseDto[]>;
    getStats(): Promise<any>;
    private mapToResponseDto;
}
