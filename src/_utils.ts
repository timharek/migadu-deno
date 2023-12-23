import 'https://deno.land/std@0.209.0/dotenv/load.ts';
import { Create, MailboxSchema, MailboxUpdate } from './schemas.ts';
import { CustomError } from './classes/custom_error.ts';

const MIGADU_URL = 'https://api.migadu.com/v1/domains';
const username = Deno.env.get('MIGADU_USER');
const apiKey = Deno.env.get('MIGADU_USER_TOKEN');

const headers = new Headers({
  Authorization: `Basic ${btoa(`${username}:${apiKey}`)}`,
  Accept: 'application/json',
  'Content-Type': 'application/json',
});

export async function index(
  domain: string,
  localPart?: string,
): Promise<unknown> {
  if (!username || !apiKey) throw new Error('Missing envs');

  let url = new URL(`${MIGADU_URL}/${domain}/mailboxes`);
  if (localPart) {
    url = new URL(`${MIGADU_URL}/${domain}/mailboxes/${localPart}/identities`);
  }

  return await (await fetch(url, { headers })).json();
}

export async function show(
  domain: string,
  localPart: string,
  id?: string,
): Promise<unknown> {
  if (!username || !apiKey) throw new Error('Missing envs');

  let url = new URL(`${MIGADU_URL}/${domain}/mailboxes/${localPart}`);
  if (id) {
    url = new URL(
      `${MIGADU_URL}/${domain}/mailboxes/${localPart}/identities/${id}`,
    );
  }
  const result = await fetch(url, { headers });
  if (result.status !== 200) {
    throw new CustomError(result.statusText);
  }
  return result.json();
}

export async function create(input: Create): Promise<unknown> {
  if (!username || !apiKey) throw new Error('Missing envs');
  if (input.type === 'identity') {
    const { domain, mailbox, ...body } = input.IdentityCreate;
    const url = new URL(
      `${MIGADU_URL}/${domain}/mailboxes/${mailbox}/identities`,
    );
    const result = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    if (result.status !== 200) {
      throw new CustomError(result.statusText);
    }
    return result.json();
  }
  const { domain, ...body } = input.MailboxCreate;

  const url = new URL(`${MIGADU_URL}/${domain}/mailboxes`);
  const result = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  if (result.status !== 200) {
    throw new CustomError(result.statusText);
  }
  return result.json();
}

export type MailboxUpdateInput = MailboxUpdate & {
  domain: string;
  local_part: string;
};
export async function update(
  input: MailboxUpdateInput,
): Promise<MailboxSchema> {
  if (!username || !apiKey) throw new Error('Missing envs');
  const { domain, local_part, ...body } = input;

  const url = new URL(`${MIGADU_URL}/${domain}/mailboxes/${local_part}`);
  const response = await (await fetch(url, {
    method: 'PUT',
    headers,
    body: JSON.stringify(body),
  })).json();

  return MailboxSchema.parse(response);
}

export async function delete_(
  domain: string,
  localPart: string,
  id?: string,
): Promise<unknown> {
  if (!username || !apiKey) throw new Error('Missing envs');

  let url = new URL(`${MIGADU_URL}/${domain}/mailboxes/${localPart}`);
  if (id) {
    url = new URL(
      `${MIGADU_URL}/${domain}/mailboxes/${localPart}/identities/${id}`,
    );
  }
  const result = await fetch(url, { method: 'DELETE', headers });
  if (result.status !== 200) {
    throw new CustomError(result.statusText);
  }
  return result.json();
}
