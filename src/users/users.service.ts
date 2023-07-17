import { Injectable } from '@nestjs/common';
import { LoginDto, SignupDto } from './dtos/users-dtos';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class UsersService {
    private userRepository: UsersRepository
    async signup(signupDto: SignupDto) {
        const hashedPassword = await bcrypt.hash(signupDto.password, 2)
        this.userRepository.signup(signupDto, hashedPassword)
    }


    login(loginDto: LoginDto) {
        const { email, password } = loginDto;
        this.userRepository.findEmail(email)
    }
    logout() { }
    refreshToken() { }
}
