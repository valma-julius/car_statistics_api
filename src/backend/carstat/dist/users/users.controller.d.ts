import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
export declare class UsersController {
    private usersService;
    private authService;
    constructor(usersService: UsersService, authService: AuthService);
    whoami(user: User): User;
    signOut(session: any): void;
    createUser(body: CreateUserDto, session: any): Promise<User>;
    signin(body: CreateUserDto, session: any): Promise<User>;
    findUser(id: string): Promise<User>;
    findAllUsers(email: string): Promise<User[]>;
    updateUser(id: string, body: UpdateUserDto): Promise<User>;
    removeUser(id: string): Promise<User>;
}
