import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';
import { index, show } from '../main.ts';
import { IdentitySchema } from '../schemas.ts';
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

  public get name(): string {
    return this.data.name;
  }
  public get email(): string {
    return this.data.address;
  }
}
