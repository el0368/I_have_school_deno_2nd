// ============================================================================
// Structured Logger
// ============================================================================
// Usage:
//   import { log } from "../lib/logger.ts";
//   log.info("Server started", { port: 8000 });
//   log.error("Failed to connect", { reason: e.message });
//
// Set LOG_LEVEL env var to: "debug" | "info" | "warn" | "error" (default: "info")

type LogLevel = "debug" | "info" | "warn" | "error";

const LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLevel: LogLevel = (Deno.env.get("LOG_LEVEL") as LogLevel) ??
  "info";

function shouldLog(level: LogLevel): boolean {
  return LEVELS[level] >= LEVELS[currentLevel];
}

function timestamp(): string {
  return new Date().toISOString();
}

function format(
  level: LogLevel,
  msg: string,
  data?: Record<string, unknown>,
): string {
  const base = `[${timestamp()}] [${level.toUpperCase()}] ${msg}`;
  return data ? `${base} ${JSON.stringify(data)}` : base;
}

export const log = {
  debug(msg: string, data?: Record<string, unknown>) {
    if (shouldLog("debug")) console.debug(format("debug", msg, data));
  },
  info(msg: string, data?: Record<string, unknown>) {
    if (shouldLog("info")) console.info(format("info", msg, data));
  },
  warn(msg: string, data?: Record<string, unknown>) {
    if (shouldLog("warn")) console.warn(format("warn", msg, data));
  },
  error(msg: string, data?: Record<string, unknown>) {
    if (shouldLog("error")) console.error(format("error", msg, data));
  },
};
