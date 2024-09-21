import path from "path";

import { vi, expect, it, describe, beforeEach, beforeAll } from "vitest";
import { fs, vol } from "memfs";

import { generateLogFileStream, getSystemMonthYear, checkIfFolderExists, createFolder } from "../../../lib/utils.js";
import { saveLogRequestEntry, saveLogResponseEntry } from "../../../lib/helpers/index.js"

vi.mock("fs", () => ({
  default: fs,
  ...fs,
}));

describe('File logging tests', () => { 
  const mockCwd = "\\app";
  let settings;

  let monthYearLogFolderPath;
  let monthYearString;
  let logFolderPath;
  
  beforeAll(async () => {
    vol.reset();
    fs.mkdirSync("/app");

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
    expect(monthYearLogFolderPath).toBe(`${mockCwd}\\log\\January-2024`)
  });

  it('should create appropiate log folders ', () => {
    createFolder(logFolderPath);
    createFolder(monthYearLogFolderPath);

    expect(fs.existsSync(`${mockCwd}\\log`)).toBe(true);
    expect(fs.existsSync(monthYearLogFolderPath)).toBe(true);

    expect(createFolder(logFolderPath)).toBe(false);
  });
  
});