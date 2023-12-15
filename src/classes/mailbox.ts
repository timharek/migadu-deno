import { create, show } from '../main.ts';
import { MailboxCreate, MailboxSchema } from '../schemas.ts';

export class Mailbox {
  private constructor(private data: MailboxSchema) {}

  public static async get(domain: string, localPart: string): Promise<Mailbox> {
    const mailbox = await show(domain, localPart);

    return new Mailbox(mailbox);
  }

  public static async create(input: MailboxCreate): Promise<Mailbox> {
    const createdMailbox = await create(input);

    return new Mailbox(createdMailbox);
  }
}
