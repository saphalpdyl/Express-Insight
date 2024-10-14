import { DATABASE_RESPONSE_TABLE } from "../../../../constants/index.js";
import { generateDateSelectionFilterQuery } from "../../../../utils.js";

export function getAverageResponseSize(db, dateFrom, dateTo) {
  const [conditions, params] = generateDateSelectionFilterQuery(dateFrom, dateTo);
  
  const stmt = db.prepare(`
    SELECT round(CAST(AVG(response_size) AS REAL), 1) as request_average FROM ${DATABASE_RESPONSE_TABLE} WHERE ${conditions};
  `);

  return stmt.get(...params).request_average || 0;
}