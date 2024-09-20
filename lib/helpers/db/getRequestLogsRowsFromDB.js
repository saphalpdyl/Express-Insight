import { DATABASE_REQUEST_TABLE } from "../../constants/index.js";

export function getRequestLogsRowsFromDB(db, dateFrom, dateTo) {
  const conditions = [];
  const params = [];

  if (dateFrom !== undefined) {
    conditions.push("DATE(timestamp) >= DATE(?)");
    params.push(dateFrom);
  }

  if (dateTo !== undefined) {
    conditions.push("DATE(timestamp) <= DATE(?)");
    params.push(dateTo);
  }

  if (conditions.length === 0) {
    conditions.push("DATE(timestamp) = DATE('now')");
  }

  const query = `
    SELECT * FROM ${DATABASE_REQUEST_TABLE}
    WHERE ${conditions.join(" AND ")}
    ORDER BY timestamp DESC
  `;

  const stmt = db.prepare(query);
  return stmt.all(...params);
}