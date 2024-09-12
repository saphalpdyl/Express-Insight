import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

export function getSystemMonthYear() {
  const date = new Date();
  const monthName = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  
  return `${monthName}-${year}`;
}

export function checkIfFolderExists(folderPath) {
  return fs.existsSync(folderPath);
}

export function createFolder(folderPath) {
  try {
    if ( checkIfFolderExists(folderPath) ) throw new Error("Folder already exists");

    fs.mkdirSync(folderPath);
    return true;
  } catch(e) {
    console.error(`[fs.create] Couldn't create directory ${e}`);
    return false;
  }
}

export function getFileDirName(url) {
  const __fileName = fileURLToPath(url);
  const __dirName = dirname(__fileName);

  return {__fileName, __dirName};
}