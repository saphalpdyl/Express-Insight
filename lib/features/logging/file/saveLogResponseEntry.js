import util from "util";
import { DEFAULT_LOG_IDENTIFIERS } from "../../../constants/index.js"

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
    '\n<<<%s>>>\n[%s] %s %s %s %d %dms', 
    DEFAULT_LOG_IDENTIFIERS.RESPONSE,
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