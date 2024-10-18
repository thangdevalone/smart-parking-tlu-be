import { Module } from '@nestjs/common';
import { EmailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('mail.mail_host'),
          port: configService.get('mail.mail_port'),
          secure: false,
          auth: {
            user: configService.get('mail.mail_app'),
            pass: configService.get('mail.mail_app_password')
          }
        },
        defaults: {
          from: '"SMART PARKING👻" <haidang02032003@gmail.com>'
        }
      }),
      inject: [ConfigService]
    })
  ],
  providers: [EmailService],
  exports: [EmailService]
})
export class MailModule {
}