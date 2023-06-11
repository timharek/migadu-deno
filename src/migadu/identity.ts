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
