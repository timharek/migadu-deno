import { _fetch } from './utils.ts';
import { CLI } from './../mod.ts';

type OptionProps = {
  domain: string;
  migaduUser: string;
  userToken: string;
} & Type;

type Mailbox = {
  type: 'mailbox';
};

type Identity = {
  type: 'identity';
  mailbox: string;
};

type Alias = {
  type: 'alias';
};

type Type = Mailbox | Identity | Alias;

function getPath(options: OptionProps): string {
  if (options.type === 'identity') {
    return `${options.domain}/mailboxes/${options.mailbox}/identities`;
  }
  if (options.type === 'alias') {
    return `${options.domain}/aliases`;
  }
  return `${options.domain}/mailboxes`;
}

export async function index<T>(options: OptionProps): Promise<T[]> {
  type ReturnType = { mailboxes: T[] } | { identities: T[] } | { aliases: T[] };
  const urlPath = getPath(options);
  const result = await _fetch<ReturnType>({
    urlPath,
    options,
  });

  if ('mailboxes' in result) {
    return result.mailboxes;
  }
  if ('identities' in result) {
    return result.identities;
  }
  return result.aliases;
}

export async function show<T>(
  options: OptionProps,
  localPart: string,
): Promise<T> {
  if (!localPart) {
    throw new Error('localPart is not defined.');
  }
  const urlPath = getPath(options);
  const mailbox = await _fetch<T>({
    urlPath: `${urlPath}/${localPart}`,
    options,
  });

  return mailbox;
}

export async function create<T>(
  options: OptionProps,
  { name, local_part, password, password_recovery_email, is_internal }:
    CLI.MailboxCreate,
): Promise<T> {
  if (!local_part) {
    throw new Error('localPart is not defined.');
  }
  if (options.type === 'mailbox' && !password && !password_recovery_email) {
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
  const urlPath = getPath(options);
  const newMailbox = await _fetch<T>({
    urlPath,
    method: 'POST',
    options,
    body: JSON.stringify(body),
  });

  return newMailbox;
}

// TODO: Always returns deleted regardless of mbox exists or not.
export async function remove<T>(
  options: OptionProps,
  localPart: string,
): Promise<string> {
  if (!localPart) {
    throw new Error('localPart is not defined.');
  }
  const urlPath = getPath(options);
  try {
    await _fetch<T>({
      urlPath: `${urlPath}/${localPart}`,
      method: 'DELETE',
      options,
    });
    return `Deleted ${localPart}@${options.domain}`;
  } catch (error) {
    console.error(error);

    return 'Could not delete mailbox';
  }
}

export async function update<T>(
  options: OptionProps,
  localPart: string,
  body: string,
): Promise<T> {
  if (!localPart) {
    throw new Error('localPart is not defined.');
  }
  const urlPath = getPath(options);
  const result = await _fetch<T>({
    urlPath: `${urlPath}/${localPart}`,
    method: 'PUT',
    options,
    body,
  });

  return result;
}
