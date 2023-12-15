import { create, delete_, MailboxUpdateInput, show, update } from '../main.ts';
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

  public static async delete(
    domain: string,
    localPart: string,
  ): Promise<string> {
    // TODO: Check if the mailbox exists before trying to delete
    await delete_(domain, localPart);

    return `Deleted ${localPart}@${domain}`;
  }
}
