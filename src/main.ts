import 'https://deno.land/std@0.209.0/dotenv/load.ts';
import { MailboxCreate, MailboxSchema, MailboxUpdate } from './schemas.ts';

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

  let url = new URL(`${MIGADU_URL}/${domain}/mailboxes`);
  if (localPart) {
    url = new URL(
      `${MIGADU_URL}/${domain}/mailboxes/${localPart}/identities/${id}`,
    );
  }
  return (await fetch(url, { headers })).json();
}

export async function create(input: MailboxCreate): Promise<unknown> {
  if (!username || !apiKey) throw new Error('Missing envs');
  const { domain, ...body } = input;

  const url = new URL(`${MIGADU_URL}/${domain}/mailboxes`);
  return (await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })).json();
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
): Promise<unknown> {
  if (!username || !apiKey) throw new Error('Missing envs');

  const url = new URL(`${MIGADU_URL}/${domain}/mailboxes/${localPart}`);
  return (await fetch(url, { method: 'DELETE', headers })).json();
}
