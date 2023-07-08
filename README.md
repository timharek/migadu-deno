[![builds.sr.ht status](https://builds.sr.ht/~timharek/migadu-deno/commits/.build.yml.svg)](https://builds.sr.ht/~timharek/migadu-deno/commits/.build.yml?)
[![GitHub mirror](https://img.shields.io/badge/mirror-GitHub-black.svg?logo=github)](https://github.com/timharek/migadu-deno)

# Migadu

A [Deno][deno] module that can access [Migadu's API][migadu].

There is also an CLI available. More documentaion is coming.

## Usage

### List all mailboxes

```typescript
import { index, Migadu } from 'https://deno.land/x/migadu/mod.ts';

const mailboxes = await index<Migadu.Mailbox>({
  domain: 'example.org',
  migaduUser: 'alice@example.org',
  userToken: 'abcxyz',
  type: 'mailbox',
});

console.log(mailboxes);
```

## CLI install

```sh
deno install -A https://deno.land/x/migadu/src/cli.ts \
  -n migadu
```

[deno]: https://deno.land
[migadu]: https://www.migadu.com/api/
