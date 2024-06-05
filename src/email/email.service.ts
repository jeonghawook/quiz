import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Users } from 'src/users/entity/users.entity';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendVerificationCode(user: Users) {
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += Math.floor(Math.random() * 10);
    }

    await this.mailerService
      .sendMail({
        to: user.userEmail,
        subject: 'Hello',
        text: '인증번호',
        html: `<b>${code}</b>`,
      })
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(1111111111);
        console.log(error);
      });
    return true;
  }

  async requestVerificationEmail(user: Users) {
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += Math.floor(Math.random() * 10);
    }
    await this.mailerService
      .sendMail({
        to: 'saroball3@naver.com',
        subject: 'Hello',
        text: '인증번호',
        html: `<b>${code}</b>`,
      })
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
    return code;
  }
}
