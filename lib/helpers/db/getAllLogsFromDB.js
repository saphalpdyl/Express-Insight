export function getAllLogsFromDB(db, from, to) {
  if (!from) {
    from = new Date();
    from.setHours(0,0,0,0);
  }

  if(!to) {
    to = new Date();
    to.setHours(23,59,59,59);
  }

  const queryStatement = db.prepare(`SELECT * FROM request_logs WHERE timestamp BETWEEN ? AND ?`);

  const results = queryStatement.all(from.toISOString(), to.toISOString());

  return results;
}