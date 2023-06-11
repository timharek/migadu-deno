import 'https://deno.land/std@0.191.0/dotenv/load.ts';

function generateAuth(username: string, apiKey: string): string {
  return btoa(`${username}:${apiKey}`);
}

export async function index(
  { migaduUser, userToken, domain, json }: CLI.Options,
): Promise<Migadu.Mailbox[] | string> {
  const response = (await fetch(
    `https://api.migadu.com/v1/domains/${domain}/mailboxes`,
    {
      headers: {
        Authorization: `Basic ${generateAuth(migaduUser, userToken)}`,
      },
    },
  )).text();
  const result = JSON.parse(await response) as { mailboxes: Migadu.Mailbox[] };

  if (json) {
    return result.mailboxes;
  }

  return result.mailboxes.map((box) => `${box.name} <${box.address}>`).join(
    '\n',
  );
}
