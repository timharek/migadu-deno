declare namespace CLI {
  interface GlobalOptions {
    migaduUser: string;
    userToken: string;
    domain: string;
    json?: boolean;
    verbose?: number;
    debug?: boolean;
  }

  interface CreateOptions extends GlobalOptions {
    internal?: boolean;
    recovery?: string;
  }

  interface MailboxCreate {
    name: string;
    local_part: string;
    password?: string;
    password_method?: 'invitation';
    password_recovery_email?: string;
    is_internal?: boolean;
  }

  interface IdentityCreate {
    mailbox: string;
    name: string;
    local_part: string;
    password?: string;
  }
}
