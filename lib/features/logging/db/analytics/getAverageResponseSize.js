export function getAverageResponseSize(db) {
  const stmt = db.prepare(`
    SELECT round(CAST(AVG(response_size) AS REAL), 1) as request_average FROM response_logs;
  `);

  return stmt.get().request_average || 0;
}