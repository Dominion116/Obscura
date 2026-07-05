/** Minimal structured console logger — enough to trace indexer progress and API requests. */

function line(level: string, scope: string, message: string, meta?: object): void {
  const timestamp = new Date().toISOString();
  const suffix = meta ? ` ${JSON.stringify(meta)}` : "";
  console.log(`${timestamp} [${level}] [${scope}] ${message}${suffix}`);
}

export function createLogger(scope: string) {
  return {
    info: (message: string, meta?: object) => line("INFO", scope, message, meta),
    warn: (message: string, meta?: object) => line("WARN", scope, message, meta),
    error: (message: string, meta?: object) => line("ERROR", scope, message, meta),
  };
}
