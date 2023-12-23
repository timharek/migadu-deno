import { Command } from '../../deps.ts';
import { Identity } from '../classes/identity.ts';
import { GlobalOptions } from './cli.ts';

export const identity = new Command<GlobalOptions>()
  .description('Manage identities.')
  .alias('id')
  .command('index <localPart:string>', 'Get all mailboxes of a domain.')
  .alias('list')
  .action(async ({ domain, json }, localPart) => {
    const result = await Identity.list(domain, localPart);
    if (json) {
      console.log(JSON.stringify(result, null, 2));
      return;
    }
    console.log(
      result.map((id) => `${id.name} <${id.email}>`).join('\n'),
    );
  })
  .command(
    'show <localPart:string> <id:string>',
    'Get single mailboxes for a domain.',
  )
  .alias('get')
  .action(async ({ domain, json }, localPart, id) => {
    const mbox = await Identity.get(domain, localPart, id);
    if (json) {
      console.log(JSON.stringify(mbox, null, 2));
      return;
    }
    console.log(`${mbox.name} <${mbox.email}>`);
  });
