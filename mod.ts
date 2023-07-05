/**
 * A module that can access [Migadu's API](https://www.migadu.com/api/).
 *
 * ## Usage
 *
 * ### List all mailboxes
 *
 * ```typescript
 * import Mailbox from "https://deno.land/x/migadu/mod.ts";
 *
 * const mailboxes = await Mailbox.index({
 *   domain: "example.org",
 *   migaduUser: "alice@example.org",
 *   userToken: "abcxyz",
 * });
 *
 * console.log(mailboxes);
 * ```
 *
 * @module
 */

export * as Mailbox from './src/migadu/mailbox.ts';
export * as Identity from './src/migadu/identity.ts';
export * from './src/types/migadu.d.ts';

export type { CLI, OptionProps } from './src/types/index.d.ts';
export type { Migadu } from './src/types/migadu.d.ts';
