import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    // Check if email is not already in use
    const users = await this.usersService.find(email);

    if (users.length) {
      throw new BadRequestException('email is already in use');
    }
    // Hash the password

    // Generate the salt
    const salt = randomBytes(8).toString('hex');

    // Hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // Join the hashed salt and password
    const result = salt + '.' + hash.toString('hex');

    // Create and save a new user
    const user = await this.usersService.create(email, result);

    // Return the user
    return user;
  }

  async signin(email: string, password: string) {
    // Find the user
    const [user] = await this.usersService.find(email);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('bad password');
    } else {
      return user;
    }
  }
}
