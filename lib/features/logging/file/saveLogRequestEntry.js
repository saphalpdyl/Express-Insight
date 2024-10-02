import util from "util";
import { DEFAULT_LOG_IDENTIFIERS } from "../../../constants/index.js"

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
    '\n<<<%s>>>\n[%s] %s %s %s', 
    DEFAULT_LOG_IDENTIFIERS.REQUEST,
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