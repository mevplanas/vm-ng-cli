export interface Process {
  env: Env;
}

interface Env {
  LANG?: string;
  SENTRY_DSN?: string;
}
