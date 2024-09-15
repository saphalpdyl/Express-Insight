export function saveLogResponseToDB(db, responseInfo, requestId) {
  const insertStatement = db.prepare(`INSERT INTO response_logs (request_id,timestamp,status_code,response_time,content_type,content_length,response_body) VALUES (@requestId, @timestamp, @statusCode, @responseTime, @contentType, @contentLength, @responseBody)`);

  const payload = {
    requestId: requestId,
    timestamp: responseInfo.timestamp,
    statusCode: responseInfo.statusCode,
    responseTime: responseInfo.responseTime,
    contentType: responseInfo.responseHeaders['content-type'] || '',
    contentLength: responseInfo.responseHeaders['content-length'] || '',
    responseBody: responseInfo.responseBody || 'undefined',
  }

  insertStatement.run(payload);
}