import { create, MailboxUpdateInput, show, update } from '../main.ts';
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

  public static async update(input: MailboxUpdateInput): Promise<Mailbox> {
    const updatedMailbox = await update(input);

    return new Mailbox(updatedMailbox);
  }
}
