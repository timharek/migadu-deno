import {
  create,
  delete_,
  index,
  MailboxUpdateInput,
  show,
  update,
} from '../main.ts';
import { MailboxCreate, MailboxSchema } from '../schemas.ts';
import { Migadu } from './migadu.ts';

export class Mailbox extends Migadu {
  private constructor(private data: MailboxSchema) {
    super();
  }

  public static async get(domain: string, localPart: string): Promise<Mailbox> {
    const mailbox = await show(domain, localPart);

    return new Mailbox(mailbox);
  }

  public static async list(domain: string): Promise<Mailbox[]> {
    const mailboxesRaw = await index(domain);
    const mailboxes = mailboxesRaw.map((mbox) => new Mailbox(mbox));

    return mailboxes;
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

  public get name(): string {
    return this.data.name;
  }
  public get email(): string {
    return this.data.address;
  }
}
