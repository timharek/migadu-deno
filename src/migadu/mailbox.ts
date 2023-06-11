import 'https://deno.land/std@0.191.0/dotenv/load.ts';
import { _fetch } from '../utils.ts';

export async function index(
  options: CLI.GlobalOptions,
): Promise<Migadu.Mailbox[] | string> {
  const result = await _fetch<{ mailboxes: Migadu.Mailbox[] }>({
    urlPath: `${options.domain}/mailboxes`,
    options,
  });

  if (options.json) {
    return JSON.stringify(result.mailboxes, null, 2);
  }

  return result.mailboxes.map((box) => `${box.name} <${box.address}>`).join(
    '\n',
  );
}

export async function show(
  options: CLI.GlobalOptions,
  localPart: string,
): Promise<Migadu.Mailbox | string> {
  if (!localPart) {
    throw new Error('localPart is not defined.');
  }
  const result = await _fetch<Migadu.Mailbox>({
    urlPath: `${options.domain}/mailboxes/${localPart}`,
    options,
  });

  if (options.json) {
    return JSON.stringify(result, null, 2);
  }

  return `${result.name} <${result.address}>`;
}

export async function create(
  options: CLI.GlobalOptions,
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
  const result = await _fetch<Migadu.Mailbox>({
    urlPath: `${options.domain}/mailboxes`,
    method: 'POST',
    options,
    body: JSON.stringify(body),
  });

  if (options.json) {
    return JSON.stringify(result, null, 2);
  }

  return `Created ${result.name} <${result.address}>`;
}

export async function remove(
  options: CLI.GlobalOptions,
  localPart: string,
): Promise<Migadu.Mailbox | string> {
  if (!localPart) {
    throw new Error('localPart is not defined.');
  }
  try {
    await _fetch<Migadu.Mailbox>({
      urlPath: `${options.domain}/mailboxes/${localPart}`,
      method: 'DELETE',
      options,
    });
    return `Deleted ${localPart}@${options.domain}`;
  } catch (error) {
    console.error(error);

    return 'Could not delete mailbox';
  }
}
