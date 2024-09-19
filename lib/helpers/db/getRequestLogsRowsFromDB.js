import { DATABASE_REQUEST_TABLE } from "../../constants/index.js";

export function getRequestLogsRowsFromDB(db) {
  const stmt = db.prepare(`
    SELECT * FROM ${DATABASE_REQUEST_TABLE}
    WHERE DATE(timestamp) = DATE('now');  
  `);

  return stmt.all()
}