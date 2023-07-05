import * as Identity from '../migadu/identity.ts';

export async function index(
  options: CLI.GlobalOptions,
  mailbox: string,
): Promise<string> {
  const identities = await Identity.index(options, mailbox);
  if (options.json) {
    return JSON.stringify(identities, null, 2);
  }

  return identities.map((box) => `${box.name} <${box.address}>`).join(
    '\n',
  );
}

export async function show(
  options: CLI.GlobalOptions,
  mailbox: string,
  id: string,
): Promise<string> {
  const identity = await Identity.show(options, mailbox, id);

  if (options.json) {
    return JSON.stringify(identity, null, 2);
  }

  return `${identity.name} <${identity.address}>`;
}

export async function create(
  options: CLI.GlobalOptions,
  createOptions: CLI.IdentityCreate,
): Promise<string> {
  const result = await Identity.create(options, createOptions);

  if (options.json) {
    return JSON.stringify(result, null, 2);
  }

  return `Created identity ${result.name} <${result.address}> on mailbox ${createOptions.mailbox}@${options.domain}`;
}

export async function remove(
  options: CLI.GlobalOptions,
  mailbox: string,
  id: string,
): Promise<string> {
  const result = await Identity.remove(options, mailbox, id);

  return result;
}
