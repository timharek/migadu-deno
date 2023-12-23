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
  });
