import { Controller, Post, UseGuards } from '@nestjs/common';
import { EmailService } from './email.service';
import { AtGuard } from 'src/users/common/guards/at.guard';
import { GetUser } from 'src/users/common/decorators';
import { Users } from 'src/users/entity/users.entity';

@Controller('email')
export class EmailController {
  constructor(readonly emailService: EmailService) {}

  @UseGuards(AtGuard)
  @Post('/')
  async sendVerificationCode(@GetUser() user: Users) {
    return await this.emailService.sendVerificationCode(user);
  }
}
