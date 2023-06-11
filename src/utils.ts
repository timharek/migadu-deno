const MIGADU_URL = 'https://api.migadu.com/v1/domains';

function generateAuth(username: string, apiKey: string): string {
  return btoa(`${username}:${apiKey}`);
}

interface Fetch {
  urlPath: string;
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  options: CLI.GlobalOptions;
  body?: string;
}
export async function _fetch<T>(
  { urlPath, method = 'GET', options: { migaduUser, userToken }, body }: Fetch,
): Promise<T> {
  const response = (await fetch(
    `${MIGADU_URL}/${urlPath}`,
    {
      method,
      headers: {
        Authorization: `Basic ${generateAuth(migaduUser, userToken)}`,
        Accept: ' application/json',
        'Content-Type': ' application/json',
      },
      ...(body && { body }),
    },
  )).text();
  const result = JSON.parse(await response) as T;

  return result;
}
