import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

// TODO: Need to validate domain
const Domain = z.string();
const Email = z.string().email();
const DateString = z.string(z.date());

const IdentitySchema = z.object({
  name: z.string(),
  address: Email,
  domain_name: Domain,
  local_part: z.string(),
  may_receive: z.boolean(),
  may_send: z.boolean(),
  may_access_imap: z.boolean(),
  may_access_managesieve: z.boolean(),
  may_access_pop3: z.boolean(),
});

const ForwardSchema = z.object({
  address: Email,
  blocked_at: DateString.nullable(),
  expires_on: DateString.nullable(),
  is_active: z.boolean(),
  confirmation_sent_at: DateString,
  confirmed_at: DateString,
  remove_upon_expiry: z.boolean(),
});

export const MailboxSchema = z.object({
  name: z.string(),
  address: Email,
  expires_on: DateString.nullable(),
  last_login_at: z.string().nullable(),
  password_recovery_email: Email.nullable(),
  storage_usage: z.number(),
  domain_name: Domain,
  expireable: z.boolean(),
  is_internal: z.boolean().nullish(),
  local_part: z.string(),
  remove_upon_expiry: z.boolean(),
  identities: z.array(IdentitySchema),
  autorespond_expires_on: DateString.nullable(),
  autorespond_active: z.boolean().nullable(),
  may_receive: z.boolean(),
  may_send: z.boolean(),
  autorespond_body: z.string(),
  autorespond_subject: z.string(),
  may_access_imap: z.boolean(),
  may_access_managesieve: z.boolean(),
  may_access_pop3: z.boolean(),
  spam_action: z.string(),
  delegations: z.array(Email),
  changed_at: z.string(),
  forwardings: z.array(ForwardSchema),
  recipient_denylist: z.array(z.string()),
  sender_allowlist: z.array(z.string()),
  sender_denylist: z.array(z.string()),
  spam_aggressiveness: z.enum(['default']),
});

export type MailboxSchema = z.infer<typeof MailboxSchema>;

const Invitation = z.discriminatedUnion('password_method', [
  z.object({
    password_method: z.literal('invitation'),
    password_recovery_email: Email,
  }),
  z.object({
    password_method: z.literal('passord'),
    password: z.string(),
  }),
]);
//{"name":"Mailbox Name", "local_part":"demo", "password_method":"invitation", "password_recovery_email":"invitee@somewhere.tld"}
const MailboxCreate = z.intersection(
  z.object({
    domain: z.string(),
    name: z.string(),
    local_part: z.string(),
  }),
  Invitation,
);

const Expires = z.discriminatedUnion('autorespond_active', [
  z.object({
    autorespond_active: z.literal(true),
    autorespond_expires_on: DateString,
  }),
  z.object({
    autorespond_active: z.literal(false),
  }),
]);
const MailboxUpdate = z.intersection(
  z.object({
    name: z.string().optional(),
    expires_on: DateString.nullable().optional(),
    password_recovery_email: Email.nullable().optional(),
    expireable: z.boolean().optional(),
    is_internal: z.boolean().nullish().optional(),
    remove_upon_expiry: z.boolean().optional(),
    may_receive: z.boolean().optional(),
    may_send: z.boolean().optional(),
    autorespond_body: z.string().optional(),
    autorespond_subject: z.string().optional(),
    may_access_imap: z.boolean().optional(),
    may_access_managesieve: z.boolean().optional(),
    may_access_pop3: z.boolean().optional(),
    spam_action: z.string().optional(),
    recipient_denylist: z.array(z.string()).optional(),
    sender_allowlist: z.array(z.string()).optional(),
    sender_denylist: z.array(z.string()).optional(),
    spam_aggressiveness: z.enum(['default']).optional(),
  }),
  Expires,
);

export type MailboxCreate = z.infer<typeof MailboxCreate>;
export type MailboxUpdate = z.infer<typeof MailboxUpdate>;
