import { DATABASE_REQUEST_TABLE } from "../../../constants/index.js";
import { generateDateSelectionFilterQuery } from "../../../utils.js";

export function getRequestLogsRowsFromDB(db, dateFrom, dateTo) {
  const [ conditions, params ] = generateDateSelectionFilterQuery(dateFrom, dateTo);

  const query = `
    SELECT * FROM ${DATABASE_REQUEST_TABLE}
    WHERE ${conditions}
    ORDER BY timestamp DESC
  `;
  
  const stmt = db.prepare(query);
  return stmt.all(...params);
}
