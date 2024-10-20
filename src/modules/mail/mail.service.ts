import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { EmailDto } from "./mail.dto";

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {
  }

  sendMail(data: EmailDto) {
    this.mailerService.sendMail({
      to: data.to,
      subject: data.subject,
      text: data?.text,
      html: data?.html
    }).then(r => {
    });
  }

}