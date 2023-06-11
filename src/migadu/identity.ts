import { _fetch } from '../utils.ts';

export async function index(
  options: CLI.GlobalOptions,
  localPart: string,
): Promise<Migadu.Identity[] | string> {
  const result = await _fetch<{ identities: Migadu.Identity[] }>({
    urlPath: `${options.domain}/mailboxes/${localPart}/identities`,
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
  localPart: string,
  id: string,
): Promise<Migadu.Identity | string> {
  if (!localPart) {
    throw new Error('localPart is not defined.');
  }
  const result = await _fetch<Migadu.Identity>({
    urlPath: `${options.domain}/mailboxes/${localPart}/identities/${id}`,
    options,
  });

  if (options.json) {
    return JSON.stringify(result, null, 2);
  }

  return `${result.name} <${result.address}>`;
}
