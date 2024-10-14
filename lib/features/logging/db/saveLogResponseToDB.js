import { DATABASE_RESPONSE_TABLE } from "../../../constants/index.js";

export function saveLogResponseToDB(db, responseInfo, requestId, excludeRequest=false) {
  const insertStatement = db.prepare(`
    INSERT INTO ${DATABASE_RESPONSE_TABLE} (
        request_id,
        timestamp,
        status_code,
        response_time,
        content_type,
        content_length,
        response_body,
        response_size
      ) VALUES ( 
        @requestId,
        @timestamp,
        @statusCode,
        @responseTime,
        @contentType,
        @contentLength,
        @responseBody,
        @responseSize
      )`
    );

  const payload = {
    requestId: excludeRequest ? null : requestId,
    timestamp: responseInfo.timestamp,
    statusCode: responseInfo.statusCode,
    responseTime: responseInfo.responseTime,
    contentType: responseInfo.responseHeaders['content-type'] || '',
    contentLength: responseInfo.responseHeaders['content-length'] || '',
    responseBody: responseInfo.responseBody || 'undefined',
    responseSize: responseInfo.responseSize || 0,
  }

  const result = insertStatement.run(payload);
  
  return result.lastInsertRowid;
}