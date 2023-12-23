import config from '../deno.json' assert { type: 'json' };
import 'https://deno.land/std@0.210.0/dotenv/load.ts';
import { Command } from '../deps.ts';
import { Mailbox } from './classes/mailbox.ts';

const app = new Command()
  .name(config.name)
  .version(config.version)
  .description('CLI for Migadu official API.')
  .meta('Author', config.author)
  .meta('Source', config.source)
  .example(
    'Example #1',
    'magic -v',
  )
  .action(function (): void {
    this.showHelp();
  })
  .globalEnv(
    'MIGADU_USER=<email:string>',
    'E-mail address for Migadu account (not mailbox email).',
    { prefix: 'MIGADU_', required: true },
  )
  .globalEnv(
    'MIGADU_USER_TOKEN=<token:string>',
    'API token for Migadu account.',
    { prefix: 'MIGADU_', required: true },
  )
  .globalEnv(
    'MIGADU_DOMAIN=<domain:string>',
    'A domain in the Migadu account.',
    { prefix: 'MIGADU_', required: true },
  )
  .globalOption(
    '--user <email:string>',
    'E-mail address for Migadu account (not mailbox email).',
  )
  .globalOption('--user-token <token:string>', 'API token for Migadu account.')
  .globalOption('--domain <domain:string>', 'A domain in the Migadu account.')
  .globalOption('--json', 'JSON output.');

type GlobalOptions = typeof app extends
  Command<void, void, void, [], infer Options extends Record<string, unknown>>
  ? Options
  : never;

const mailbox = new Command<GlobalOptions>()
  .description('Manage mailboxes.')
  // TODO: Why do I have to declare this again...
  .alias('mbox')
  .command('index', 'Get all mailboxes of a domain.')
  .alias('list')
  .action(async ({ domain, json }) => {
    const result = await Mailbox.list(domain);
    if (json) {
      console.log(JSON.stringify(result, null, 2));
      return;
    }
    console.log(
      result.map((mbox) => `${mbox.name} <${mbox.email}>`).join('\n'),
    );
  })
  .command('show <localPart:string>', 'Get single mailboxes for a domain.')
  .alias('get')
  .action(async ({ domain, json }, localPart) => {
    const mbox = await Mailbox.get(domain, localPart);
    if (json) {
      console.log(JSON.stringify(mbox, null, 2));
      return;
    }
    console.log(`${mbox.name} <${mbox.email}>`);
  })
  .command(
    'create <name:string> <localPart:string> [password:string]',
    'Create new mailbox for domain.',
  )
  .alias('add')
  .option(
    '-r, --recovery-email <inviteEmail:string>',
    'E-mail address to receieve invite.',
  )
  .action(
    async function (
      { domain, json, recoveryEmail },
      name,
      local_part,
      password,
    ): Promise<void> {
      let mbox;
      if (!password || !recoveryEmail) {
        this.showHelp();
      }
      if (password) {
        mbox = await Mailbox.create({
          domain,
          name,
          local_part,
          password_method: 'password',
          password,
        });
      }
      if (!password && recoveryEmail) {
        mbox = await Mailbox.create({
          domain,
          name,
          local_part,
          password_method: 'invitation',
          password_recovery_email: recoveryEmail,
        });
      }
      if (!mbox) {
        this.showHelp();
        Deno.exit(0);
      }
      if (json) {
        console.log(JSON.stringify(mbox, null, 2));
        return;
      }
      console.log(`Created ${mbox.name} <${mbox.email}>`);
    },
  )
  .command('delete <localPart:string>', 'Remove mailbox from domain.')
  .alias('remove')
  .alias('rm')
  .action((_options, _localPart) => {
    console.log('Not implemented yet.');
  })
  // TODO: Add optional prop for a body
  .command('update <localPart:string>', 'Update mailbox on domain.')
  .alias('up')
  .action((_options, _localPart) => {
    console.log('Not implemented yet.');
  });

if (import.meta.main) {
  await app
    .command('mailbox', mailbox)
    .parse(Deno.args);
}
