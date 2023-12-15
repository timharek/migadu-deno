import 'https://deno.land/std@0.209.0/dotenv/load.ts';
import { MailboxCreate, MailboxSchema, MailboxUpdate } from './schemas.ts';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';
import { Mailbox } from './classes/mailbox.ts';
import { Input } from '../deps.ts';

const MIGADU_URL = 'https://api.migadu.com/v1/domains';
const username = Deno.env.get('MIGADU_USER');
const apiKey = Deno.env.get('USER_TOKEN');

const headers = new Headers({
  Authorization: `Basic ${btoa(`${username}:${apiKey}`)}`,
  Accept: 'application/json',
  'Content-Type': 'application/json',
});

async function index(domain: string): Promise<void> {
  if (!username || !apiKey) throw new Error('Missing envs');

  const url = new URL(`${MIGADU_URL}/${domain}/mailboxes`);
  const response = await (await fetch(url, {
    headers,
  })).json();

  const { mailboxes } = z.object({ mailboxes: z.array(MailboxSchema) }).parse(
    response,
  );

  console.log(mailboxes);
}

export async function show(
  domain: string,
  localPart: string,
): Promise<MailboxSchema> {
  if (!username || !apiKey) throw new Error('Missing envs');

  const url = new URL(`${MIGADU_URL}/${domain}/mailboxes/${localPart}`);
  const response = await (await fetch(url, {
    headers,
  })).json();

  return MailboxSchema.parse(response);
}

export async function create(
  input: MailboxCreate,
): Promise<MailboxSchema> {
  if (!username || !apiKey) throw new Error('Missing envs');
  const { domain, ...body } = input;

  const url = new URL(`${MIGADU_URL}/${domain}/mailboxes`);
  const response = await (await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })).json();

  return MailboxSchema.parse(response);
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

// const result = await Mailbox.update({
//   domain: 'harek.dev',
//   local_part: 'cli-new',
//   name: 'it works!',
//   autorespond_active: false,
// });
const result = await Mailbox.get('harek.dev', 'cli-new');

console.log(result);
