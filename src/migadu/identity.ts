import { CLI, Migadu, OptionProps } from '../../mod.ts';
import { _fetch } from '../utils.ts';

export async function index(
  options: OptionProps,
  mailbox: string,
): Promise<Migadu.Identity[]> {
  const result = await _fetch<{ identities: Migadu.Identity[] }>({
    urlPath: `${options.domain}/mailboxes/${mailbox}/identities`,
    options,
  });

  return result.identities;
}

export async function show(
  options: OptionProps,
  mailbox: string,
  id: string,
): Promise<Migadu.Identity> {
  if (!mailbox) {
    throw new Error('localPart is not defined.');
  }
  const identity = await _fetch<Migadu.Identity>({
    urlPath: `${options.domain}/mailboxes/${mailbox}/identities/${id}`,
    options,
  });

  return identity;
}

export async function create(
  options: OptionProps,
  { mailbox, name, local_part, password }: CLI.IdentityCreate,
): Promise<Migadu.Mailbox> {
  if (!local_part) {
    throw new Error('localPart is not defined.');
  }
  const body: CLI.MailboxCreate = {
    name,
    local_part,
    ...(password && { password }),
  };
  const newIdentity = await _fetch<Migadu.Mailbox>({
    urlPath: `${options.domain}/mailboxes/${mailbox}/identities`,
    method: 'POST',
    options,
    body: JSON.stringify(body),
  });

  return newIdentity;
}

export async function remove(
  options: OptionProps,
  mailbox: string,
  id: string,
): Promise<string> {
  try {
    await _fetch<Migadu.Mailbox>({
      urlPath: `${options.domain}/mailboxes/${mailbox}/identities/${id}`,
      method: 'DELETE',
      options,
    });
    return `Deleted identity ${id} on mailbox ${mailbox}@${options.domain}`;
  } catch (error) {
    console.error(error);

    return 'Could not delete mailbox';
  }
}
