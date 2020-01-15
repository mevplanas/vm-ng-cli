export interface Process {
  env: Env;
}

interface Env {
  SENTRY_DSN?: string;
  MAPSDEV?: boolean;
}
