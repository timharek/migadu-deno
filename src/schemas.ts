import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

// TODO: Need to validate domain
const Domain = z.string();
const Email = z.string().email();

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
  blocked_at: z.string().datetime().nullable(),
  expires_on: z.string().datetime().nullable(),
  is_active: z.boolean(),
  confirmation_sent_at: z.string().datetime(),
  confirmed_at: z.string().datetime(),
  remove_upon_expiry: z.boolean(),
});

export const MailboxSchema = z.object({
  name: z.string(),
  address: Email,
  expires_on: z.string().datetime().nullable(),
  last_login_at: z.string().nullable(),
  password_recovery_email: Email.nullable(),
  storage_usage: z.number(),
  domain_name: Domain,
  expireable: z.boolean(),
  is_internal: z.boolean().nullish(),
  local_part: z.string(),
  remove_upon_expiry: z.boolean(),
  identities: z.array(IdentitySchema),
  autorespond_expires_on: z.string().datetime().nullable(),
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

export type MailboxCreate = z.infer<typeof MailboxCreate>;
