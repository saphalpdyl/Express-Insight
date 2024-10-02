import path from "path";
import { once } from "events";

import { vi, expect, it, describe, beforeEach, beforeAll } from "vitest";
import { fs, vol } from "memfs";

import { generateLogFileStream, getSystemMonthYear, checkIfFolderExists, createFolder } from "../../../lib/utils.js";
import { saveLogErrorEntry, saveLogRequestEntry, saveLogResponseEntry } from "../../../lib/helpers/index.js"

vi.mock("fs", () => ({
  default: fs,
  ...fs,
}));

describe('File logging tests', () => { 
  const mockCwd = "/app";
  let settings;

  let monthYearLogFolderPath;
  let monthYearString;
  let logFolderPath;

  let mockRequestInfo;
  let mockResponseInfo;
  let mockErrorInfo;
  
  beforeAll(async () => {
    vol.reset();
    vol.mkdirSync("/app/")
    // fs.mkdirSync("app/");

    vi.spyOn(process, 'cwd').mockReturnValue(mockCwd);
    vi.setSystemTime(new Date(2024,0,1,0,0,0,0));

    settings = (await import("../../../lib/defaultSettings.js")).DEFAULT_SETTINGS;
  });

  it('should return correct in-memory directory structure', () => {
    expect(process.cwd()).toBe(mockCwd);
  });

  it('should create appropiate log folder', () => {

    const basePath = settings.basePath;
    const logFolderName = settings.logFolderName;
    logFolderPath = path.join(basePath, logFolderName);

    monthYearString = getSystemMonthYear();
    monthYearLogFolderPath = path.join(logFolderPath, monthYearString);

    expect(monthYearString).toBe("January-2024");
    expect(monthYearLogFolderPath).toBe(path.join(mockCwd, 'log', 'January-2024'))
  });

  it('should create appropiate log folders ', () => {
    createFolder(logFolderPath);
    createFolder(monthYearLogFolderPath);

    expect(fs.existsSync(path.join(mockCwd, 'log'))).toBe(true);
    expect(fs.existsSync(monthYearLogFolderPath)).toBe(true);

    expect(createFolder(logFolderPath)).toBe(false);
  });
  
  it('should create a log request entry', async () => {
    mockRequestInfo = {
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
    
    const writeStream = generateLogFileStream(monthYearLogFolderPath, new Date());

    const writeFnSpy = vi.spyOn(writeStream, "write");
    
    saveLogRequestEntry(mockRequestInfo, writeStream);
    writeStream.close();

    // Apparently write stream are asynchronous
    // So wait for it to close before reading it
    await once(writeStream, "close");

    expect(writeFnSpy).toBeCalled();
    expect(vol.existsSync(path.join(monthYearLogFolderPath, `1_1_2024.log`))).toBe(true);

    const logContents = fs.readFileSync(path.join(monthYearLogFolderPath, `1_1_2024.log`)).toString("utf-8");
    expect(logContents).toBeTruthy();
    expect(logContents).toContain("<<<log.request>>>")
  });

  it("should create a log response entry", async () => {
    mockResponseInfo= {
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
    
    const writeStream = generateLogFileStream(monthYearLogFolderPath, new Date());

    const writeFnSpy = vi.spyOn(writeStream, "write");
    
    saveLogResponseEntry(mockResponseInfo, writeStream);
    writeStream.close();

    // Apparently write stream are asynchronous
    // So wait for it to close before reading it
    await once(writeStream, "close");

    expect(writeFnSpy).toBeCalled();
    expect(vol.existsSync(path.join(monthYearLogFolderPath, `1_1_2024.log`))).toBe(true);

    const logContents = fs.readFileSync(path.join(monthYearLogFolderPath, `1_1_2024.log`)).toString("utf-8");
    expect(logContents).toBeTruthy();
    
    expect(logContents).toContain("<<<log.response>>>");
  });

  it("should create a log error entry ", async () => {
    mockErrorInfo = {
      "requestId": mockRequestInfo.requestId,
      "errorType": "DatabaseError",
      "message": "Unable to connect to the database",
      "stackTrace": "Error: Unable to connect to the database\n    at Object.<anonymous> (/path/to/file.js:10:15)",
      "additionalInfo": "",
      "timestamp": "2024-09-24T12:34:56.789Z",
      "errorId": "3e6f8b38-90b0-4f08-bd6a-b0d25e88e9cf"
    };

    const writeStream = generateLogFileStream(monthYearLogFolderPath, new Date());

    const writeFnSpy = vi.spyOn(writeStream, "write");
    
    saveLogErrorEntry(mockErrorInfo, mockRequestInfo, writeStream);
    writeStream.close();

    await once(writeStream, "close");

    expect(writeFnSpy).toBeCalled();
    expect(vol.existsSync(path.join(monthYearLogFolderPath, `1_1_2024.log`))).toBe(true);

    const logContents = fs.readFileSync(path.join(monthYearLogFolderPath, `1_1_2024.log`)).toString("utf-8");
    expect(logContents).toContain("<<<log.error>>>");
  });
});