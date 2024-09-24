import { DATABASE_ERROR_TABLE } from "../../constants/index.js";

export function saveLogErrorToDB(db, errorInfo) {
  const stmt = db.prepare(`
    INSERT INTO ${DATABASE_ERROR_TABLE} (
      request_id, 
      error_id,
      timestamp, 
      error_type,
      error_message, 
      stack_trace,
      additional_info
    ) VALUES (@requestId, @errorId, @timestamp, @errorType, @message, @stackTrace, @additionalInfo)
  `);

  const payload = errorInfo;

  const result = stmt.run(payload);

  return result.lastInsertRowid;
}