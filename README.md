[![builds.sr.ht status](https://builds.sr.ht/~timharek/migadu-deno/commits/.build.yml.svg)](https://builds.sr.ht/~timharek/migadu-deno/commits/.build.yml?)
[![GitHub mirror](https://img.shields.io/badge/mirror-GitHub-black.svg?logo=github)](https://github.com/timharek/migadu-deno)

# Migadu

A [Deno][deno] module that can access [Migadu's API][migadu].

There is also an CLI available. More documentaion is coming.

The following is not yet implemented:

- [Aliases](https://www.migadu.com/api/#aliases)
- [Rewrites](https://www.migadu.com/api/#rewrites) (not sure if I want to implement this)

## Usage

> [!WARNING]\
> Use at own risk. There are no confirmations when deleting mailboxes and identities

Remember to set environment variables:

- `MIGADU_DOMAIN`
- `MIGADU_USER`
- `MIGADU_USER_TOKEN`

### List all mailboxes

```typescript
import { Mailbox } from "https://deno.land/x/migadu/mod.ts";

const mailboxes = await Mailbox.list("example.org");
console.log(mailboxes);
```

## CLI

> [!NOTE]\
> You cannot update a mailbox or identity, yet. This is work in progress.

### Installation

```sh
deno install -A https://deno.land/x/migadu/src/cli/cli.ts \
  -n migadu
```

### Usage

```sh
# List all mailboxes for domain
migadu mbox list --domain example.org

# Get mailbox from domain
migadu mbox get myName --domain example.org

# See help for all available commands
migadu --help
```

[deno]: https://deno.land
[migadu]: https://www.migadu.com/api/
