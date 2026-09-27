import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import fs from "fs";
import path from "path";
import os from "os";

const globalForDb = globalThis as unknown as {
  sqlite: Database.Database | undefined;
};

function resolveBundledDbPath(): string {
  const envPath = process.env.DATABASE_PATH;
  if (envPath) {
    return path.isAbsolute(envPath)
      ? envPath
      : path.join(process.cwd(), envPath);
  }
  return path.join(process.cwd(), "data", "medevidence.db");
}

/** On Vercel the deployment FS is read-only; copy DB to /tmp for open. */
function resolveDbPath(): string {
  const bundled = resolveBundledDbPath();
  const onVercel = process.env.VERCEL === "1";
  if (!onVercel) return bundled;

  const tmpPath = path.join(os.tmpdir(), "medevidence.db");
  if (!fs.existsSync(tmpPath) && fs.existsSync(bundled)) {
    fs.copyFileSync(bundled, tmpPath);
  }
  return fs.existsSync(tmpPath) ? tmpPath : bundled;
}

export function getSqlite(): Database.Database {
  if (globalForDb.sqlite) return globalForDb.sqlite;

  const dbPath = resolveDbPath();
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const sqlite = new Database(dbPath);
  // Avoid WAL on ephemeral/serverless filesystems
  if (process.env.VERCEL === "1") {
    sqlite.pragma("journal_mode = DELETE");
  } else {
    sqlite.pragma("journal_mode = WAL");
  }
  sqlite.pragma("foreign_keys = ON");
  globalForDb.sqlite = sqlite;
  return sqlite;
}

export function getDb() {
  return drizzle(getSqlite(), { schema });
}

export function dbReady(): boolean {
  return fs.existsSync(resolveBundledDbPath()) || fs.existsSync(resolveDbPath());
}

export { schema };
