import { DATABASE_REQUEST_TABLE } from "../../constants/index.js";

export function getAllLogsFromDB(db, from, to) {
  if (!from) {
    from = new Date();
    from.setHours(0,0,0,0);
  }

  if(!to) {
    to = new Date();
    to.setHours(23,59,59,59);
  }

  const queryStatement = db.prepare(`SELECT * FROM ${DATABASE_REQUEST_TABLE} WHERE timestamp BETWEEN ? AND ?`);

  const requestResults = queryStatement.all(from.toISOString(), to.toISOString());

  return requestResults;
}