import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import fs from "fs";
import path from "path";

const globalForDb = globalThis as unknown as {
  sqlite: Database.Database | undefined;
};

function resolveDbPath(): string {
  const envPath = process.env.DATABASE_PATH;
  if (envPath) {
    return path.isAbsolute(envPath)
      ? envPath
      : path.join(process.cwd(), envPath);
  }
  return path.join(process.cwd(), "data", "medevidence.db");
}

export function getSqlite(): Database.Database {
  if (globalForDb.sqlite) return globalForDb.sqlite;

  const dbPath = resolveDbPath();
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const sqlite = new Database(dbPath);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  globalForDb.sqlite = sqlite;
  return sqlite;
}

export function getDb() {
  return drizzle(getSqlite(), { schema });
}

export function dbReady(): boolean {
  const dbPath = resolveDbPath();
  return fs.existsSync(dbPath);
}

export { schema };
