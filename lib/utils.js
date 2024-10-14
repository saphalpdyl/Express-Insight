import fs from "fs";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

export function getSystemMonthYear() {
  const date = new Date();
  const monthName = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  
  return `${monthName}-${year}`;
}

export function checkIfFolderExists(folderPath) {
  return fs.existsSync(folderPath);
}

export function checkIfFileExists(filePath) {
  return fs.existsSync(filePath);
}

export function createFolder(folderPath) {
  try {
    if ( checkIfFolderExists(folderPath) ) throw new Error("Folder already exists");

    fs.mkdirSync(folderPath);
    return true;
  } catch(e) {
    return false;
  }
}

export function getFileDirName(url) {
  const __fileName = fileURLToPath(url);
  const __dirName = dirname(__fileName);

  return {__fileName, __dirName};
}

export function generateLogLine(log_type, msg) {
  const LOG_TYPE_TO_COLOR = {
    "warn": "\x1b[33m",
    "error": "\x1b[31m",
    "info": "\x1b[46m",
  }

  return `${LOG_TYPE_TO_COLOR[log_type]}[expInsight]${msg}`;
}

export function consolePrint(log_type, msg) {
  console.log(generateLogLine(log_type, msg));
}

export function generateLogFilePath(monthYearLogFolderPath, date) {
  return path.join(monthYearLogFolderPath,`${(new Date()).toLocaleDateString().split("/").join("_")}.log`);
}

export function generateLogFileStream(monthYearLogFolderPath, date) {
  return fs.createWriteStream(generateLogFilePath(monthYearLogFolderPath, new Date()), {
      flags: "a",
    })
}

export function generateDateSelectionFilterQuery(dateFrom, dateTo) {
  const conditions = [];
  const params = [];

  if (dateFrom) {
    conditions.push("datetime(timestamp, 'utc') >= datetime(?, 'utc')");
    params.push(dateFrom);
  }

  if (dateTo) {
    // Add 1 second to dateTo to include the entire second
    const dateToObj = new Date(dateTo);
    dateToObj.setSeconds(dateToObj.getSeconds() + 1);
    const adjustedDateTo = dateToObj.toISOString();
    
    conditions.push("datetime(timestamp, 'utc') < datetime(?, 'utc')");
    params.push(adjustedDateTo);
  }

  if (conditions.length === 0) {
    // If no date range is specified, get today's logs in UTC
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    conditions.push("datetime(timestamp, 'utc') >= datetime(?, 'utc')");
    conditions.push("datetime(timestamp, 'utc') < datetime(?, 'utc')");
    params.push(today.toISOString(), tomorrow.toISOString());
  }

  return [ conditions.join(" AND "), params ];
}