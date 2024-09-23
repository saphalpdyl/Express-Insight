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