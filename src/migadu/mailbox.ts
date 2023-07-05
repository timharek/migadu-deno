import 'https://deno.land/std@0.191.0/dotenv/load.ts';
import { _fetch } from '../utils.ts';
import { CLI, Migadu, OptionProps } from '../../mod.ts';

export async function index(options: OptionProps): Promise<Migadu.Mailbox[]> {
  const result = await _fetch<{ mailboxes: Migadu.Mailbox[] }>({
    urlPath: `${options.domain}/mailboxes`,
    options,
  });

  return result.mailboxes;
}

export async function show(
  options: OptionProps,
  localPart: string,
): Promise<Migadu.Mailbox> {
  if (!localPart) {
    throw new Error('localPart is not defined.');
  }
  const mailbox = await _fetch<Migadu.Mailbox>({
    urlPath: `${options.domain}/mailboxes/${localPart}`,
    options,
  });

  return mailbox;
}

export async function create(
  options: OptionProps,
  { name, local_part, password, password_recovery_email, is_internal }:
    CLI.MailboxCreate,
): Promise<Migadu.Mailbox> {
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
  const newMailbox = await _fetch<Migadu.Mailbox>({
    urlPath: `${options.domain}/mailboxes`,
    method: 'POST',
    options,
    body: JSON.stringify(body),
  });

  return newMailbox;
}

// TODO: Always returns deleted regardless of mbox exists or not.
export async function remove(
  options: OptionProps,
  localPart: string,
): Promise<string> {
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

export async function update(
  options: OptionProps,
  localPart: string,
  body: string,
): Promise<Migadu.Mailbox> {
  if (!localPart) {
    throw new Error('localPart is not defined.');
  }
  const result = await _fetch<Migadu.Mailbox>({
    urlPath: `${options.domain}/mailboxes/${localPart}`,
    method: 'PUT',
    options,
    body,
  });

  return result;
}
