export function getAverageRequestPerDay(db) {
  const stmt = db.prepare(`
    SELECT round(CAST(AVG(requestMade) AS REAL), 1) as request_average
    FROM
    (SELECT date(timestamp) as Day, COUNT(*) as requestMade
    FROM request_logs
    GROUP BY date(timestamp)
    ) AS X
  `);

  return stmt.get().request_average || 0;
}