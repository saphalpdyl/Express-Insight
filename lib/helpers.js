import fs from "fs";

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