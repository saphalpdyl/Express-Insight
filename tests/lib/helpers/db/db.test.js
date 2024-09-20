import { expect, describe, it, beforeAll, afterAll } from "vitest";
import Database from "better-sqlite3";
import { generateRequiredTables, saveLogRequestToDB, saveLogResponseToDB } from "../../../../lib/helpers/index.js";
import { DATABASE_REQUEST_TABLE, DATABASE_RESPONSE_TABLE } from "../../../../lib/constants/index.js";

describe("Creating a database", () => {
  // Database connection to a in:memory test database
  let conn;

  const mockRequestInfo = {
    requestId: '12345',
    timestamp: new Date().toISOString(),
    method: 'GET',
    url: '/example',
    clientIp: '192.168.1.1',
    queryParams: { param1: 'value1', param2: 'value2' },
    requestBody: '{}',
    headers: {
      userAgent: 'Mozilla/5.0',
      contentType: 'application/json',
      referer: 'https://example.com',
      xForwardedFor: '192.168.1.1'
    }
  };

  const mockResponseInfo= {
    requestId: mockRequestInfo.requestId,
    responseId: 'mock-response-id',
    timestamp: new Date().toISOString(),
    url: '/api/example-endpoint',
    statusCode: 200,
    responseTime: Math.floor(Math.random() * 1000), // Random millisecond value
    responseHeaders: {
      'content-type': 'application/json',
      'server': 'mock-server',
      'x-powered-by': 'mock-framework',
    },
    headers: {
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      contentType: 'application/json',
      referer: 'https://example.com',
      xForwardedFor: '192.168.1.1',
    },
  };
  
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

  it("should create request log entry in db", () => {
    const result = saveLogRequestToDB(conn, mockRequestInfo);

    expect(result).toBeTypeOf("number");
  });

  it("should create response log entry in db", () => {
    const getLatestRequestRowId = conn.prepare(`SELECT request_id FROM ${DATABASE_REQUEST_TABLE}`).get().request_id;
    
    expect(getLatestRequestRowId).toBeTypeOf("string");

    const result = saveLogResponseToDB(conn, mockResponseInfo, getLatestRequestRowId);

    expect(result).toBeTypeOf("number");
  })

})