import { DATABASE_RESPONSE_TABLE } from "../../../../constants/index.js";

export function getAverageResponseTime(db) {
  const stmt = db.prepare(`
    SELECT AVG(response_time) AS avg_response_time
    FROM ${DATABASE_RESPONSE_TABLE}
    WHERE DATE(timestamp) = DATE('now')
  `);


  const result = stmt.get().avg_response_time;
  return result ? result.toPrecision(2) : 0;
}