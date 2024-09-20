import { DATABASE_REQUEST_TABLE } from "../../constants/index.js";

export function saveLogRequestToDB(db, requestInfo) {
  const insertStatement = db.prepare(`
    INSERT INTO ${DATABASE_REQUEST_TABLE}(request_id,timestamp,method,url,client_ip,user_agent,content_type,referer,x_forwarded_for,query_params,request_body) VALUES (@requestId, @timestamp, @method, @url, @clientIp, @userAgent, @contentType, @referer, @xForwardedFor, @queryParams, @requestBody)
    `);

  // Prepare payload
  const { headers } = requestInfo;
  
  const payload = {
    requestId: requestInfo.requestId,
    timestamp: requestInfo.timestamp,
    method: requestInfo.method,
    url: requestInfo.url,
    clientIp: requestInfo.clientIp,
    userAgent: headers.userAgent,
    contentType: headers.contentType,
    referer: headers.referer,
    xForwardedFor: headers.xForwardedFor,
    queryParams: JSON.stringify(requestInfo.queryParams),
    requestBody: requestInfo.requestBody,
  };

  const result = insertStatement.run(payload);

  return result.lastInsertRowid;
}