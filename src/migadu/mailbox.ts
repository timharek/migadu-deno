import 'https://deno.land/std@0.191.0/dotenv/load.ts';
import { Status } from '../../deps.ts';

const MIGADU_URL = 'https://api.migadu.com/v1/domains';

function generateAuth(username: string, apiKey: string): string {
  return btoa(`${username}:${apiKey}`);
}

export async function index(
  { migaduUser, userToken, domain, json }: CLI.GlobalOptions,
): Promise<Migadu.Mailbox[] | string> {
  const response = (await fetch(
    `${MIGADU_URL}/${domain}/mailboxes`,
    {
      headers: {
        Authorization: `Basic ${generateAuth(migaduUser, userToken)}`,
      },
    },
  )).text();
  const result = JSON.parse(await response) as { mailboxes: Migadu.Mailbox[] };

  if (json) {
    return JSON.stringify(result.mailboxes, null, 2);
  }

  return result.mailboxes.map((box) => `${box.name} <${box.address}>`).join(
    '\n',
  );
}

export async function show(
  { migaduUser, userToken, domain, json }: CLI.GlobalOptions,
  localPart: string,
): Promise<Migadu.Mailbox | string> {
  if (!localPart) {
    throw new Error('localPart is not defined.');
  }
  const response = (await fetch(
    `${MIGADU_URL}/${domain}/mailboxes/${localPart}`,
    {
      headers: {
        Authorization: `Basic ${generateAuth(migaduUser, userToken)}`,
      },
    },
  )).text();
  const result = JSON.parse(await response) as Migadu.Mailbox;

  if (json) {
    return JSON.stringify(result, null, 2);
  }

  return `${result.name} <${result.address}>`;
}

export async function create(
  { migaduUser, userToken, domain, json }: CLI.GlobalOptions,
  { name, local_part, password, password_recovery_email, is_internal }:
    CLI.MailboxCreate,
): Promise<Migadu.Mailbox | string> {
  if (!local_part) {
    throw new Error('localPart is not defined.');
  }
  if (!password && !password_recovery_email) {
    throw new Error('No password option is not defined.');
  }
  const body: CLI.MailboxCreate = {
    name,
    local_part,
    ...(!password && password_recovery_email &&
      { password_method: 'invitation', password_recovery_email }),
    ...(!password_recovery_email && password && { password }),
    ...(is_internal && { is_internal }),
  };

  try {
    const response = (await fetch(
      `${MIGADU_URL}/${domain}/mailboxes`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${generateAuth(migaduUser, userToken)}`,
          Accept: ' application/json',
          'Content-Type': ' application/json',
        },
        body: JSON.stringify(body),
      },
    )).text();

    const result = JSON.parse(await response) as Migadu.Mailbox;

    if (json) {
      return JSON.stringify(result, null, 2);
    }

    return `Created ${result.name} <${result.address}>`;
  } catch (error) {
    console.error(error);

    return 'Could not create new mailbox';
  }
}

export async function remove(
  { migaduUser, userToken, domain }: CLI.GlobalOptions,
  localPart: string,
): Promise<Migadu.Mailbox | string> {
  if (!localPart) {
    throw new Error('localPart is not defined.');
  }
  try {
    const response = await fetch(
      `${MIGADU_URL}/${domain}/mailboxes/${localPart}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Basic ${generateAuth(migaduUser, userToken)}`,
          Accept: ' application/json',
          'Content-Type': ' application/json',
        },
      },
    );

    if (response.status != Status.OK) {
      return 'Could not delete mailbox';
    }
    return `Deleted ${localPart}@${domain}`;
  } catch (error) {
    console.error(error);

    return 'Could not delete mailbox';
  }
}
