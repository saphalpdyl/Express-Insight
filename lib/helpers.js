import util from "util";

export function saveLogRequestEntry(requestInfo, logFileStream) {
  const {
    requestId,
    timestamp,
    method,
    url,
    queryParams,
    headers,
    clientIp,
    requestBody
  } = requestInfo;

  const mainLine = util.format(
    '\n[%s] %s %s %s', 
    timestamp,
    requestId,
    method,
    url,         
  );

  const details = [
    `type=request`,
    `clientIp=${clientIp}`,
    `userAgent="${headers.userAgent}"`,
    `contentType="${headers.contentType}"`,
    `referer="${headers.referer}"`,
    `xForwardedFor="${headers.xForwardedFor}"`,
    `queryParams=${JSON.stringify(queryParams)}`,
    `requestBody=${requestBody || 'undefined'}`
  ];

  const log = `${mainLine}\n${details.join('\n')}`;

  logFileStream.write(log + "\n");
}

export function saveLogResponseEntry(responseInfo, logFileStream) {
  const {
    requestId,
    timestamp,
    method,
    url,
    statusCode,
    responseTime,
    responseBody,
    responseHeaders
  } = responseInfo;

  const mainLine = util.format(
    '\n[%s] %s %s %s %d %dms', 
    timestamp,
    requestId,
    method,
    url,
    statusCode,
    responseTime
  );

  const details = [
    `type=response`,
    `statusCode=${statusCode}`,
    `responseTime=${responseTime}ms`,
    `contentType="${responseHeaders['content-type'] || ''}"`,
    `contentLength=${responseHeaders['content-length'] || ''}`,
    `responseBody=${responseBody || 'undefined'}`
  ];

  const log = `${mainLine}\n${details.join('\n')}`;

  logFileStream.write(log + "\n");
}