// @deno-types='../mod.d.ts'

import { Command, Config } from '../deps.ts';
import * as Mailbox from './migadu/mailbox.ts';

const mailbox = new Command()
  .description(
    'Information retrieval and management of mailboxes of an existing domain hosted in your organization',
  )
  .command('index', 'Get all mailboxes of a domain.')
  .alias('list')
  .action(async (options: CLI.Options) => {
    console.log(await Mailbox.index(options));
  })
  .command('show <localPart:string>', 'Get single mailboxes for a domain.')
  .alias('get')
  .action(async (options: CLI.Options, localPart: string) => {
    console.log(await Mailbox.show(options, localPart));
  });

await new Command()
  .name(Config.name)
  .version(Config.version)
  .description(Config.description)
  .meta('Author', Config.author)
  .meta('Source', Config.source)
  .example(
    'Example #1',
    'magic -v',
  )
  .globalEnv(
    'MIGADU_USER=<email:string>',
    'E-mail address for Migadu account (not mailbox email).',
  )
  .globalEnv('USER_TOKEN=<token:string>', 'API token for Migadu account.')
  .globalEnv('DOMAIN=<value:string>', 'A domain in the Migadu account.')
  .globalOption(
    '--migaduUser [email:string]',
    'E-mail address for Migadu account (not mailbox email).',
  )
  .globalOption('--userToken [token:string]', 'API token for Migadu account.')
  .globalOption('--domain [domain:string]', 'A domain in the Migadu account.')
  .globalOption('-v, --verbose', 'A more verbose output.', {
    collect: true,
    value: (value: boolean, previous = 0) => (value ? previous + 1 : 0),
  })
  .globalOption('--json', 'JSON output.')
  .globalOption('-d, --debug', 'Debug output.')
  .command('mailbox', mailbox)
  .parse(Deno.args);
