import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { EmailRepository } from './email.repository';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(), // Ensure that ConfigModule is imported and configured
    MailerModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule to access environment variables
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          auth: {
            user: configService.get<string>('SMTP_USER'),
            pass: configService.get<string>('SMTP_PASS'),
          },
          secure: true,
          tls: {
            rejectUnauthorized: false,
          },
        },
        defaults: {
          from: '"flashcard" <flashcard@naver.com>',
        },
      }),
      inject: [ConfigService], // Inject ConfigService to access configuration
    }),
  ],
  controllers: [EmailController],
  providers: [EmailService, EmailRepository],
})
export class EmailModule {}
