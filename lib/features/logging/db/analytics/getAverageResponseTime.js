import { DATABASE_RESPONSE_TABLE } from "../../../../constants/index.js";
import { generateDateSelectionFilterQuery } from "../../../../utils.js";

export function getAverageResponseTime(db, dateFrom, dateTo) {
  const [conditions, params] = generateDateSelectionFilterQuery(dateFrom, dateTo);
  
  const stmt = db.prepare(`
    SELECT AVG(response_time) AS avg_response_time
    FROM ${DATABASE_RESPONSE_TABLE}
    WHERE ${conditions}
  `);


  const result = stmt.get(...params).avg_response_time;
  return result ? result.toPrecision(2) : 0;
}