import { expect, describe, it, beforeAll, afterAll } from "vitest";
import Database from "better-sqlite3";
import { generateRequiredTables } from "../../../../lib/helpers/index.js";
import { DATABASE_REQUEST_TABLE, DATABASE_RESPONSE_TABLE } from "../../../../lib/constants/index.js";

describe("Creating a database", () => {
  // Database connection to a in:memory test database
  let conn;
  
  beforeAll(() => {
    conn = new Database(":memory:");
    conn.pragma('journal_mode = WAL');
  });

  afterAll(() => {
    if (conn) conn.close();
  });

  it("should create required tables in the db", () => {
    const wasCompleted = generateRequiredTables(conn);
    
    expect(wasCompleted).toBeTruthy();

    const responseTablesCheckStatement = conn.prepare(`
        SELECT name FROM sqlite_master WHERE type='table' AND name='${DATABASE_RESPONSE_TABLE}';
    `);
    const requestTablesCheckStatement = conn.prepare(`
        SELECT name FROM sqlite_master WHERE type='table' AND name='${DATABASE_REQUEST_TABLE}';
    `);
    
    expect(requestTablesCheckStatement.get().name).toBe(DATABASE_REQUEST_TABLE);
    expect(responseTablesCheckStatement.get().name).toBe(DATABASE_RESPONSE_TABLE);
  });

})