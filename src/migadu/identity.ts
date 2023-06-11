import { _fetch } from '../utils.ts';

export async function index(
  options: CLI.GlobalOptions,
  mailbox: string,
): Promise<Migadu.Identity[] | string> {
  const result = await _fetch<{ identities: Migadu.Identity[] }>({
    urlPath: `${options.domain}/mailboxes/${mailbox}/identities`,
    options,
  });

  if (options.json) {
    return JSON.stringify(result.identities, null, 2);
  }

  return result.identities.map((box) => `${box.name} <${box.address}>`).join(
    '\n',
  );
}

export async function show(
  options: CLI.GlobalOptions,
  mailbox: string,
  id: string,
): Promise<Migadu.Identity | string> {
  if (!mailbox) {
    throw new Error('localPart is not defined.');
  }
  const result = await _fetch<Migadu.Identity>({
    urlPath: `${options.domain}/mailboxes/${mailbox}/identities/${id}`,
    options,
  });

  if (options.json) {
    return JSON.stringify(result, null, 2);
  }

  return `${result.name} <${result.address}>`;
}

export async function create(
  options: CLI.GlobalOptions,
  { mailbox, name, local_part, password }: CLI.IdentityCreate,
): Promise<Migadu.Mailbox | string> {
  if (!local_part) {
    throw new Error('localPart is not defined.');
  }
  const body: CLI.MailboxCreate = {
    name,
    local_part,
    ...(password && { password }),
  };
  const result = await _fetch<Migadu.Mailbox>({
    urlPath: `${options.domain}/mailboxes/${mailbox}/identities`,
    method: 'POST',
    options,
    body: JSON.stringify(body),
  });

  if (options.json) {
    return JSON.stringify(result, null, 2);
  }

  return `Created identity ${result.name} <${result.address}> on mailbox ${mailbox}@${options.domain}`;
}
