export function generateRecentAPIActivityChartData(db) {
  const generateStatement = db.prepare(`
    WITH RECURSIVE
    time_intervals(interval_start) AS (
      SELECT datetime('now', 'start of day', 'localtime')
      UNION ALL
      SELECT datetime(interval_start, '+5 minutes')
      FROM time_intervals
      WHERE interval_start < datetime('now', 'localtime')
    )
    SELECT 
      time_intervals.interval_start,
      COALESCE(COUNT(request_logs.id), 0) AS request_count
    FROM 
      time_intervals
    LEFT JOIN 
      request_logs ON datetime(request_logs.timestamp, 'localtime') >= time_intervals.interval_start
                  AND datetime(request_logs.timestamp, 'localtime') < datetime(time_intervals.interval_start, '+5 minutes')
                  AND date(request_logs.timestamp, 'localtime') = date('now', 'localtime')
    GROUP BY 
      time_intervals.interval_start
    ORDER BY 
      time_intervals.interval_start;
    `);

    return generateStatement.all();
}