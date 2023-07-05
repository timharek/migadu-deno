import { Checkbox, Input, Secret } from '../../deps.ts';
import { CLI } from '../../mod.ts';
import * as Mailbox from '../migadu/mailbox.ts';

export async function index(options: CLI.GlobalOptions): Promise<string> {
  const mailboxes = await Mailbox.index(options);

  if (options.json) {
    return JSON.stringify(mailboxes, null, 2);
  }

  return mailboxes.map((box) => `${box.name} <${box.address}>`).join('\n');
}

export async function show(
  options: CLI.GlobalOptions,
  localPart: string,
): Promise<string> {
  const mailbox = await Mailbox.show(options, localPart);

  if (options.json) {
    return JSON.stringify(mailbox, null, 2);
  }

  return `${mailbox.name} <${mailbox.address}>`;
}

export async function create(
  options: CLI.GlobalOptions,
  createOptions: CLI.MailboxCreate,
): Promise<string> {
  const newMailbox = await Mailbox.create(options, createOptions);

  if (options.json) {
    return JSON.stringify(newMailbox, null, 2);
  }

  return `Created ${newMailbox.name} <${newMailbox.address}>`;
}

export async function remove(
  options: CLI.GlobalOptions,
  localPart: string,
): Promise<string> {
  const result = await Mailbox.remove(options, localPart);

  return result;
}

export async function update(
  options: CLI.GlobalOptions,
  localPart: string,
  body: string,
): Promise<string> {
  const result = await Mailbox.update(options, localPart, body);

  if (options.json) {
    return JSON.stringify(result, null, 2);
  }

  return `Updated ${result.name} <${result.address}>`;
}

export async function updateInteractive(
  options: CLI.GlobalOptions,
  localPart: string,
): Promise<string> {
  const mailbox = await Mailbox.show(options, localPart);
  const updatedMailbox = new Map();
  const whatToUpdate = await Checkbox.prompt({
    message: 'What would you like to update?',
    options: [
      {
        name: 'Name',
        value: 'name',
      },
      {
        name: 'Internal access',
        value: 'is_internal',
      },
      {
        name: 'Password',
        value: 'password',
      },
    ],
  });

  if (whatToUpdate.includes('password')) {
    const password = await Secret.prompt({
      message: 'Enter new password',
    });
    const passwordConfirmed = await Secret.prompt({
      message: 'Repeat password',
    });
    if (password != passwordConfirmed) {
      throw new Error('Passwords does not match');
    }
    updatedMailbox.set('password', password);
    const index = whatToUpdate.indexOf('password');
    whatToUpdate.splice(index, 1);
  }

  for await (const item of whatToUpdate) {
    const newValue = await Input.prompt({
      message: `New value for ${item}? (previous ${mailbox[item]})`,
    });
    updatedMailbox.set(item, newValue);
  }

  const updatedMailboxString = JSON.stringify(
    updatedMailbox,
    (_key: unknown, value: Iterable<readonly unknown[]>) => {
      if (value instanceof Map) {
        return Object.fromEntries(value);
      }
      return value;
    },
    2,
  );

  return await update(options, localPart, updatedMailboxString);
}
