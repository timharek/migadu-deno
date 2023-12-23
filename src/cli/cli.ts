import config from '../../deno.json' assert { type: 'json' };
import 'https://deno.land/std@0.210.0/dotenv/load.ts';
import { Command } from '../../deps.ts';
import { mailbox } from './mailbox.ts';
import { identity } from './identity.ts';
import { CustomError } from '../classes/custom_error.ts';

const app = new Command()
  .name(config.name)
  .version(config.version)
  .description('CLI for Migadu official API.')
  .meta('Author', config.author)
  .meta('Source', config.source)
  .example(
    'List all mailboxes for domain',
    'migadu mbox list --domain example.org',
  )
  .example(
    'Get mailbox from domain',
    'migadu mbox get myName --domain example.org',
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

export type GlobalOptions = typeof app extends
  Command<void, void, void, [], infer Options extends Record<string, unknown>>
  ? Options
  : never;

if (import.meta.main) {
  try {
    await app
      .command('mailbox', mailbox)
      .command('identity', identity)
      .parse(Deno.args);
  } catch (error) {
    if (error instanceof CustomError) {
      console.error(error.toString());
      Deno.exit(1);
    }
  }
}
