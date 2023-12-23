import { z } from '../deps.ts';

// TODO: Need to validate domain
const Domain = z.string();
const Email = z.string().email();
const DateString = z.string(z.date());

export const IdentitySchema = z.object({
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

export type IdentitySchema = z.infer<typeof IdentitySchema>;

const ForwardSchema = z.object({
  address: Email,
  blocked_at: DateString.nullable(),
  expires_on: DateString.nullable(),
  is_active: z.boolean(),
  confirmation_sent_at: DateString,
  confirmed_at: DateString,
  remove_upon_expiry: z.boolean(),
});

const SpamAction = z.enum(['folder', 'subject', 'none', 'drop']);
const SpamAgressiveness = z.enum([
  'default',
  'permissive',
  'more_permissive',
  'most_permissive',
  'stricter',
]);

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
  spam_action: SpamAction,
  delegations: z.array(Email),
  changed_at: z.string(),
  forwardings: z.array(ForwardSchema),
  recipient_denylist: z.array(z.string()),
  sender_allowlist: z.array(z.string()),
  sender_denylist: z.array(z.string()),
  spam_aggressiveness: SpamAgressiveness,
});

export type MailboxSchema = z.infer<typeof MailboxSchema>;

const Invitation = z.discriminatedUnion('password_method', [
  z.object({
    password_method: z.literal('invitation'),
    password_recovery_email: Email,
  }),
  z.object({
    password_method: z.literal('password'),
    password: z.string(),
  }),
]);

const MailboxCreate = z.intersection(
  z.object({
    domain: z.string(),
    name: z.string(),
    local_part: z.string(),
  }),
  Invitation,
);

const IdentityPassword = z.discriminatedUnion('password_use', [
  z.object({
    password_use: z.literal('none'),
  }),
  z.object({
    password_use: z.literal('mailbox'),
  }),
  z.object({
    password_use: z.literal('custom'),
    password: z.string(),
  }),
]);

const IdentityCreate = z.intersection(
  z.object({
    domain: z.string(),
    mailbox: z.string(),
    name: z.string(),
    local_part: z.string(),
  }),
  IdentityPassword,
);

const Create = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('identity'),
    IdentityCreate,
  }),
  z.object({
    type: z.literal('mailbox'),
    MailboxCreate,
  }),
]);

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
    spam_action: SpamAction.optional(),
    recipient_denylist: z.array(z.string()).optional(),
    sender_allowlist: z.array(z.string()).optional(),
    sender_denylist: z.array(z.string()).optional(),
    spam_aggressiveness: SpamAgressiveness.optional(),
  }),
  Expires,
);

export type MailboxCreate = z.infer<typeof MailboxCreate>;
export type MailboxUpdate = z.infer<typeof MailboxUpdate>;

export type IdentityCreate = z.infer<typeof IdentityCreate>;

export type Create = z.infer<typeof Create>;
