import config from '../deno.json' assert { type: 'json' };
import { Command } from '../deps.ts';
import * as Mailbox from './cli/mailbox.ts';
import * as Identity from './cli/identity.ts';
import { CLI } from '../mod.ts';

const mailbox = new Command()
  .description(
    'Manage mailboxes.',
  )
  .alias('mbox')
  .command('index', 'Get all mailboxes of a domain.')
  .alias('list')
  .action(async (options: CLI.GlobalOptions) => {
    console.log(await Mailbox.index(options));
  })
  .command('show <localPart:string>', 'Get single mailboxes for a domain.')
  .alias('get')
  .action(async (options: CLI.GlobalOptions, localPart: string) => {
    console.log(await Mailbox.show(options, localPart));
  })
  .command(
    'create <name:string> <localPart:string> [password:string]',
    'Create new mailbox for domain.',
  )
  .alias('add')
  .option(
    '-i, --internal',
    'Internal, private mailbox and restrict it to receive messages only via Migadu outgoing servers.',
  )
  .option(
    '-r, --recovery <inviteEmail:string>',
    'E-mail address to receieve invite.',
  )
  .action(
    async (
      options: CLI.CreateOptions,
      name: string,
      local_part: string,
      password?: string,
    ) => {
      console.log(
        await Mailbox.create(options, {
          name,
          local_part,
          password,
          is_internal: options.internal,
          password_recovery_email: options.recovery,
        }),
      );
    },
  )
  .command('delete <localPart:string>', 'Remove mailbox from domain.')
  .alias('remove')
  .alias('rm')
  .action(async (options: CLI.GlobalOptions, localPart: string) => {
    console.log(await Mailbox.remove(options, localPart));
  })
  // TODO: Add optional prop for a body
  .command('update <localPart:string>', 'Update mailbox on domain.')
  .alias('up')
  .action(async (options: CLI.GlobalOptions, localPart: string) => {
    console.log(await Mailbox.updateInteractive(options, localPart));
  });

const identity = new Command()
  .description(
    'Manage identities on a specific mailbox.',
  )
  .alias('id')
  .command(
    'index <localPart:string>',
    'Get all identities for mailbox on domain.',
  )
  .alias('list')
  .action(async (options: CLI.GlobalOptions, localPart: string) => {
    console.log(await Identity.index(options, localPart));
  })
  .command(
    'show <localPart:string> <id:string>',
    'Get single identity for mailbox on domain.',
  )
  .alias('get')
  .action(async (options: CLI.GlobalOptions, localPart: string, id: string) => {
    console.log(await Identity.show(options, localPart, id));
  })
  .command(
    'create <mailbox:string> <name:string> <localPart:string> [password:string]',
    'Create new identity for mailbox for domain.',
  )
  .alias('add')
  .action(
    async (
      options: CLI.GlobalOptions,
      mailbox: string,
      name: string,
      local_part: string,
      password?: string,
    ) => {
      console.log(
        await Identity.create(options, {
          mailbox,
          name,
          local_part,
          password,
        }),
      );
    },
  )
  .command(
    'delete <mailbox:string> <id:string>',
    'Remove identity for mailbox on domain.',
  )
  .alias('remove')
  .alias('rm')
  .action(async (options: CLI.GlobalOptions, mailbox: string, id: string) => {
    console.log(await Identity.remove(options, mailbox, id));
  })
  .command('update <mailbox:string> <id:string>', 'Update mailbox on domain.')
  .alias('up')
  .action(() => {
    console.log('Not implemented yet');
  });

await new Command()
  .name(config.name)
  .version(config.version)
  .description('CLI for Migadu official API.')
  .meta('Author', config.author)
  .meta('Source', config.source)
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
  .command('identity', identity)
  .parse(Deno.args);
