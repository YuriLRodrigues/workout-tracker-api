import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { MailEntity } from '@root/domain/enterprise/entities/mail.entity';

import { MailerRepository } from '../mailer.repository';

@Injectable()
export class NodeMailerRepository implements MailerRepository {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(mailer: MailEntity): Promise<void> {
    await this.mailerService.sendMail({
      from: process.env.NODE_MAILER_FROM,
      to: mailer.email,
      subject: mailer.subject,
      html: mailer.body,
    });
  }
}
