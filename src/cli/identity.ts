import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';
import { Command } from '../../deps.ts';
import { Identity } from '../classes/identity.ts';
import { GlobalOptions } from './cli.ts';

export const identity = new Command<GlobalOptions>()
  .description('Manage identities.')
  .alias('id')
  .command('index <mbox:string>', 'Get all mailboxes of a domain.')
  .alias('list')
  .action(async ({ domain, json }, mbox) => {
    const result = await Identity.list(domain, mbox);
    if (json) {
      console.log(JSON.stringify(result, null, 2));
      return;
    }
    console.log(
      result.map((id) => `${id.name} <${id.email}>`).join('\n'),
    );
  })
  .command(
    'show <mbox:string> <id:string>',
    'Get single ID for a mailbox.',
  )
  .alias('get')
  .action(async ({ domain, json }, mbox, id) => {
    const identity = await Identity.get(domain, mbox, id);
    if (json) {
      console.log(JSON.stringify(identity, null, 2));
      return;
    }
    console.log(`${identity.name} <${identity.email}>`);
  })
  .command(
    'create <mbox:string> <idName:string> <id:string>',
    'Create new ID for a mailbox.',
  )
  .alias('add')
  .option(
    '--method <method:string>',
    '`mailbox`, `none` or `custom`',
    { default: 'mailbox' },
  )
  .option(
    '--password <password:string>',
    'Password for the new identity.',
    { depends: ['method'] },
  )
  // password_use
  .action(
    async function (
      { domain, json, method, password },
      mbox,
      name,
      local_part,
    ): Promise<void> {
      const password_use = z.enum(['mailbox', 'none', 'custom']).parse(method);
      let identity;
      if (password_use === 'custom' && password) {
        identity = await Identity.create({
          domain,
          name,
          local_part,
          mailbox: mbox,
          password_use,
          password,
        });
      }

      if (password_use === 'none' || password_use === 'mailbox') {
        identity = await Identity.create({
          domain,
          name,
          local_part,
          mailbox: mbox,
          password_use,
        });
      }

      if (!identity) {
        this.showHelp();
        Deno.exit(0);
      }
      if (json) {
        console.log(JSON.stringify(identity, null, 2));
        return;
      }
      console.log(`Created identity: ${identity.name} <${identity.email}>`);
    },
  )
  .command(
    'delete <localPart:string> <id:string>',
    'Remove identity from mailbox.',
  )
  .alias('remove')
  .alias('rm')
  .action(async ({ domain }, localPart, id) => {
    // TODO: Add confirmation
    console.log(await Identity.delete(domain, localPart, id));
  })
  .command(
    'update <localPart:string> <id:string>',
    'Update identity for mailbox.',
  )
  .alias('up')
  .action((_options, _localPart, _id) => {
    console.log('Not implemented yet.');
  });
