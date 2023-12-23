import { z } from '../../deps.ts';
import { create, delete_, index, show } from '../main.ts';
import { IdentityCreate, IdentitySchema } from '../schemas.ts';
import { Migadu } from './migadu.ts';

export class Identity extends Migadu {
  private constructor(private data: IdentitySchema) {
    super();
  }

  public static async get(
    domain: string,
    localPart: string,
    id: string,
  ): Promise<Identity> {
    const response = await show(domain, localPart, id);
    const mailbox = IdentitySchema.parse(response);

    return new Identity(mailbox);
  }

  public static async list(
    domain: string,
    localPart: string,
  ): Promise<Identity[]> {
    const response = await index(domain, localPart);
    const { identities: identitesRaw } = z.object({
      identities: z.array(IdentitySchema),
    }).parse(
      response,
    );
    const ids = identitesRaw.map((id) => new Identity(id));

    return ids;
  }

  public static async create(input: IdentityCreate): Promise<Identity> {
    const response = await create({ type: 'identity', IdentityCreate: input });
    const createdId = IdentitySchema.parse(response);

    return new Identity(createdId);
  }

  public static async delete(
    domain: string,
    localPart: string,
    id: string,
  ): Promise<string> {
    // TODO: Check if the mailbox exists before trying to delete
    const response = await delete_(domain, localPart, id);
    IdentitySchema.parse(response);

    return `Deleted identity ${id}@${domain} from ${localPart}@${domain}`;
  }

  public get name(): string {
    return this.data.name;
  }
  public get email(): string {
    return this.data.address;
  }
}
