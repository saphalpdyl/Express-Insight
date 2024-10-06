import Database from "better-sqlite3";
import path from "path";
import { generateRequiredTables } from "./generateRequiredTables.js";
import { checkIfFileExists } from "../../../utils.js";

export function initializeDB(folderPath, dbFileName) {
  let dbExists = true;
  
  if(!checkIfFileExists(path.join(folderPath, `${dbFileName}.db`))) {
    dbExists = false;
  }
  
  const db = new Database( process.env.NODE_ENV != "test" ? path.join(folderPath, `${dbFileName}.db`) : ":memory:");
  db.pragma('journal_mode = WAL');

  // If file doesn't exists then generate the necessary
  if(!dbExists)
    generateRequiredTables(db);
  
  return db;
}