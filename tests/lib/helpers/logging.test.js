import path from "path";
import { once } from "events";

import { vi, expect, it, describe, beforeEach, beforeAll } from "vitest";
import { fs, vol } from "memfs";

import { generateLogFileStream, getSystemMonthYear, checkIfFolderExists, createFolder } from "../../../lib/utils.js";
import { saveLogRequestEntry, saveLogResponseEntry } from "../../../lib/helpers/index.js"

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
  
  beforeAll(async () => {
    vol.reset();
    vol.mkdirSync("/app/")
    // fs.mkdirSync("app/");

    vi.spyOn(process, 'cwd').mockReturnValue(mockCwd);
    vi.setSystemTime(new Date(2024,0,1));

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
    
    expect(logContents).toMatchInlineSnapshot(`
      "
      <<<log.request>>>
      [2024-01-01T06:00:00.000Z] 12345 GET /example
      type=request
      clientIp=192.168.1.1
      userAgent="Mozilla/5.0"
      contentType="application/json"
      referer="https://example.com"
      xForwardedFor="192.168.1.1"
    queryParams={"param1":"value1","param2":"value2"}
      requestBody={}
      "
    `);
  });

  it("should create a log response entry", async () => {
    const mockResponseInfo= {
      requestId: '12345',
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
    
    saveLogRequestEntry(mockResponseInfo, writeStream);
    writeStream.close();

    // Apparently write stream are asynchronous
    // So wait for it to close before reading it
    await once(writeStream, "close");

    expect(writeFnSpy).toBeCalled();
    expect(vol.existsSync(path.join(monthYearLogFolderPath, `1_1_2024.log`))).toBe(true);

    const logContents = fs.readFileSync(path.join(monthYearLogFolderPath, `1_1_2024.log`)).toString("utf-8");
    expect(logContents).toBeTruthy();
    
    expect(logContents).toMatchInlineSnapshot(`
      "
      <<<log.request>>>
      [2024-01-01T06:00:00.000Z] 12345 GET /example
      type=request
      clientIp=192.168.1.1
      userAgent="Mozilla/5.0"
      contentType="application/json"
      referer="https://example.com"
      xForwardedFor="192.168.1.1"
      queryParams={"param1":"value1","param2":"value2"}
      requestBody={}

      <<<log.request>>>
      [2024-01-01T06:00:00.000Z] 12345 undefined /api/example-endpoint
      type=request
      clientIp=undefined
      userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      contentType="application/json"
      referer="https://example.com"
      xForwardedFor="192.168.1.1"
      queryParams=undefined
      requestBody=undefined
      "
    `);
  });
});