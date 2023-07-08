/**
 * A module that can access [Migadu's API](https://www.migadu.com/api/).
 *
 * ## Usage
 *
 * ### List all mailboxes
 *
 * ```typescript
 * import { index, Migadu } from "https://deno.land/x/migadu/mod.ts";
 *
 * const mailboxes = await index<Migadu.Mailbox>({
 *   domain: "example.org",
 *   migaduUser: "alice@example.org",
 *   userToken: "abcxyz",
 *   type: "mailbox",
 * });
 *
 * console.log(mailboxes);
 * ```
 *
 * @module
 */

export * from './src/migadu.ts';
export * from './src/types/migadu.d.ts';

export type { CLI, OptionProps } from './src/types/index.d.ts';
export type { Migadu } from './src/types/migadu.d.ts';
