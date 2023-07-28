import { ConflictException, HttpStatus, INestApplication, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { LoginDto, SignupDto, Tokens } from './dtos/users-dtos';
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

  signup(signupDto: SignupDto, hashedPassword: string): Promise<void> {
    if (signupDto.userEmail === 'existingUserEmail') throw new ConflictException('userEmail 중복')
    if (signupDto.nickname === 'existingNickname') throw new ConflictException('nickname 중복')
    return
  }

  login = jest.fn().mockImplementation((loginDto: LoginDto) => {
    if (loginDto.userEmail !== 'userEmail') throw new NotFoundException('존재하지 않는 이메일입니다.');
    if (loginDto.password !== '12345') throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    Promise.resolve({ refreshToken: 'refreshToken', accessToken: 'accessToken' })
  })

  // async login(loginDto: LoginDto): Promise<Tokens> {
  //   if (loginDto.userEmail !== 'userEmail') throw new NotFoundException('존재하지 않는 이메일입니다.');
  //   if (loginDto.password !== '12345') throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
  //   const tokens = await this.usersRepository.login(loginDto);

  //   return tokens
  // }
}

class MockUsersRepository {
  constructor() { }

}



describe('UsersController (integration)', () => {
  let app: INestApplication;
  let usersService: UsersService;
  let usersRepository: UsersRepository;
  let usersController: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useClass: MockUsersService,
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
    jest.spyOn(usersService, 'signup')

    const response = await request(app.getHttpServer())
      .post('/users/signup')
      .send(signupDto);

    //console.log(response.body)

    expect(response.status).toBe(HttpStatus.CREATED);
    expect(response.body).toEqual({ statusCode: HttpStatus.CREATED });

    // Verify that the signup method was called with the correct data
    expect(usersService.signup).toHaveBeenCalledTimes(1);
    expect(usersService.signup).toHaveBeenCalledWith(signupDto);
  });

  it('1. userEmail duplication error', async () => {
    const signupDto: SignupDto = {
      nickname: 'Tnickname',
      userName: 'TuserName',
      userEmail: 'existingUserEmail',
      password: '12345'
    };

    const response = await request(app.getHttpServer())
      .post('/users/signup')
      .send(signupDto);

    expect(response.status).toBe(HttpStatus.CONFLICT);
    expect(response.body.message).toBe('userEmail 중복');
  });

  it('1-2. nickname duplication error', async () => {
    const signupDto: SignupDto = {
      nickname: 'existingNickname',
      userName: 'TuserName',
      userEmail: 'TuserEmail',
      password: '12345'
    };

    const response = await request(app.getHttpServer())
      .post('/users/signup')
      .send(signupDto);

    expect(response.status).toBe(HttpStatus.CONFLICT);
    expect(response.body.message).toBe('nickname 중복');
  });



  it('2. login success', async () => {

    jest.spyOn(usersService, 'login')

    const loginDto: LoginDto = {
      userEmail: 'userEmail',
      password: '12345'
    };
    const tokens: Tokens = {
      refreshToken: 'refreshToken',
      accessToken: 'accessToken'
    }

    const response = await request(app.getHttpServer())
      .post('/users/login')
      .send(loginDto);


    // expect(response.status).toBe(HttpStatus.CREATED);
    // expect(response.body).toEqual(tokens);

    // expect(usersService.login).toHaveBeenCalledTimes(1);
    // expect(usersService.login).toHaveBeenCalledWith(loginDto);
  });
});
