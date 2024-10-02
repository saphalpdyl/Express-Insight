import { 
  DATABASE_REQUEST_TABLE,
  DATABASE_RESPONSE_TABLE,
} from "../../../constants/index.js";

export function getAllLogsFromDB(db, from, to) {
  if (!from) {
    from = new Date();
    from.setHours(0,0,0,0);
  }

  if(!to) {
    to = new Date();
    to.setHours(23,59,59,59);
  }

  const requestQueryStatement = db.prepare(`SELECT * FROM ${DATABASE_REQUEST_TABLE} WHERE timestamp BETWEEN ? AND ?`);
  const requestResults = requestQueryStatement.all(from.toISOString(), to.toISOString());

  const responseQueryStatement = db.prepare(`SELECT * FROM ${DATABASE_RESPONSE_TABLE} WHERE timestamp BETWEEN ? AND ?`);
  const responseResults = responseQueryStatement.all(from.toISOString(), to.toISOString());

  return [requestResults, responseResults];
}