import { Command } from '../../deps.ts';
import { Mailbox } from '../classes/mailbox.ts';
import { GlobalOptions } from './cli.ts';

export const mailbox = new Command<GlobalOptions>()
  .description('Manage mailboxes.')
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
      if (!password && !recoveryEmail) {
        this.showHelp();
        Deno.exit(0);
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
  .action(async ({ domain }, localPart) => {
    console.log(await Mailbox.delete(domain, localPart));
  })
  // TODO: Add optional prop for a body
  .command('update <localPart:string>', 'Update mailbox on domain.')
  .alias('up')
  .action((_options, _localPart) => {
    console.log('Not implemented yet.');
  });
