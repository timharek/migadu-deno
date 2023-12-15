import 'https://deno.land/std@0.209.0/dotenv/load.ts';
import { MailboxSchema } from './schemas.ts';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';
import { Mailbox } from './classes/mailbox.ts';

const MIGADU_URL = 'https://api.migadu.com/v1/domains';
const username = Deno.env.get('MIGADU_USER');
const apiKey = Deno.env.get('USER_TOKEN');

async function index(domain: string): Promise<void> {
  if (!username || !apiKey) throw new Error('Missing envs');

  const url = new URL(`${MIGADU_URL}/${domain}/mailboxes`);
  const response = await (await fetch(url, {
    headers: {
      Authorization: `Basic ${btoa(`${username}:${apiKey}`)}`,
      Accept: ' application/json',
      'Content-Type': ' application/json',
    },
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
    headers: {
      Authorization: `Basic ${btoa(`${username}:${apiKey}`)}`,
      Accept: ' application/json',
      'Content-Type': ' application/json',
    },
  })).json();

  return MailboxSchema.parse(response);
}

const result = await Mailbox.get('harek.dev', 'cli');

console.log(result);
