import { show } from '../main.ts';
import { MailboxSchema } from '../schemas.ts';

export class Mailbox {
  private constructor(private data: MailboxSchema) {}

  public static async get(domain: string, localPart: string): Promise<Mailbox> {
    const mailbox = await show(domain, localPart);

    return new Mailbox(mailbox);
  }
}
