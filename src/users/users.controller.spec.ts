import { ConflictException, HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SignupDto } from './dtos/users-dtos';
import { Public } from './common/decorators';

// Import the required modules and dependencies for supertest
import * as request from 'supertest';
import { AtStrategy } from './strategies/accesstoken.st';
import { RtStrategy } from './strategies/refreshtoken.st';
import { UsersRepository } from './users.repository';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './users.entity';

// Mock the UsersService
class MockUsersService {
    usersRepository: MockUsersRepository;
    constructor(usersRepository: MockUsersRepository) {
      this.usersRepository = usersRepository;
    }
  }

  class MockUsersRepository { 
    constructor() {}
    signup = jest.fn().mockImplementation((signupDto, hashedPassword) => {
      if (signupDto.nickname === 'existingNickname') {
        throw new ConflictException('중복된 닉네임입니다.');
      }
  
      if (signupDto.email === 'existingEmail@example.com') {
        throw new ConflictException('중복된 이메일입니다.');
      }
  
      return Promise.resolve();
    });
  }


describe('UsersController (integration)', () => {
  let app: INestApplication;
  let usersService: UsersService;
  let usersRepository: UsersRepository;
  let usersController:UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
         useFactory: () => new MockUsersService(new MockUsersRepository()),
        },
        {
          provide: UsersRepository,
          useClass: MockUsersRepository,
        },
      ],
    }).compile();
    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
    app = module.createNestApplication();
    await app.init();
  });
  

  afterEach(async () => {
    await app.close();
  });

  it('should successfully sign up a user', async () => {
    // Mock the signup data
    const signupDto: SignupDto = {
        nickname: 'Tnickname',
        userName: 'TuserName',
        userEmail: 'TuserEmail',
        password: '12345'
    };

    // Mock the signup method of the usersService
    jest.spyOn(usersService, 'signup').mockResolvedValueOnce(undefined);

    const response = await request(app.getHttpServer())
      .post('/users/signup')
      .send(signupDto);

    expect(response.status).toBe(HttpStatus.CREATED);
    expect(response.body).toEqual({ statusCode: HttpStatus.CREATED });

    // Verify that the signup method was called with the correct data
    expect(usersService.signup).toHaveBeenCalledTimes(1);
    expect(usersService.signup).toHaveBeenCalledWith(signupDto);
  });

  // Add more test cases to cover different scenarios as needed
});
