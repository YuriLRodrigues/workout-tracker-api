import { MailEntity } from '@root/domain/enterprise/entities/mail.entity';

export abstract class MailerRepository {
  abstract sendMail(mailer: MailEntity): Promise<void>;
  // abstract sendManyMail(mailer: Array<Mail>): Promise<void>;
}
