// @deno-types='../mod.d.ts'
import { Command, Config } from '../deps.ts';

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
  .env(
    'MIGADU_USER=<value:string>',
    'E-mail address for Migadu account (not mailbox email).',
  )
  .env('USER_TOKEN=<value:string>', 'API token for Migadu account.')
  .env('DOMAIN=<value:string>', 'A domain in the Migadu account.')
  .globalOption('-v, --verbose', 'A more verbose output.', {
    collect: true,
    value: (value: boolean, previous = 0) => (value ? previous + 1 : 0),
  })
  .action(
    (options: { verbose: number }) => {
      console.log(options);
    },
  )
  .parse(Deno.args);
