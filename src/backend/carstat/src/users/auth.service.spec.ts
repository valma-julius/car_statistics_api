import { Test } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { rejects } from 'assert';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    // Create fake copy of UsersService
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 99999),
          email,
          password,
        } as User;

        users.push(user);

        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('Can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('Creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('test@gmail.com', 'password1234');

    expect(user.password).not.toEqual('password1234');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with an email that is already in use', async () => {
    await service.signup('test@gmail.com', 'test1234');
    await expect(service.signup('test@gmail.com', 'test1234')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws an error is user signs in with email that is not in the database', async () => {
    await expect(service.signin('test@gmail.com', 'test1234')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws if an invalid password is provided', async () => {
    await service.signup('test@gmail.com', '1234test');

    await expect(
      service.signin('test@gmail.com', 'totalydifferentpassword'),
    ).rejects.toThrow(BadRequestException);
  });

  it('returns a user if correct password is provided', async () => {
    await service.signup('test@gmail.com', 'otherpass');

    const user = await service.signin('test@gmail.com', 'otherpass');

    expect(user).toBeDefined();
  });
});
