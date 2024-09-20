import { DATABASE_RESPONSE_TABLE } from "../../constants/index.js";

export function saveLogResponseToDB(db, responseInfo, requestId) {
  const insertStatement = db.prepare(`INSERT INTO ${DATABASE_RESPONSE_TABLE}(request_id,timestamp,status_code,response_time,content_type,content_length,response_body) VALUES (@requestId, @timestamp, @statusCode, @responseTime, @contentType, @contentLength, @responseBody)`);

  const payload = {
    requestId: requestId,
    timestamp: responseInfo.timestamp,
    statusCode: responseInfo.statusCode,
    responseTime: responseInfo.responseTime,
    contentType: responseInfo.responseHeaders['content-type'] || '',
    contentLength: responseInfo.responseHeaders['content-length'] || '',
    responseBody: responseInfo.responseBody || 'undefined',
  }

  const result = insertStatement.run(payload);
  
  return result.lastInsertRowid;
}