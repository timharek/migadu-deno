/**
 * A module that can interact with [Migadu's API](https://www.migadu.com/api/).
 *
 * ## Usage
 * Remember to set the environment variables:
 *
 * - `MIGADU_USER`
 * - `MIGADU_USER_TOKEN`
 * - `MIGADU_DOMAIN`
 *
 * ### List all mailboxes
 *
 * @example
 * ```typescript
 * import { Mailbox } from './src/classes/mailbox.ts';
 *
 * const mailboxes = await Mailbox.list("example.org")
 *
 * console.log(mailboxes)
 * ```
 *
 * @module
 */

export { Mailbox } from './src/classes/mailbox.ts';
export { Identity } from './src/classes/identity.ts';
