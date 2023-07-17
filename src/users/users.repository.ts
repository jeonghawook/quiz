import { Injectable } from "@nestjs/common";
import { LoginDto, SignupDto } from "./dtos/users-dtos";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Users } from "./users.entity";

Injectable()
export class UsersRepository {
    constructor(@InjectRepository(Users) private users: Repository<Users>) { }
    async findEmail(email: string): Promise<Users> {

        return await this.users.findOne({ where: { userEmail: email } });
    }

    async signup(signupDto: SignupDto, hashedPassword: string): Promise<void> {
        const user = this.users.create({
            userEmail: signupDto.userEmail,
            nickname: signupDto.nickname,
            userName: signupDto.userName,
            password: hashedPassword
        })
        await this.users.save(user);
    }
}