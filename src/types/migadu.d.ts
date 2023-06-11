declare namespace Migadu {
  interface Mailbox {
    local_part: string;
    domain: string;
    address: string;
    name: string;
    is_internal: boolean;
    may_send: boolean;
    may_receive: boolean;
    may_access_imap: boolean;
    may_access_pop3: boolean;
    may_access_managesieve: boolean;
    password_method: string;
    password: string;
    password_recovery_email: string;
    spam_action: string;
    spam_aggressiveness: string;
    sender_denylist: string;
    sender_allowlist: string;
    recipient_denylist: string;
    recipient_allowlist: string;
    autorespond_active: boolean;
    autorespond_subject: string;
    autorespond_body: string;
    autorespond_expires_on: Date;
    footer_active: string;
    footer_plain_body: string;
    footer_html_body: string;
    identities: Identity[];
  }

  interface Identity {
    name: string;
    local_part: string;
    address: string;
    domain_name: string;
    footer_active: boolean;
    footer_html_body: string | null;
    footer_plain_body: string | null;
    may_access_imap: boolean;
    may_access_managesieve: boolean;
    may_access_pop3: boolean;
    may_receive: boolean;
    may_send: boolean;
  }
}
