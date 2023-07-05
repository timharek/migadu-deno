# Migadu

A [Deno][deno] module that can access [Migadu's API][migadu].

There is also an CLI available. More documentaion is coming.

## Usage

### List all mailboxes

```typescript
import Mailbox from 'https://deno.land/x/migadu/mod.ts';

const mailboxes = await Mailbox.index({
  domain: 'example.org',
  migaduUser: 'alice@example.org',
  userToken: 'abcxyz',
});

console.log(mailboxes);
```

## CLI install

```sh
deno install -A https://git.sr.ht/~timharek/migadu-deno/tree/v0.1.0/item/src/cli.ts \
  -n migadu
```

[deno]: https://deno.land
[migadu]: https://www.migadu.com/api/
