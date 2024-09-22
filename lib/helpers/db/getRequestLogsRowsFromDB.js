import { DATABASE_REQUEST_TABLE } from "../../constants/index.js";

export function getRequestLogsRowsFromDB(db, dateFrom, dateTo) {
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

  const query = `
    SELECT * FROM ${DATABASE_REQUEST_TABLE}
    WHERE ${conditions.join(" AND ")}
    ORDER BY timestamp DESC
  `;

  const stmt = db.prepare(query);
  return stmt.all(...params);
}
